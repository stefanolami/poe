import { z } from 'zod'
import {
	createAccountSchema,
	createGrantSchema,
	loginSchema,
	updateAccountSchema,
} from './zod-schemas'

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

export type CreateAccountType = z.infer<typeof createAccountSchema>

export type UpdateAccountType = z.infer<typeof updateAccountSchema>

export type LoginType = z.infer<typeof loginSchema>

export type CreateGrantType = z.infer<typeof createGrantSchema>

export type ClientDataType = {
	charging_stations_contract: string[] | null
	charging_stations_type: string[] | null
	created_at: string
	email: string
	family_name: string
	geography: string[] | null
	id: number
	name: string
	org_name: string | null
	sector: string | null
	user_id: string
	vehicles_contract: string[] | null
	vehicles_type: string[] | null
}
