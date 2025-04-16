import { z } from 'zod'

export const tenderSchema = z.object({
	title: z.string(),
	contracting_org_name: z.string(),
	contracting_org_info: z.string().optional(),
	location: z.string(),
	description: z.string(),
	value: z.string(),
	lots_divided: z.boolean(),
	lots_number: z.number().optional(),
	tenders_for_all_lots: z.boolean().optional(),
	contract_type: z.enum(['service', 'purchase', 'mixed'], {
		required_error: 'You must select an option',
	}),
	eu_funded: z.boolean(),
	eu_funded_details: z.string().optional(),
	submission_language: z.string(),
	opening: z
		.date()
		.min(new Date(), { message: 'Publication date must be in the future' }),
	closing: z.date().min(new Date(), {
		message: 'Submission deadline must be in the future',
	}),
	filters: z.object({
		sector: z.enum(['e-mobility', 'aviation'], {
			required_error: 'You must select a sector',
		}),
		type_of_vehicle: z.string().optional(), // Initially optional
	}),
	sector: z.enum(['e-mobility', 'aviation'], {
		required_error: 'You must select an option',
	}),
	eMobility: z
		.object({
			eVehicles: z
				.object({
					typeOfVehicle: z
						.enum([
							'cars',
							'buses',
							'trucks',
							'planes',
							'boats',
							'twoWheelers',
						])
						.optional(),
					typeOfContract: z.enum(['purchase', 'lease']),
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
					typeOfVehicle: z
						.enum([
							'cars',
							'buses',
							'trucks',
							'planes',
							'boats',
							'twoWheelers',
						])
						.optional(),
					typeOfContract: z.enum([
						'exchange',
						'digitalUpdates',
						'purchase',
					]),
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
	agent: z.number(),
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
