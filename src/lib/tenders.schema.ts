import { z } from 'zod'

export const createTenderSchema = z.object({
	title: z
		.string()
		.min(3, { message: 'Name must be at least 3 characters long' }),
	location: z
		.string()
		.min(3, { message: 'Location must be at least 3 characters long' }),
	description: z
		.string()
		.min(3, { message: 'Description must be at least 3 characters long' }),
	value: z.string().min(1, { message: 'Value must be at least 1' }),
	contract_type: z.string().min(3, {
		message: 'Contract type must be at least 3 characters long',
	}),
	submission_language: z.string().min(3, {
		message: 'Submission language must be at least 3 characters long',
	}),
	sector: z
		.string()
		.min(3, { message: 'Sector must be at least 3 characters long' }),
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
