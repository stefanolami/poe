import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { produce } from 'immer'
import { selectionData } from '@/data/data'
import {
	Price,
	SelectableItem,
	MobilityData,
	StoreState,
	//User,
	//UserSelection,
	CategoryData,
} from './store.types'
import { ClientDataJsonType, ClientSelectionType } from '@/lib/types'

export const useStore = create<StoreState>()(
	persist(
		devtools((set, get) => ({
			sector: {},
			geographies: [],
			languages: [],
			userRole: null,
			data: {
				eMobility: {
					typeOfVehicle: [],
					typeOfVehicleContract: [],
					chargingStations: [],
					chargingStationsContract: [],
					pif: [],
					deployment: [],
					project: [],
				},
			},
			changeSector: (newSector) => set(() => ({ sector: newSector })),
			addGeography: (newGeography) => {
				set((state) => ({
					geographies: [...state.geographies, newGeography],
				}))
				Object.keys(get().data.eMobility).forEach((category) => {
					if (
						![
							'typeOfVehicleContract',
							'chargingStationsContract',
							'report',
						].includes(category)
					) {
						const key = category as keyof MobilityData

						get().data.eMobility[key]?.forEach((item) => {
							get().removeData(key, item)
							get().addData(key, item)
						})
					}
				})
			},
			removeGeography: (geographyToRemove) => {
				set((state) => ({
					geographies: state.geographies.filter(
						(geo) => geo.value !== geographyToRemove.value
					),
				}))
				Object.keys(get().data.eMobility).forEach((category) => {
					if (
						![
							'typeOfVehicleContract',
							'chargingStationsContract',
							'report',
						].includes(category)
					) {
						const key = category as keyof MobilityData

						get().data.eMobility[key]?.forEach((item) => {
							get().removeData(key, item)
							get().addData(key, item)
						})
					}
				})
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
				let total = 0
				get().geographies.forEach((country) => {
					total += parseInt(
						//@ts-expect-error I hate you typescript
						selectionData[get().sector?.value][
							category
						].fields.find(
							(x: SelectableItem) => x.value === item.value
						).price[country.value as keyof Price]
					)
				})
				return total
			},
			getSinglePriceFromDB: (
				category: string,
				item: {
					value: string
					price?: Price | undefined
					geographies: SelectableItem[]
				}
			) => {
				let total = 0
				item.geographies.forEach((country) => {
					/* console.log(
						`${category}: Adding price for item ${item.value}, country ${country.value}. TOTAL: ${total}`
					) */
					total += parseInt(
						//@ts-expect-error I hate you typescript
						selectionData[get().sector?.value][
							category
						].fields.find(
							(x: SelectableItem) => x.value === item.value
						).price[country.value as keyof Price]
					)
				})
				return total
			},
			getModalSinglePrice: (category, item) => {
				let total = 0
				const dataItem = get().data.eMobility[category].find(
					(element) => element.value === item.value
				)
				if (dataItem) {
					const geographies = item.geographies || []
					geographies.forEach((country: SelectableItem) => {
						const price = item.price?.[country.value as keyof Price]
						if (price) {
							total += parseInt(price, 10)
						}
					})
				}

				return total
			},
			getAllAbovePrice: (category) => {
				const sectorValue = get().sector?.value

				// Ensure sectorValue is a valid key in selectionData
				if (!sectorValue || !(sectorValue in selectionData)) {
					return 0 // Return 0 if sectorValue is invalid
				}

				const sectorData =
					selectionData[sectorValue as keyof typeof selectionData]
				const categoryData = (
					sectorData[
						category as keyof typeof sectorData
					] as CategoryData
				).fields

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
						category !== 'report'
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

				/* // Add fixed prices for reports if applicable
				const reportItems = get().data.eMobility.report
				if (reportItems.find((item) => item.value === 'eu')) {
					total += 8000
				}
				if (reportItems.find((item) => item.value === 'nonEu')) {
					total += 11000
				} */

				// Apply language-based increment
				const languageCount = get().languages.length
				if (languageCount > 0) {
					const increment = languageCount * 0.25 // 25% increment per language
					total *= 1 + increment
				}

				return total
			},
			/* getTotalPriceFromDB: (
				clientSelection: { [key: string]: string[] },
				geographies: string[]
			) => {
				let total = 0

				// Iterate over the keys of eMobility
				Object.keys(clientSelection).forEach((category) => {
					// Ensure category is a valid key of MobilityData
					if (
						category !== 'typeOfVehicleContract' &&
						category !== 'chargingStationsContract' &&
						category !== 'report'
					) {
						const items = clientSelection[category]
						if (Array.isArray(items)) {
							items.forEach((item) => {
								total += get().getSinglePriceFromDB(
									category as keyof MobilityData,
									item,
									geographies
								)
							})
						}
					}
				})

				return total
			}, */
			getTotalPriceFromDB: (clientSelection: ClientSelectionType) => {
				let total = 0

				// Iterate over the keys of eMobility
				Object.keys(clientSelection).forEach((category) => {
					// Ensure category is a valid key of MobilityData
					if (
						category !== 'typeOfVehicleContract' &&
						category !== 'chargingStationsContract'
					) {
						const items =
							clientSelection[
								category as keyof ClientSelectionType
							]
						if (Array.isArray(items)) {
							items.forEach((item) => {
								total += get().getSinglePriceFromDB(
									category as keyof ClientSelectionType,
									item as ClientDataJsonType
								)
							})
						}
					}
				})

				return total
			},
			/* getUser: (confirmed: boolean): User => {
				const selection: UserSelection = {
					typeOfVehicle: [],
					typeOfVehicleContract: [],
					chargingStations: [],
					chargingStationsContract: [],
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
			}, */
			setUserRole: (role: 'client' | 'admin' | null) => {
				set(
					produce((state: StoreState) => {
						state.userRole = role
					})
				)
			},
			removeUserRole: () => {
				set(
					produce((state: StoreState) => {
						state.userRole = null
					})
				)
			},
		})),
		{ name: 'store', storage: createJSONStorage(() => localStorage) }
	)
)
