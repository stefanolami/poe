import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { produce } from 'immer'
import { selectionData } from '@/data/data'
import {
	Price,
	SelectableItem,
	MobilityData,
	StoreState,
	User,
	UserSelection,
} from './store.types'

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
					const categoryData: SelectableItem[] = (
						sectorData[category as keyof typeof sectorData] as {
							fields: SelectableItem[]
						}
					).fields
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
			getSubTotalPrice: () => {
				let total = 0

				// Iterate over the keys of eMobility
				Object.keys(get().data.eMobility).forEach((category) => {
					// Ensure category is a valid key of MobilityData
					if (
						category !== 'typeOfVehicleContract' &&
						category !== 'chargingStationsContract' &&
						category !== 'reportEu' &&
						category !== 'reportNonEu'
					) {
						const items =
							get().data.eMobility[category as keyof MobilityData]
						if (Array.isArray(items)) {
							items.forEach((item) => {
								total += get().getModalSinglePrice(
									category as keyof MobilityData,
									item
								)
							})
						}
					}
				})

				// Add fixed prices for reports if applicable
				const reportItems = get().data.eMobility.report
				if (reportItems.find((item) => item.value === 'reportEu')) {
					total += 8000
				}
				if (reportItems.find((item) => item.value === 'reportNonEu')) {
					total += 11000
				}

				return total
			},
			getTotalPrice: () => {
				let total = 0

				// Iterate over the keys of eMobility
				Object.keys(get().data.eMobility).forEach((category) => {
					// Ensure category is a valid key of MobilityData
					if (
						category !== 'typeOfVehicleContract' &&
						category !== 'chargingStationsContract' &&
						category !== 'reportEu' &&
						category !== 'reportNonEu'
					) {
						const items =
							get().data.eMobility[category as keyof MobilityData]
						if (Array.isArray(items)) {
							items.forEach((item) => {
								total += get().getModalSinglePrice(
									category as keyof MobilityData,
									item
								)
							})
						}
					}
				})

				// Add fixed prices for reports if applicable
				const reportItems = get().data.eMobility.report
				if (reportItems.find((item) => item.value === 'reportEu')) {
					total += 8000
				}
				if (reportItems.find((item) => item.value === 'reportNonEu')) {
					total += 11000
				}

				// Apply language-based increment
				const languageCount = get().languages.length
				if (languageCount > 0) {
					const increment = languageCount * 0.25 // 25% increment per language
					total *= 1 + increment
				}

				return total
			},
			getUser: (confirmed: boolean): User => {
				const selection: UserSelection = {
					typeOfVehicle: [],
					typeOfVehicleContract: [],
					chargingStations: [],
					chargingStationsContract: [],
					report: [],
				}

				Object.keys(get().data.eMobility).forEach((category) => {
					if (
						category === 'typeOfVehicle' ||
						category === 'chargingStations'
					) {
						const items =
							get().data.eMobility[category as keyof MobilityData]
						if (Array.isArray(items)) {
							items.forEach((item) => {
								selection[
									category as
										| 'typeOfVehicle'
										| 'chargingStations'
								].push({
									name: item.value,
									geography:
										item.geographies?.map(
											(geo) => geo.value
										) || [],
								})
							})
						}
					} else if (
						category === 'typeOfVehicleContract' ||
						category === 'chargingStationsContract'
					) {
						const items =
							get().data.eMobility[category as keyof MobilityData]
						if (Array.isArray(items)) {
							items.forEach((item) => {
								selection[
									category as
										| 'typeOfVehicleContract'
										| 'chargingStationsContract'
								].push(item.value)
							})
						}
					}
				})

				return {
					sectors: [get().sector?.value || 'unknown'],
					chosenLanguage:
						get().languages.length > 0
							? get()
									.languages.map((lang) => lang.value)
									.join(' ')
							: 'english',
					email: 'example@email.com',
					name: 'John Doe',
					accountConfirmed: confirmed,
					...selection,
				}
			},
		})),
		{ name: 'store', storage: createJSONStorage(() => localStorage) }
	)
)
