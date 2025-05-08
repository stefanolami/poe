import { z } from 'zod'
import {
	createAccountSchema,
	createGrantSchema,
	loginSchema,
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

export type LoginType = z.infer<typeof loginSchema>

export type CreateGrantType = z.infer<typeof createGrantSchema>
