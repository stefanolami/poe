import { z } from 'zod'

export const createTenderSchema = z.object({
	title: z.string().min(2, { message: 'This field is required' }),
	contracting_org_name: z
		.string()
		.min(2, { message: 'This field is required' }),
	contracting_authority: z
		.string()
		.min(2, { message: 'This field is required' }),
	country: z.string().min(2, { message: 'This field is required' }),
	description: z.string().min(2, { message: 'This field is required' }),
	value: z.string().min(1, { message: 'This field is required' }),
	contract_type: z.enum(['service', 'purchase', 'mixed'], {
		required_error: 'You must select an option',
	}),
	publication_date: z
		.date()
		.min(new Date(), { message: 'Publication date must be in the future' }),
	submission_deadline: z.date().min(new Date(), {
		message: 'Submission deadline must be in the future',
	}),
	submission_language: z.string().min(3, {
		message: 'Submission language must be at least 3 characters long',
	}),
	filters: z.object({
		sector: z.enum(['e-mobility', 'aviation'], {
			required_error: 'You must select a sector',
		}),
		type_of_vehicle: z.string().optional(), // Initially optional
	}),
	/* sector: z.enum(['e-mobility', 'aviation'], {
		required_error: 'You must select an option',
	}), */
	agent: z.string(),
	type_of_vehicle: z.string().min(3, {
		message: 'Type of vehicle must be at least 3 characters long',
	}),
	type_of_contract: z.string().min(3, {
		message: 'Type of contract must be at least 3 characters long',
	}),
	id: z.number().optional(),
})

export type CreateTenderSchema = z.infer<typeof createTenderSchema>

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
