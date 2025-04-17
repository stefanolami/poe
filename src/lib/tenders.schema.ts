import { z } from 'zod'

export const tenderSchema = z.object({
	title: z.string().min(2),
	location: z.string().min(2),
	contracting_org_name: z.string().min(2),
	contracting_org_info: z.string().optional(),
	description: z.string().min(2),
	value: z.string().min(2),
	lots_divided: z.string(),
	lots_number: z.string().optional(),
	tenders_for_all_lots: z.string().optional(),
	contract_type: z.string(),
	/* contract_type: z.enum(['service', 'purchase', 'mixed'], {
		required_error: 'You must select an option',
	}), */
	eu_funded: z.string(),
	eu_funded_details: z.string().optional(),
	submission_language: z.string().min(2),
	opening: z
		.date()
		.min(new Date(), { message: 'Publication date must be in the future' }),
	closing: z.date().min(new Date(), {
		message: 'Submission deadline must be in the future',
	}),
	/* filters: z.object({
		sector: z.enum(['e-mobility', 'aviation'], {
			required_error: 'You must select a sector',
		}),
		type_of_vehicle: z.string().optional(), // Initially optional
	}), */
	sector: z.enum(['e-mobility', 'aviation'], {
		required_error: 'You must select an option',
	}),
	eMobility: z
		.object({
			eVehicles: z
				.object({
					typeOfVehicle: z.array(z.string()).optional(),
					typeOfContract: z.array(z.string()).optional(),
				})
				.refine(
					(data) => !data.typeOfVehicle || !!data.typeOfContract,
					{
						message:
							'Type of Contract is required when Type of Vehicle is selected',
						path: ['typeOfContract'], // Points to the field with the error
					}
				),
			chargingStations: z
				.object({
					typeOfVehicle: z.array(z.string()).optional(),
					typeOfContract: z.array(z.string()).optional(),
				})
				.refine(
					(data) => !data.typeOfVehicle || !!data.typeOfContract,
					{
						message:
							'Type of Contract is required when Type of Vehicle is selected',
						path: ['typeOfContract'], // Points to the field with the error
					}
				),
		})
		.optional(),
	agent: z.string(),
	id: z.number().optional(),
})

export type TenderSchema = z.infer<typeof tenderSchema>

export const createCategorySchemaServer = z.object({
	imageUrl: z.string().min(1, { message: 'Image is required' }),
	name: z
		.string()
		.min(3, { message: 'Name must be at least 3 characters long' }),
})

export type CreateCategorySchemaServer = z.infer<
	typeof createCategorySchemaServer
>

export const updateCardSchema = z.object({
	title: z
		.string()
		.min(3, { message: 'Name must be at least 3 characters long' }),
	content: z
		.string()
		.min(3, { message: 'Name must be at least 3 characters long' }),
	id: z.number().optional(),
	intent: z.string().optional(),
})

export type UpdateCardSchema = z.infer<typeof updateCardSchema>
