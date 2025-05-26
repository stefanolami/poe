'use server'

import { CreateAccountType } from '@/lib/types'
import { createAdminClient, createClient } from '@/supabase/server'

export const authenticate = async (email: string, password: string) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		console.log('Authenticated')
		if (error) throw error
		return data
	} catch (error) {
		console.log('AUTH ERROR', error)
		throw error
	}
}

export const signOut = async () => {
	try {
		const supabase = await createClient()

		const { error } = await supabase.auth.signOut()
		if (error) throw error
	} catch (error) {
		console.log('SIGNOUT ERROR', error)
		throw error
	}
}

export const getUserRole = async () => {
	try {
		const supabase = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) return null

		return user.app_metadata?.user_role ?? null
	} catch (error) {
		console.log('GET USER ROLE ERROR', error)
		throw error
	}
}

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
			user_id: userId,
			sector: data.sector ?? null,
			geography: data.geography,
			vehicles_type: data.vehicles_type ?? [],
			vehicles_contract: data.vehicles_contract ?? [],
			charging_stations_type: data.charging_stations_type ?? [],
			charging_stations_contract: data.charging_stations_contract ?? [],
			pif: data.pif ?? [],
			deployment: data.deployment ?? [],
			project: data.project ?? [],
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
