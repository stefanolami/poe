import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { produce } from 'immer'
import { selectionData } from '@/data/data'

// Interfaces
interface Price {
	euAdmin: string
	eu27: string
	brazil: string
	turkey: string
	colombia: string
	russia: string
}

interface SelectableItem {
	value: string
	label: string
	price?: Price
	geographies?: SelectableItem[]
}

interface MobilityData {
	typeOfVehicle: SelectableItem[]
	typeOfVehicleContract: SelectableItem[]
	eVehiclesMaintenance: SelectableItem[]
	chargingStations: SelectableItem[]
	chargingStationsContract: SelectableItem[]
	report: SelectableItem[]
}

interface Sector {
	value: string
	label: string
}

interface StoreState {
	sector: Sector | Record<string, never>
	geographies: SelectableItem[]
	languages: SelectableItem[]
	data: {
		eMobility: MobilityData
	}
	changeSector: (newSector: Sector) => void
	addGeography: (newGeography: SelectableItem) => void
	removeGeography: (geographyToRemove: SelectableItem) => void
	addSingleGeography: (
		geography: SelectableItem,
		category: keyof MobilityData,
		item: SelectableItem
	) => void
	removeSingleGeography: (
		geographyToRemove: SelectableItem,
		category: keyof MobilityData,
		item: SelectableItem
	) => void
	addLanguage: (newLanguage: SelectableItem) => void
	removeLanguage: (languageToRemove: SelectableItem) => void
	addData: (category: keyof MobilityData, item: SelectableItem) => void
	removeData: (
		category: keyof MobilityData,
		itemToRemove: SelectableItem
	) => void
	getSinglePrice: (
		category: keyof MobilityData,
		item: SelectableItem
	) => number
	getModalSinglePrice: (
		category: keyof MobilityData,
		item: SelectableItem
	) => number
	getAllAbovePrice: (category: keyof MobilityData) => number
}

export const useStore = create<StoreState>()(
	persist(
		devtools((set, get) => ({
			sector: {},
			geographies: [],
			languages: [],
			data: {
				eMobility: {
					typeOfVehicle: [],
					typeOfVehicleContract: [],
					eVehiclesMaintenance: [],
					chargingStations: [],
					chargingStationsContract: [],
					report: [],
				},
			},
			changeSector: (newSector) => set(() => ({ sector: newSector })),
			addGeography: (newGeography) => {
				set((state) => ({
					geographies: [...state.geographies, newGeography],
				}))
				Object.keys(get().data.eMobility).forEach((category) => {
					if (
						[
							'typeOfVehicleContract',
							'chargingStationsContract',
							'report',
						].includes(category)
					)
						return
					const key = category as keyof MobilityData
					get().data.eMobility[key]?.forEach((item) => {
						get().removeData(key, item)
						get().addData(key, item)
					})
				})
			},
			removeGeography: (geographyToRemove) => {
				set((state) => ({
					geographies: state.geographies.filter(
						(geo) => geo.value !== geographyToRemove.value
					),
				}))
			},
			addSingleGeography: (geography, category, item) => {
				set(
					produce((state: StoreState) => {
						const targetItem = state.data.eMobility[category].find(
							(el) => el.value === item.value
						)
						if (targetItem) targetItem.geographies?.push(geography)
					})
				)
			},
			removeSingleGeography: (geographyToRemove, category, item) => {
				set(
					produce((state: StoreState) => {
						const targetItem = state.data.eMobility[category].find(
							(el) => el.value === item.value
						)
						if (targetItem) {
							targetItem.geographies =
								targetItem.geographies?.filter(
									(geo) =>
										geo.value !== geographyToRemove.value
								)
						}
					})
				)
			},
			addLanguage: (newLanguage) =>
				set((state) => ({
					languages: [...state.languages, newLanguage],
				})),
			removeLanguage: (languageToRemove) =>
				set((state) => ({
					languages: state.languages.filter(
						(lang) => lang.value !== languageToRemove.value
					),
				})),
			addData: (category, item) => {
				set(
					produce((state: StoreState) => {
						if (
							[
								'typeOfVehicleContract',
								'chargingStationsContract',
							].includes(category)
						) {
							if (state.data.eMobility[category]) {
								;(
									state.data.eMobility[
										category
									] as SelectableItem[]
								).push(item)
							}
						} else {
							const newItem = {
								...item,
								geographies: state.geographies,
							}
							;(
								state.data.eMobility[
									category
								] as SelectableItem[]
							).push(newItem)
						}
					})
				)
			},
			removeData: (category, itemToRemove) => {
				set(
					produce((state: StoreState) => {
						state.data.eMobility[category] = (
							state.data.eMobility[category] as SelectableItem[]
						).filter((item) => item.value !== itemToRemove.value)
					})
				)
			},
			getSinglePrice: (category, item) => {
				const sectorValue = get().sector?.value

				// Ensure sectorValue is a valid key in selectionData
				if (!sectorValue || !(sectorValue in selectionData)) {
					return 0 // Return 0 if sectorValue is invalid
				}

				const sectorData =
					selectionData[sectorValue as keyof typeof selectionData]

				return get().geographies.reduce((total, country) => {
					const categoryData: SelectableItem[] =
						sectorData[category as keyof typeof sectorData]
					const itemData = categoryData.find(
						(x) => x.value === item.value
					)

					const price =
						itemData?.price?.[country.value as keyof Price] || '0'

					return total + parseInt(price, 10)
				}, 0)
			},
			getModalSinglePrice: (category, item) => {
				const sectorValue = get().sector?.value

				// Ensure sectorValue is a valid key in selectionData
				if (!sectorValue || !(sectorValue in selectionData)) {
					return 0 // Return 0 if sectorValue is invalid
				}

				const sectorData =
					selectionData[sectorValue as keyof typeof selectionData]
				const categoryData: SelectableItem[] =
					sectorData[category as keyof typeof sectorData]

				// Find the item in the category
				const itemData = categoryData?.find(
					(x) => x.value === item.value
				)

				// Ensure itemData and its geographies exist
				if (!itemData || !itemData.geographies) {
					return 0
				}

				// Calculate the total price for the item's geographies
				return itemData.geographies.reduce((total, country) => {
					const price =
						itemData.price?.[country.value as keyof Price] || '0'
					return total + parseInt(price, 10)
				}, 0)
			},
			getAllAbovePrice: (category) => {
				const sectorValue = get().sector?.value

				// Ensure sectorValue is a valid key in selectionData
				if (!sectorValue || !(sectorValue in selectionData)) {
					return 0 // Return 0 if sectorValue is invalid
				}

				const sectorData =
					selectionData[sectorValue as keyof typeof selectionData]
				const categoryData: SelectableItem[] =
					sectorData[category as keyof typeof sectorData]

				// Ensure categoryData is an array
				if (!Array.isArray(categoryData)) {
					return 0 // Return 0 if categoryData is not an array
				}

				// Calculate the total price for all items in the category
				return categoryData.reduce((total, item) => {
					return total + get().getSinglePrice(category, item)
				}, 0)
			},
		})),
		{ name: 'store', storage: createJSONStorage(() => localStorage) }
	)
)
