import { z } from 'zod'

export const tenderSchema = z
	.object({
		contractingOrganization: z.string().optional(),
		title: z.string(),
		country: z.enum([
			'euAdmin',
			'eu27',
			'brazil',
			'turkey',
			'colombia',
			'russia',
		]),
		description: z.string().optional(),
		totalValue: z.string().optional(),

		dividedIntoLots: z.boolean(),
		lotsDetails: z
			.object({
				lotsNumber: z.number(),
				tendersForAllLots: z.boolean(),
			})
			.optional(),

		contractType: z.enum(['service', 'purchase', 'mixed']),

		euFunded: z.boolean(),
		euFundedDetails: z.string().optional(),

		contractingAuthorityInfo: z.string().optional(),
		agent: z.string().optional(),

		language: z.enum(['english', 'german', 'french', 'spanish']),
		opening: z.string().optional(),
		closing: z.string().optional(),

		// Nested Sectors Logic
		sectors: z
			.object({
				eMobility: z.boolean().optional(),
				aviation: z.boolean().optional(),
			})
			.optional(),

		eMobility: z
			.object({
				eVehicles: z.object({
					typeOfVehicle: z
						.object({
							cars: z.boolean().optional(),
							buses: z.boolean().optional(),
							trucks: z.boolean().optional(),
							planes: z.boolean().optional(),
							boats: z.boolean().optional(),
							twoWheelers: z.boolean().optional(),
						})
						.optional(),

					typeOfContract: z
						.object({
							purchase: z.boolean().optional(),
							leasing: z.boolean().optional(),
							rental: z.boolean().optional(),
							fleetManagement: z.boolean().optional(),
							dataManagement: z.boolean().optional(),
						})
						.optional(),
				}),

				eVehiclesMaintenance: z.object({
					maintenance: z
						.object({
							evServices: z.boolean().optional(),
							diagnosis: z.boolean().optional(),
							exchangePurchase: z.boolean().optional(),
						})
						.optional(),
					spareParts: z
						.object({
							cars: z.boolean().optional(),
							buses: z.boolean().optional(),
							trucks: z.boolean().optional(),
							planes: z.boolean().optional(),
							boats: z.boolean().optional(),
							twoWheelers: z.boolean().optional(),
						})
						.optional(),
				}),

				chargingStations: z.object({
					chargingVehiclesType: z
						.object({
							bikesCars: z.boolean().optional(),
							buses: z.boolean().optional(),
							trucks: z.boolean().optional(),
							planes: z.boolean().optional(),
							boats: z.boolean().optional(),
							twoWheelers: z.boolean().optional(),
						})
						.optional(),

					typeOfMaintenance: z
						.object({
							exchange: z.boolean().optional(),
							digitalUpdates: z.boolean().optional(),
							purchase: z.boolean().optional(),
						})
						.optional(),
				}),
			})
			.optional(),

		// Conditional refinement logic
	})
	.superRefine((data, ctx) => {
		const vehicleSelected = Object.values(
			data.eMobility?.eVehicles?.typeOfVehicle || {}
		).some(Boolean)
		const contractSelected = data.eMobility?.eVehicles?.typeOfContract

		if (vehicleSelected && !contractSelected) {
			ctx.addIssue({
				path: ['eMobility', 'eVehicles', 'typeOfContract'],
				code: z.ZodIssueCode.custom,
				message:
					'Contract type is required when vehicle type is selected.',
			})
		}

		const chargingSelected = Object.values(
			data.eMobility?.chargingStations?.chargingVehiclesType || {}
		).some(Boolean)
		const maintenanceSelected =
			data.eMobility?.chargingStations?.typeOfMaintenance

		if (chargingSelected && !maintenanceSelected) {
			ctx.addIssue({
				path: ['eMobility', 'chargingStations', 'typeOfMaintenance'],
				code: z.ZodIssueCode.custom,
				message:
					'Maintenance type is required when charging station type is selected.',
			})
		}

		if (data.dividedIntoLots && !data.lotsDetails) {
			ctx.addIssue({
				path: ['lotsDetails'],
				code: z.ZodIssueCode.custom,
				message:
					'Lots details are required when the tender is divided into lots.',
			})
		}

		if (data.euFunded && !data.euFundedDetails) {
			ctx.addIssue({
				path: ['euFundedDetails'],
				code: z.ZodIssueCode.custom,
				message:
					'EU funded details required when EU funded is selected.',
			})
		}
	})
