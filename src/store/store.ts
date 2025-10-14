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
			initialPlan: null,
			subscriptionRemainingDays: 365,
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
			// Sanitize any duplicated entries in persisted arrays on first access
			__sanitize: () => {
				set(
					produce((state: StoreState) => {
						state.geographies = state.geographies.filter(
							(g, i, arr) =>
								arr.findIndex((x) => x.value === g.value) === i
						)
						state.languages = state.languages.filter(
							(l, i, arr) =>
								arr.findIndex((x) => x.value === l.value) === i
						)
						// Also ensure each item's geographies are unique
						Object.keys(state.data.eMobility).forEach((cat) => {
							;(
								state.data.eMobility[
									cat as keyof MobilityData
								] || []
							).forEach((item) => {
								item.geographies = item.geographies?.filter(
									(g, i, arr) =>
										arr.findIndex(
											(x) => x.value === g.value
										) === i
								)
							})
						})
					})
				)
			},
			captureInitialPlan: () => {
				// Deep clone current plan to allow diffing later
				const snapshot: MobilityData = JSON.parse(
					JSON.stringify(get().data.eMobility)
				)
				set({ initialPlan: snapshot })
			},
			resetInitialPlan: () => set({ initialPlan: null }),
			setSubscriptionRemainingDays: (days: number) =>
				set({ subscriptionRemainingDays: days }),
			changeSector: (newSector) => set(() => ({ sector: newSector })),
			addGeography: (newGeography) => {
				set((state) => {
					// ensure uniqueness by value
					const exists = state.geographies.some(
						(g) => g.value === newGeography.value
					)
					return exists
						? { geographies: state.geographies }
						: { geographies: [...state.geographies, newGeography] }
				})
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
						if (targetItem) {
							if (!targetItem.geographies)
								targetItem.geographies = []
							const exists = targetItem.geographies.some(
								(g) => g.value === geography.value
							)
							if (!exists) {
								targetItem.geographies.push(geography)
							}
						}
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
				set((state) => {
					const exists = state.languages.some(
						(l) => l.value === newLanguage.value
					)
					return exists
						? { languages: state.languages }
						: { languages: [...state.languages, newLanguage] }
				}),
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
							// Important: clone geographies so each item maintains its own selection
							const uniqueGlobalGeos = state.geographies.filter(
								(g, idx, arr) =>
									arr.findIndex(
										(x) => x.value === g.value
									) === idx
							)
							const newItem = {
								...item,
								geographies: uniqueGlobalGeos.map((g) => ({
									...g,
								})),
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
				//console.log('ITEM:', item)
				let total = 0
				item.geographies.forEach((country) => {
					console.log(
						`${category}: Adding price for item ${item.value}, country ${country.label}. TOTAL: ${total}`
					)
					total += parseInt(
						//@ts-expect-error I hate you typescript
						selectionData.eMobility[category].fields.find(
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
			getAddedItems: () => {
				const initial = get().initialPlan
				if (!initial)
					return [] as {
						category: keyof MobilityData
						item: SelectableItem
						annualPrice: number
					}[]
				const added: {
					category: keyof MobilityData
					item: SelectableItem
					annualPrice: number
				}[] = []
				;(
					Object.keys(get().data.eMobility) as (keyof MobilityData)[]
				).forEach((category: keyof MobilityData) => {
					if (
						(
							[
								'typeOfVehicleContract',
								'chargingStationsContract',
							] as (keyof MobilityData | string)[]
						).includes(category)
					)
						return
					const currentItems: SelectableItem[] =
						get().data.eMobility[category] || []
					const initialItems: SelectableItem[] =
						initial[category] || []
					currentItems.forEach((item: SelectableItem) => {
						const existed = initialItems.find(
							(i: SelectableItem) => i.value === item.value
						)
						if (!existed) {
							const annualPrice = get().getModalSinglePrice(
								category,
								item
							)
							added.push({ category, item, annualPrice })
						} else {
							const newGeos = (item.geographies || []).filter(
								(g: SelectableItem) =>
									!existed.geographies?.some(
										(eg: SelectableItem) =>
											eg.value === g.value
									)
							)
							if (newGeos.length > 0) {
								const incremental: SelectableItem = {
									...item,
									geographies: newGeos,
								}
								const annualPrice = get().getModalSinglePrice(
									category,
									incremental
								)
								added.push({
									category,
									item: incremental,
									annualPrice,
								})
							}
						}
					})
				})
				return added
			},
			getRemovedItems: () => {
				const initial = get().initialPlan
				if (!initial)
					return [] as {
						category: keyof MobilityData
						item: SelectableItem
					}[]
				const removed: {
					category: keyof MobilityData
					item: SelectableItem
				}[] = []
				;(Object.keys(initial) as (keyof MobilityData)[]).forEach(
					(category: keyof MobilityData) => {
						if (
							(
								[
									'typeOfVehicleContract',
									'chargingStationsContract',
								] as (keyof MobilityData | string)[]
							).includes(category)
						)
							return
						const initialItems: SelectableItem[] =
							initial[category] || []
						const currentItems: SelectableItem[] =
							get().data.eMobility[category] || []
						initialItems.forEach((item: SelectableItem) => {
							const exists = currentItems.find(
								(ci: SelectableItem) => ci.value === item.value
							)
							if (!exists) {
								removed.push({ category, item })
							} else {
								const removedGeos = (
									item.geographies || []
								).filter(
									(g: SelectableItem) =>
										!exists.geographies?.some(
											(cg: SelectableItem) =>
												cg.value === g.value
										)
								)
								if (removedGeos.length > 0) {
									removed.push({
										category,
										item: {
											...item,
											geographies: removedGeos,
										},
									})
								}
							}
						})
					}
				)
				return removed
			},
			getAddedItemsAnnualTotal: () => {
				const added = get().getAddedItems()
				let total = added.reduce((sum, row) => sum + row.annualPrice, 0)
				const languageCount = get().languages.length
				if (languageCount > 0) {
					const increment = languageCount * 0.25
					total *= 1 + increment
				}
				return total
			},
			getAddedItemsProratedTotal: () => {
				const annual = get().getAddedItemsAnnualTotal()
				const remaining = get().subscriptionRemainingDays
				// Fallback to annual if remaining not set or invalid
				if (!remaining || remaining <= 0 || remaining > 365) {
					return Math.round(annual)
				}
				return Math.round((annual * remaining) / 365)
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
		})),
		{ name: 'store', storage: createJSONStorage(() => localStorage) }
	)
)
