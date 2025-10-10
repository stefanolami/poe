import { z } from 'zod'

export const createAccountSchema = z
	.object({
		firstName: z.string().min(1, 'First Name is required'),
		lastName: z.string().min(1, 'Last Name is required'),
		orgName: z.string().min(1, 'Organization name is required'),
		email: z.string().email('Invalid email address'),
		password: z
			.string()
			.min(6, 'Password must be at least 6 characters long'),
		confirmPassword: z.string().min(6, 'Confirm password is required'),
		additionalEmails: z
			.array(z.string().email('Invalid email address'))
			.optional(),
		sector: z.string().optional(),
		vehicles_type: z
			.array(
				z.object({
					value: z.string(),
					geographies: z.array(
						z.object({
							value: z.string(),
							label: z.string(),
						})
					),
				})
			)
			.optional(),
		vehicles_contract: z.array(z.string()).optional(),
		charging_stations_type: z
			.array(
				z.object({
					value: z.string(),
					geographies: z.array(
						z.object({
							value: z.string(),
							label: z.string(),
						})
					),
				})
			)
			.optional(),
		charging_stations_contract: z.array(z.string()).optional(),
		pif: z
			.array(
				z.object({
					value: z.string(),
					geographies: z.array(
						z.object({
							value: z.string(),
							label: z.string(),
						})
					),
				})
			)
			.optional(),
		deployment: z
			.array(
				z.object({
					value: z.string(),
					geographies: z.array(
						z.object({
							value: z.string(),
							label: z.string(),
						})
					),
				})
			)
			.optional(),
		project: z
			.array(
				z.object({
					value: z.string(),
					geographies: z.array(
						z.object({
							value: z.string(),
							label: z.string(),
						})
					),
				})
			)
			.optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords must match',
		path: ['confirmPassword'],
	})

export const updateAccountSchema = z.object({
	firstName: z.string().min(1, 'First Name is required'),
	lastName: z.string().min(1, 'Last Name is required'),
	orgName: z.string().optional(),
	email: z.string().email('Invalid email address'),
	additionalEmails: z
		.array(z.string().email('Invalid email address'))
		.optional(),
})

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const forgotPasswordSchema = z.object({
	email: z.string().email('Invalid email address'),
})

export const updatePasswordSchema = z
	.object({
		password: z
			.string()
			.min(6, 'Password must be at least 6 characters long'),
		confirmPassword: z.string().min(6, 'Confirm password is required'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords must match',
		path: ['confirmPassword'],
	})

// Grants: conditional schema based on pre_launch
const grantBase = {
	geography: z.array(z.string().min(2, 'Required')),
	call_title: z.string().optional(),
	programme_title: z.string().optional(),
	alert_purpose: z.string().min(2, 'Required'),
	programme_purpose: z.string().optional(),
	instrument_type: z.string().optional(),
	reference_number: z.string().optional(),
	deadline: z.array(z.array(z.string())), // content validated server-side; allow empty triplets
	in_brief: z.string().min(2, 'Required'),
	geography_details: z.string().min(2, 'Required'),
	internal_deadline: z.string().min(2, 'Required'),
	intro: z.string().min(2, 'Required'),
	subject_matter: z.string().optional(),
	further_details: z.array(z.array(z.string())).optional(),
	files: z
		.array(
			z.instanceof(File, {
				message: 'Must be a valid file',
			})
		)
		.optional(),
	tailored_assessment: z.array(z.array(z.string())).optional(),
	consultant: z.string().optional(),
	sector: z.string().min(2, 'Required'),
	deployment: z.array(z.string()).optional(),
	project: z.array(z.string()).optional(),
}

const createGrantSchemaPre = z.object({
	...grantBase,
	// Relaxed requirements in pre-launch (value and awarding_authority optional)
	value: z.string().optional(),
	awarding_authority: z.string().optional(),
	pre_launch: z.literal(true),
})

const createGrantSchemaLaunch = z.object({
	...grantBase,
	// Stricter requirements in launch mode
	value: z.string().min(1, 'Required'),
	awarding_authority: z.string().min(2, 'Required'),
	pre_launch: z.literal(false),
})

export const createGrantSchema = z
	.discriminatedUnion('pre_launch', [
		// Override for launch: call_title is required when pre_launch is false
		createGrantSchemaLaunch.extend({
			call_title: z.string().min(1, 'Required'),
		}),
		createGrantSchemaPre,
	])
	// In pre-launch, require at least one between call_title and subject_matter
	.refine(
		(data) =>
			data.pre_launch ? !!(data.call_title || data.subject_matter) : true,
		{
			message: 'Provide Call Title or Subject Matter',
			path: ['call_title'],
		}
	)

export const createGrantsTailoredAssessmentSchema = z.object({
	tailored_assessment: z
		.array(z.tuple([z.string(), z.string(), z.string()]))
		.optional(),
})

// Tenders: conditional schema based on pre_launch
const tenderBase = {
	geography: z.array(z.string().min(2, 'Required')),
	call_title: z.string().optional(),
	programme_title: z.string().optional(),
	alert_purpose: z.string().min(2, 'Required'),
	reference_number: z.string().optional(),
	deadline: z.array(z.array(z.string())),
	in_brief: z.string().min(2, 'Required'),
	geography_details: z.string().min(2, 'Required'),
	internal_deadline: z.string().min(2, 'Required'),
	intro: z.string().min(2, 'Required'),
	subject_matter: z.string().optional(),
	further_details: z.array(z.array(z.string())).optional(),
	files: z
		.array(
			z.instanceof(File, {
				message: 'Must be a valid file',
			})
		)
		.optional(),
	tailored_assessment: z.array(z.array(z.string())).optional(),
	consultant: z.string().optional(),
	sector: z.string().min(2, 'Required'),
	vehicles: z.array(z.string()).optional(),
	vehicles_contracts: z.array(z.string()).optional(),
	stations: z.array(z.string()).optional(),
	stations_contracts: z.array(z.string()).optional(),
}

const createTendersSchemaPre = z.object({
	...tenderBase,
	// Relaxed in pre-launch
	value: z.string().optional(),
	programme_purpose: z.string().optional(),
	instrument_type: z.string().optional(),
	awarding_authority: z.string().optional(),
	pre_launch: z.literal(true),
})

const createTendersSchemaLaunch = z.object({
	...tenderBase,
	// Stricter in launch
	value: z.string().min(1, 'Required'),
	programme_purpose: z.string().min(1, 'Required'),
	instrument_type: z.string().min(1, 'Required'),
	awarding_authority: z.string().min(2, 'Required'),
	pre_launch: z.literal(false),
})

export const createTendersSchema = z
	.discriminatedUnion('pre_launch', [
		// Require call_title in launch
		createTendersSchemaLaunch.extend({
			call_title: z.string().min(1, 'Required'),
		}),
		createTendersSchemaPre,
	])
	// In pre-launch, require at least one between call_title and subject_matter
	.refine(
		(data) =>
			data.pre_launch ? !!(data.call_title || data.subject_matter) : true,
		{
			message: 'Provide Call Title or Subject Matter',
			path: ['call_title'],
		}
	)

// Investments: conditional schema based on pre_launch
const investmentBase = {
	geography: z.array(z.string().min(2, 'Required')),
	call_title: z.string().optional(),
	programme_title: z.string().optional(),
	alert_purpose: z.string().min(2, 'Required'),
	reference_number: z.string().optional(),
	deadline: z.array(z.array(z.string())),
	in_brief: z.string().min(2, 'Required'),
	geography_details: z.string().min(2, 'Required'),
	internal_deadline: z.string().min(2, 'Required'),
	intro: z.string().min(2, 'Required'),
	subject_matter: z.string().optional(),
	further_details: z.array(z.array(z.string())).optional(),
	files: z
		.array(
			z.instanceof(File, {
				message: 'Must be a valid file',
			})
		)
		.optional(),
	tailored_assessment: z.array(z.array(z.string())).optional(),
	consultant: z.string().optional(),
	sector: z.string().min(2, 'Required'),
}

const createInvestmentsSchemaPre = z.object({
	...investmentBase,
	value: z.string().optional(),
	programme_purpose: z.string().optional(),
	instrument_type: z.string().optional(),
	awarding_authority: z.string().optional(),
	pre_launch: z.literal(true),
})

const createInvestmentsSchemaLaunch = z.object({
	...investmentBase,
	value: z.string().min(1, 'Required'),
	programme_purpose: z.string().min(1, 'Required'),
	instrument_type: z.string().min(1, 'Required'),
	awarding_authority: z.string().min(2, 'Required'),
	pre_launch: z.literal(false),
})

export const createInvestmentsSchema = z
	.discriminatedUnion('pre_launch', [
		// Require call_title in launch
		createInvestmentsSchemaLaunch.extend({
			call_title: z.string().min(1, 'Required'),
		}),
		createInvestmentsSchemaPre,
	])
	// In pre-launch, require at least one between call_title and subject_matter
	.refine(
		(data) =>
			data.pre_launch ? !!(data.call_title || data.subject_matter) : true,
		{
			message: 'Provide Call Title or Subject Matter',
			path: ['call_title'],
		}
	)

// Subscriptions
export const subscriptionIdSchema = z.string().uuid('Invalid subscription id')

export const createSubscriptionSchema = z.object({
	clientId: z.string().uuid('Client id required'),
	periodStart: z
		.string()
		.regex(/\d{4}-\d{2}-\d{2}/, 'Invalid date format (yyyy-mm-dd)'),
	periodEnd: z
		.string()
		.regex(/\d{4}-\d{2}-\d{2}/, 'Invalid date format (yyyy-mm-dd)'),
	autoRenew: z.boolean().optional(),
	status: z.enum(['active', 'expired', 'frozen']).default('active'),
})

export const updateSubscriptionSchema = z.object({
	period_start: z
		.string()
		.regex(/\d{4}-\d{2}-\d{2}/, 'Invalid date format (yyyy-mm-dd)')
		.optional(),
	period_end: z
		.string()
		.regex(/\d{4}-\d{2}-\d{2}/, 'Invalid date format (yyyy-mm-dd)')
		.optional(),
	auto_renew: z.boolean().optional(),
	status: z.enum(['active', 'expired', 'frozen']).optional(),
})

export const sendOfferSchema = z.object({
	email: z.string().email('Invalid email address'),
	additionalEmails: z
		.array(z.string().email('Invalid email address'))
		.optional(),
})

export const createUserSchema = z
	.object({
		firstName: z.string().min(2, 'First Name is required'),
		lastName: z.string().min(2, 'Last Name is required'),
		email: z.string().email('Invalid email address'),
		password: z
			.string()
			.min(6, 'Password must be at least 6 characters long'),
		confirmPassword: z.string().min(6, 'Confirm password is required'),
		role: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords must match',
		path: ['confirmPassword'],
	})

export const updateUserSchema = z.object({
	firstName: z.string().min(2, 'First Name is required'),
	lastName: z.string().min(2, 'Last Name is required'),
	email: z.string().email('Invalid email address'),
	role: z.string(),
	clients: z.array(z.string()).nullable(),
})
