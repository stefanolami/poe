import { ClientDataJsonType, ClientSelectionType } from '@/lib/types'

export type Price = {
	[countryCode: string]: string
}

export interface SelectableItem {
	value: string
	label: string
	price?: Price
	geographies?: SelectableItem[]
}

export interface CategoryData {
	label: string
	value: string
	fieldsLabel?: string
	fields: SelectableItem[]
	contractsLabel?: string
	contracts?: SelectableItem[]
}

export interface MobilityData {
	typeOfVehicle: SelectableItem[]
	typeOfVehicleContract: SelectableItem[]
	chargingStations: SelectableItem[]
	chargingStationsContract: SelectableItem[]
	pif: SelectableItem[]
	deployment: SelectableItem[]
	project: SelectableItem[]
}

export interface Sector {
	value: string
	label: string
}

export interface StoreState {
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
	getSinglePriceFromDB: (
		category: keyof ClientSelectionType,
		item: ClientDataJsonType
	) => number
	getModalSinglePrice: (
		category: keyof MobilityData,
		item: SelectableItem
	) => number
	getAllAbovePrice: (category: keyof MobilityData) => number
	getSubTotalPrice: (category: keyof MobilityData) => number
	getTotalPrice: () => number
	getTotalPriceFromDB: (clientSelection: ClientSelectionType) => number
}

export interface User {
	sectors: string[] // List of selected sectors
	chosenLanguage: string // Selected language(s) as a string
	email: string // User's email
	name: string // User's name
	accountConfirmed: boolean // Whether the account is confirmed
	typeOfVehicle: { name: string; geography: string[] }[]
	typeOfVehicleContract: string[]
	chargingStations: { name: string; geography: string[] }[]
	chargingStationsContract: string[]
	report: string[]
}

export interface UserSelection {
	typeOfVehicle: { name: string; geography: string[] }[]
	typeOfVehicleContract: string[]
	chargingStations: { name: string; geography: string[] }[]
	chargingStationsContract: string[]
	pif: string[]
}

export interface AuthStoreState {
	userRole: string | null
	authInitialized: boolean
	setUserRole: (role: string | null) => void
	setAuthInitialized: (initialized: boolean) => void
}
