import { z } from 'zod'
import {
	createAccountSchema,
	createGrantSchema,
	createGrantsTailoredAssessmentSchema,
	forgotPasswordSchema,
	loginSchema,
	updateAccountSchema,
	updatePasswordSchema,
} from './zod-schemas'

export type CreateAccountType = z.infer<typeof createAccountSchema>

export type UpdateAccountType = z.infer<typeof updateAccountSchema>

export type LoginType = z.infer<typeof loginSchema>

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>

export type UpdatePasswordType = z.infer<typeof updatePasswordSchema>

export type CreateGrantType = z.infer<typeof createGrantSchema>

export type Price = {
	[countryCode: string]: string
}

export type SelectionDataEmobilityType = {
	/* [category: string]: {
		label: string
		value: string
		fieldsLabel?: string
		fields: {
			value: string
			label: string
			price?: Price
		}[]
		contracts?: {
			value: string
			label: string
		}[]
	} */
	typeOfVehicle: {
		label: string
		value: string
		fieldsLabel?: string
		fields: {
			value: string
			label: string
			price?: Price
		}[]
		contracts?: {
			value: string
			label: string
		}[]
	}
	chargingStations: {
		label: string
		value: string
		fieldsLabel?: string
		fields: {
			value: string
			label: string
			price?: Price
		}[]
		contracts?: {
			value: string
			label: string
		}[]
	}
	pif: {
		label: string
		value: string
		fieldsLabel?: string
		fields: {
			value: string
			label: string
			price?: Price
		}[]
		contracts?: {
			value: string
			label: string
		}[]
	}
	deployment: {
		label: string
		value: string
		fieldsLabel?: string
		fields: {
			value: string
			label: string
			price?: Price
		}[]
		contracts?: {
			value: string
			label: string
		}[]
	}
	project: {
		label: string
		value: string
		fieldsLabel?: string
		fields: {
			value: string
			label: string
			price?: Price
		}[]
		contracts?: {
			value: string
			label: string
		}[]
	}
}

export type CreateGrantsTailoredAssessmentType = z.infer<
	typeof createGrantsTailoredAssessmentSchema
>

export type Geography = {
	value: string
	label: string
}

export interface PriceModalDataType {
	general: boolean
	typeOfVehicle: {
		cars: boolean
		buses: boolean
		trucks: boolean
		planes: boolean
		boats: boolean
		twoWheelers: boolean
	}
	eVehiclesMaintenance: {
		evServices: boolean
		diagnosis: boolean
		exchangePurchase: boolean
		cars: boolean
		buses: boolean
		trucks: boolean
		planes: boolean
		boats: boolean
		twoWheelers: boolean
	}
	chargingStations: {
		bikesCars: boolean
		buses: boolean
		trucks: boolean
		planes: boolean
		boats: boolean
		twoWheelers: boolean
	}
}

export type ClientDataJsonType = {
	value: string
	price?: Price
	geography: string[]
}

export type ClientDataType = {
	charging_stations_contract: string[] | null
	charging_stations_type: ClientDataJsonType[] | null
	consultant: number | null
	created_at: string
	deployment: ClientDataJsonType[] | null
	email: string
	family_name: string
	geography?: string[] | null
	id: number
	name: string
	org_name: string | null
	pif: ClientDataJsonType[] | null
	project: ClientDataJsonType[] | null
	sector: string | null
	user_id: string
	vehicles_contract: string[] | null
	vehicles_type: ClientDataJsonType[] | null
}

export type ClientSelectionType = {
	typeOfVehicle: ClientDataJsonType[]
	typeOfVehicleContract: string[]
	chargingStations: ClientDataJsonType[]
	chargingStationsContract: string[]
	pif: ClientDataJsonType[]
	deployment: ClientDataJsonType[]
	project: ClientDataJsonType[]
}

export type FormattedGrantType = {
	geography: string[]
	value: string
	alert_purpose: string
	awarding_authority: string
	deadline: string[]
	in_brief: string
	sector: string
	call_title?: string | undefined
	grant_programme?: string | undefined
	programme_purpose?: string | undefined
	instrument_type?: string | undefined
	reference_number?: string | undefined
	further_details?: string[] | undefined
	files?: string[] | undefined
	tailored_assessment?: [number, string, string][] | undefined
	consultant?: string | undefined
	deployment?: string[] | undefined
	project?: string[] | undefined
}

export type FormattedGrantTypeNull = {
	geography: string[]
	value: string
	alert_purpose: string
	awarding_authority: string
	deadline: string[]
	in_brief: string
	sector: string
	call_title?: string | null
	grant_programme?: string | null
	programme_purpose?: string | null
	instrument_type?: string | null
	reference_number?: string | null
	further_details?: string[] | null
	files?: string[] | null
	tailored_assessment?: [number, string, string][] | null
	consultant?: string | null
	deployment?: string[] | null
	project?: string[] | null
}
