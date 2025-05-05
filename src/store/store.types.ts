export interface Price {
	euAdmin: string
	eu27: string
	brazil: string
	turkey: string
	colombia: string
	russia: string
	default?: string
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
	fieldsLabel: string
	fields: SelectableItem[]
	contractsLabel: string
	contracts?: SelectableItem[]
}

export interface MobilityData {
	typeOfVehicle: SelectableItem[]
	typeOfVehicleContract: SelectableItem[]
	eVehiclesMaintenance: SelectableItem[]
	chargingStations: SelectableItem[]
	chargingStationsContract: SelectableItem[]
	report: SelectableItem[]
}

export interface Sector {
	value: string
	label: string
}

export interface StoreState {
	sector: Sector | Record<string, never>
	geographies: SelectableItem[]
	languages: SelectableItem[]
	clientSession: {
		id: number
		email: string
	}
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
	getSubTotalPrice: (category: keyof MobilityData) => number
	getTotalPrice: () => number
	getUser: (confirmed: boolean) => User
	createClientSession: (id: number, email: string) => void
	removeClientSession: () => void
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
	report: string[]
}
