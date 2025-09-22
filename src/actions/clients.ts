'use server'

import {
	AccountRecapType,
	CreateAccountTempType,
	CreateAccountType,
	UpdateAccountType,
} from '@/lib/types'
import { normalizeClientData } from '@/lib/utils'
import { createAdminClient, createClient } from '@/supabase/server'
import { sendAccountRecap } from './email'

export const signUpClient = async (data: CreateAccountType, id?: string) => {
	try {
		const supabase = await createClient()

		// Sign up user
		const { data: authData, error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
		})
		if (error) throw error

		const userId = authData.user?.id
		if (!userId) throw new Error('User ID not found after sign up')

		const adminSupabase = await createAdminClient()

		// Add user role
		const { data: userData, error: adminError } =
			await adminSupabase.auth.admin.updateUserById(userId, {
				app_metadata: { user_role: 'client' },
			})

		if (adminError) {
			console.error('Admin API error:', adminError)
			throw new Error('Failed to set custom claims')
		}
		console.log('User role updated successfully:', userData)

		// Sign in the user
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		})
		if (signInError) {
			throw new Error(`Sign-in failed: ${signInError.message}`)
		}

		const clientInsertData = {
			first_name: data.firstName,
			last_name: data.lastName,
			org_name: data.orgName ?? null,
			email: data.email,
			id: userId,
			sector: data.sector ?? null,
			vehicles_type: data.vehicles_type ?? [],
			vehicles_contract: data.vehicles_contract ?? [],
			charging_stations_type: data.charging_stations_type ?? [],
			charging_stations_contract: data.charging_stations_contract ?? [],
			pif: data.pif ?? [],
			deployment: data.deployment ?? [],
			project: data.project ?? [],
			referrer: 'poe',
			additional_emails: data.additionalEmails ?? [],
		}

		// Create client record
		const { data: clientData, error: clientError } = await supabase
			.from('clients')
			.insert(clientInsertData)
			.select()
			.single()
		if (clientError) {
			throw new Error(`Client creation failed: ${clientError.message}`)
		}
		console.log('Client account created successfully')

		// Delete client_temp if id is provided
		if (id) {
			setTimeout(async () => {
				const { error: deleteError } = await supabase
					.from('clients_temp')
					.delete()
					.eq('id', id)
				if (deleteError) {
					throw new Error(
						`Client temp deletion failed: ${deleteError.message}`
					)
				}
				console.log('Client temp deleted successfully')
			}, 2000)
		}

		return clientData
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('SIGNUP ERROR:', error.message)
			throw error
		} else {
			console.error('Unexpected SIGNUP ERROR:', error)
			throw new Error('An unexpected error occurred during signup')
		}
	}
}

export const clientUpdate = async (
	data: UpdateAccountType,
	id: string,
	updateEmail: boolean
) => {
	try {
		const supabase = await createClient()

		console.log('Updating client with id:', id)

		const { data: clientData, error: clientError } = await supabase
			.from('clients')
			.update({
				first_name: data.firstName,
				last_name: data.lastName,
				org_name: data.orgName,
				email: data.email,
				additional_emails:
					(data.additionalEmails &&
						data.additionalEmails.filter(
							(e) => e && e.trim().length > 0
						)) ||
					[],
			})
			.eq('id', id)
			.select()
			.single()

		if (clientError) {
			throw new Error(
				`Client account update failed: ${clientError.message}`
			)
		}

		const adminSupabase = await createAdminClient()

		if (updateEmail) {
			const { error: emailError } = await adminSupabase.auth.updateUser({
				email: data.email,
			})
			if (emailError) {
				throw new Error(`Email update failed: ${emailError.message}`)
			}
			console.log('Email updated successfully')
		}

		return clientData
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('CLIENT UPDATE ERROR:', error.message)
			throw error
		} else {
			console.error('Unexpected CLIENT UPDATE ERROR:', error)
			throw new Error(
				'An unexpected error occurred while updating client data'
			)
		}
	}
}

export const createClientTemp = async (
	data: CreateAccountTempType,
	emailData: AccountRecapType,
	total: number
) => {
	try {
		const supabase = await createClient()

		const clientInsertData = {
			email: data.email,
			sector: data.sector ?? null,
			vehicles_type: data.vehicles_type ?? [],
			vehicles_contract: data.vehicles_contract ?? [],
			charging_stations_type: data.charging_stations_type ?? [],
			charging_stations_contract: data.charging_stations_contract ?? [],
			pif: data.pif ?? [],
			deployment: data.deployment ?? [],
			project: data.project ?? [],
			referrer: 'poe',
			additional_emails: data.additional_emails ?? [],
		}

		const { data: clientData, error } = await supabase
			.from('clients_temp')
			.insert(clientInsertData)
			.select()
			.single()
		if (error) {
			throw new Error(`Client Temp creation failed: ${error.message}`)
		}
		console.log('Client Temp account created successfully')

		await sendAccountRecap(data.email, emailData, total, clientData.id)

		return clientData
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('CLIENT TEMP CREATION ERROR:', error.message)
			throw error
		} else {
			console.error('Unexpected CLIENT TEMP CREATION ERROR:', error)
			throw new Error(
				'An unexpected error occurred during client temp creation'
			)
		}
	}
}

export const getClient = async () => {
	try {
		const supabase = await createClient()

		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) {
			throw new Error('User not found')
		}
		const { data, error } = await supabase
			.from('clients')
			.select('*')
			.eq('id', user.id)
			.single()

		if (error) {
			throw new Error(`Failed to fetch client data: ${error.message}`)
		}

		return normalizeClientData(data)
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('GET CLIENT ERROR:', error.message)
			throw error
		} else {
			console.error('Unexpected GET CLIENT ERROR:', error)
			throw new Error(
				'An unexpected error occurred while fetching client data'
			)
		}
	}
}

interface SubscriptionRow {
	id: string
	period_start: string
	period_end: string
	auto_renew: boolean
	status: string
	invoice_sent_at: string | null
	renewal_processed_at: string | null
}

export const getClientWithSubscription = async () => {
	try {
		const supabase = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) throw new Error('User not found')

		const { data: client, error: clientError } = await supabase
			.from('clients')
			.select('*')
			.eq('id', user.id)
			.single()
		if (clientError)
			throw new Error(
				`Failed to fetch client data: ${clientError.message}`
			)

		let subscription: SubscriptionRow | null = null
		if (client.current_subscription) {
			const { data: subData, error: subError } = await supabase
				.from('subscriptions')
				.select('*')
				.eq('id', client.current_subscription)
				.single()
			if (!subError) subscription = subData
		}

		return { client: normalizeClientData(client), subscription }
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('GET CLIENT WITH SUBSCRIPTION ERROR:', error.message)
			throw error
		} else {
			console.error(
				'Unexpected GET CLIENT WITH SUBSCRIPTION ERROR:',
				error
			)
			throw new Error(
				'An unexpected error occurred while fetching client+subscription data'
			)
		}
	}
}

export const getClientsByConsultantId = async () => {
	try {
		const supabase = await createClient()

		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) return null

		//const userId = user.id

		/* const { data: consultantData, error: consultantError } = await supabase
			.from('consultants')
			.select('clients')
			.eq('id', userId)
			.single()

		if (consultantError) {
			throw new Error(
				`Failed to fetch clients: ${consultantError?.message}`
			)
		}

		if (!consultantData || !consultantData.clients) {
			return null
		} */

		const { data, error } = await supabase.from('clients').select('*')
		//.in('id', consultantData.clients)

		if (error) {
			throw new Error(`Failed to fetch clients: ${error.message}`)
		}

		return data
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('GET CLIENTS BY CONSULTANT ID ERROR:', error.message)
			throw error
		} else {
			console.error(
				'Unexpected GET CLIENTS BY CONSULTANT ID ERROR:',
				error
			)
			throw new Error(
				'An unexpected error occurred while fetching clients'
			)
		}
	}
}

export const getClientsByIds = async (ids: string[]) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('clients')
			.select('*')
			.in('id', ids)

		if (error) {
			throw new Error(`Failed to fetch clients: ${error.message}`)
		}

		return data
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('GET CLIENTS BY IDS ERROR:', error.message)
			throw error
		} else {
			console.error('Unexpected GET CLIENTS BY IDS ERROR:', error)
			throw new Error(
				'An unexpected error occurred while fetching clients'
			)
		}
	}
}

export const getClients = async () => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('clients')
			.select('*')
			.order('created_at', { ascending: false })

		if (error) {
			throw new Error(error.message)
		}

		const formattedData = data.map((client) => ({
			id: client.id,
			name: `${client.first_name} ${client.last_name || ''}`.trim(),
			org: client.org_name || '--',
			email: client.email,
			created_at: client.created_at,
		}))

		return formattedData
	} catch (error) {
		console.log('ERROR FETCHING GRANTS', error)
		throw error
	}
}

// Fetch clients eligible for new subscription (no current active subscription)
export const getClientsEligibleForSubscription = async () => {
	try {
		const supabase = await createClient()
		// We assume a client is eligible if current_subscription is null OR account_status != 'active'
		const { data, error } = await supabase
			.from('clients')
			.select('*')
			.or('current_subscription.is.null,account_status.neq.active')
			.order('created_at', { ascending: false })

		if (error) {
			throw new Error(error.message)
		}

		return (data || []).map((client) => ({
			id: client.id,
			name: `${client.first_name} ${client.last_name || ''}`.trim(),
			org: client.org_name || '--',
			email: client.email,
			created_at: client.created_at,
		}))
	} catch (error) {
		console.error('ERROR FETCHING ELIGIBLE CLIENTS', error)
		throw error
	}
}

export const getClientById = async (id: string) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('clients')
			.select(
				`
			*,
			consultant:users (*)
		  `
			)
			.eq('id', id)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		return data
	} catch (error) {
		console.log('ERROR FETCHING CLIENT', error)
		throw error
	}
}

export const getClientTempById = async (id: string) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('clients_temp')
			.select('*')
			.eq('id', id)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		return normalizeClientData(data)
	} catch (error) {
		console.log('ERROR FETCHING CLIENT', error)
		throw error
	}
}

export const updateClientTailored = async (id: string, tailored: boolean) => {
	try {
		const supabase = await createClient()

		const { error } = await supabase
			.from('clients')
			.update({ tailored })
			.eq('id', id)

		if (error) {
			throw new Error(
				`Failed to update client tailored flag: ${error.message}`
			)
		}
		console.log('Client tailored flag updated successfully to:', tailored)
		return { success: true }
	} catch (error) {
		console.error('UPDATE CLIENT TAILORED ERROR:', error)
		throw error
	}
}

export const updateClientConsultant = async (
	id: string,
	consultantId: string | null
) => {
	try {
		const supabase = await createClient()

		const { error } = await supabase
			.from('clients')
			.update({ consultant: consultantId })
			.eq('id', id)

		if (error) {
			throw new Error(
				`Failed to update client consultant: ${error.message}`
			)
		}
		console.log('Client consultant updated successfully to:', consultantId)
		return { success: true }
	} catch (error) {
		console.error('UPDATE CLIENT CONSULTANT ERROR:', error)
		throw error
	}
}
