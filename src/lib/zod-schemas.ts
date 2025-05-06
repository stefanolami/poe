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
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords must match',
		path: ['confirmPassword'], // Points to the confirmPassword field
	})

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
})
