import { z } from 'zod'

export const createAccountSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		familyName: z.string().min(1, 'Family name is required'),
		orgName: z.string().min(1, 'Company name is required'),
		email: z.string().email('Invalid email address'),
		password: z
			.string()
			.min(6, 'Password must be at least 6 characters long'),
		confirmPassword: z.string().min(6, 'Confirm password is required'),
		sector: z.string().optional(),
		vehicles_type: z.array(z.string()).optional(),
		vehicles_contract: z.array(z.string()).optional(),
		charging_stations_type: z.array(z.string()).optional(),
		charging_stations_contract: z.array(z.string()).optional(),
		pif: z.array(z.string()).optional(),
		deployment: z.array(z.string()).optional(),
		project: z.array(z.string()).optional(),
		geography: z.array(z.string()).optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords must match',
		path: ['confirmPassword'],
	})

export const updateAccountSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	familyName: z.string().min(1, 'Family name is required'),
	orgName: z.string().optional(),
	email: z.string().email('Invalid email address'),
})

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const createGrantSchema = z
	.object({
		geography: z.array(z.string().min(2, 'Geography is required')),
		call_title: z.string().optional(),
		grant_programme: z.string().optional(),
		alert_purpose: z.string().min(2, 'Alert purpose is required'),
		programme_purpose: z.string().optional(),
		instrument_type: z.string().optional(),
		awarding_authority: z.string().min(2, 'Awarding authority is required'),
		reference_number: z.string().optional(),
		deadline: z.array(z.array(z.string())),
		in_brief: z.string().min(2, 'In brief is required'),
		value: z.string(),
		further_details: z.array(z.array(z.string())).optional(),
		files: z
			.array(
				z.instanceof(File, {
					message: 'Must be a valid file',
				})
			)
			.optional(),
		tailored_assessment: z
			.array(z.tuple([z.number(), z.string(), z.string()]))
			.optional(),
		consultant: z.string().optional(),
		sector: z.string().min(2, 'Sector is required'),
		deployment: z.array(z.string()).optional(),
		project: z.array(z.string()).optional(),
	})
	.refine((data) => data.call_title || data.grant_programme, {
		message: 'Either Call Title or Grant Programme must be provided',
		path: ['call_title'],
	})
	.refine(
		(data) =>
			JSON.stringify(data.deadline) !== JSON.stringify([['', '', '']]),
		{
			message: 'Deadline is required',
			path: ['deadline'],
		}
	)
