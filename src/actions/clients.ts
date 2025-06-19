'use server'

import { CreateAccountType, UpdateAccountType } from '@/lib/types'
import { normalizeClientData } from '@/lib/utils'
import { createAdminClient, createClient } from '@/supabase/server'

export const signUpClient = async (data: CreateAccountType) => {
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
			name: data.name,
			family_name: data.familyName,
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
				name: data.name,
				family_name: data.familyName,
				org_name: data.orgName,
				email: data.email,
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
			.eq('user_id', user.id)
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

export const getClientsByConsultantId = async () => {
	try {
		const supabase = await createClient()

		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) return null

		const userId = user.id

		const { data: consultantData, error: consultantError } = await supabase
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
		}

		const { data, error } = await supabase
			.from('clients')
			.select('*')
			.in('id', consultantData.clients)

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
