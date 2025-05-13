'use server'

import { CreateAccountType } from '@/lib/types'
import { createClient } from '@/supabase/server'

export const clientSignUp = async (data: CreateAccountType) => {
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
}
