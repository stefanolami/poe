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

export type AlertType = {
	created_at: string
	entity_id: string
	entity_type: 'grant' | 'tender' | 'investment'
	matched_clients: string[] | null
	subject: string
}

export type CreateAlertType = {
	entity_type: 'grant' | 'tender' | 'investment'
	subject: string
	entity_id: string
	matched_clients: string[] | null
}

export type UpdateGrantType = {
	sector: string
	value: string
	geography: string[]
	alert_purpose: string
	awarding_authority: string
	deadline: string[][]
	in_brief: string
	deployment?: string[] | undefined
	project?: string[] | undefined
	call_title?: string | undefined
	grant_programme?: string | undefined
	programme_purpose?: string | undefined
	instrument_type?: string | undefined
	reference_number?: string | undefined
	further_details?: string[][] | undefined
	files?: File[] | undefined
	oldFiles?: string[] | undefined
	tailored_assessment?: string[][] | undefined
	consultant?: string | undefined
}

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
	id: string
	name: string
	org_name: string | null
	pif: ClientDataJsonType[] | null
	project: ClientDataJsonType[] | null
	sector: string | null
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

export type TailoredAssessmentType = {
	client: string
	relevance: string
	next_steps: string
}

export type GrantType = {
	alert_purpose: string
	amendments: string[] | null
	awarding_authority: string
	call_title: string | null
	consultant: string | null
	created_at: string
	deadline: string[]
	deployment: string[] | null
	files: string[] | null
	further_details: string[] | null
	geography: string[]
	grant_programme: string | null
	id: string
	in_brief: string
	instrument_type: string | null
	matched_clients: string[] | null
	programme_purpose: string | null
	project: string[] | null
	reference_number: string | null
	sector: string
	sent: boolean
	tailored_assessment: TailoredAssessmentType[] | null
	value: string
}

export type GrantWithConsultantType = {
	alert_purpose: string
	amendments: string[] | null
	awarding_authority: string
	call_title: string | null
	consultant: {
		id: string
		name: string
		email: string
		family_name: string
		created_at: string
		clients: string[] | null
	} | null
	created_at: string
	deadline: string[]
	deployment: string[] | null
	files: string[] | null
	further_details: string[] | null
	geography: string[]
	grant_programme: string | null
	id: string
	in_brief: string
	instrument_type: string | null
	matched_clients: string[] | null
	programme_purpose: string | null
	project: string[] | null
	reference_number: string | null
	sector: string
	sent: boolean
	tailored_assessment: TailoredAssessmentType[] | null
	value: string
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

export type FilterResponseType = {
	status: number
	data: string
	statusText: string
}

export type DashboardDataType = {
	clients:
		| {
				created_at: string
				id: string
				name: string
				family_name: string
				org_name?: string | null
		  }[]
		| []
	grants:
		| {
				created_at: string
				id: string
				call_title?: string | null
				grant_programme?: string | null
		  }[]
		| []
	alerts:
		| {
				created_at: string
				matched_clients: string[] | null
				id: string
				subject: string
		  }[]
		| []
}
