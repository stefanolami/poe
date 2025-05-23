'use server'

import { UpdateAccountType } from '@/lib/types'
import { createAdminClient, createClient } from '@/supabase/server'

/* export const clientSignUp = async (data: CreateAccountType) => {
	try {
		const supabase = await createClient()

		// Create auth account
		const { data: authData, error: authError } = await supabase.auth.signUp(
			{
				email: data.email,
				password: data.password,
			}
		)
		if (authError) {
			throw new Error(`Auth creation failed: ${authError.message}`)
		}
		console.log('Auth account created successfully')

		const userId = authData.user?.id
		if (!userId) {
			throw new Error('User ID is missing after account creation')
		}

		// Sign in the user
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		})
		if (signInError) {
			throw new Error(`Sign-in failed: ${signInError.message}`)
		}

		// Create client record
		const { error: clientError } = await supabase.from('clients').insert({
			name: data.name,
			family_name: data.familyName,
			org_name: data.orgName,
			email: data.email,
			user_id: userId,
			sector: data.sector,
			geography: data.geography,
			vehicles_type: data.vehicles_type,
			vehicles_contract: data.vehicles_contract,
			charging_stations_type: data.charging_stations_type,
			charging_stations_contract: data.charging_stations_contract,
		})
		if (clientError) {
			throw new Error(`Client creation failed: ${clientError.message}`)
		}
		console.log('Client account created successfully')

		// Create users_profiles record
		const { error: profileError } = await supabase
			.from('users_profiles')
			.insert({
				user_id: userId,
				role: 'client',
			})
		if (profileError) {
			throw new Error(
				`User profile creation failed: ${profileError.message}`
			)
		}
		console.log('User profile created successfully')

		// Return auth data
		return authData
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('SIGNUP ERROR:', error.message)
			throw error
		} else {
			console.error('Unexpected SIGNUP ERROR:', error)
			throw new Error('An unexpected error occurred during signup')
		}
	}
} */

export const clientUpdate = async (
	data: UpdateAccountType,
	id: number,
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

		return data
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
			.eq('user_id', userId)
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
