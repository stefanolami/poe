'use server'

import { CreateUserType } from '@/lib/types'
import { createAdminClient, createClient } from '@/supabase/server'

export const signUpUser = async (data: CreateUserType) => {
	try {
		const adminSupabase = await createAdminClient()
		const supabase = await createClient()

		const { data: authData, error: authError } =
			await adminSupabase.auth.admin.createUser({
				email: data.email,
				password: data.password,
				app_metadata: { user_role: data.role },
			})
		console.log('Auth data:', authData)

		if (authError || !authData) {
			console.error('Auth API error:', authError)
			throw new Error('Failed to retrieve user data')
		}
		const userInsertData = {
			first_name: data.firstName,
			last_name: data.lastName,
			email: data.email,
			id: authData.user.id,
			role: data.role,
		}

		// Create user record
		const { data: userData, error: userError } = await supabase
			.from('users')
			.insert(userInsertData)
			.select()
			.single()
		if (userError) {
			throw new Error(`User creation failed: ${userError.message}`)
		}
		console.log('User account created successfully')

		return userData
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('USER SIGNUP ERROR:', error.message)
			throw error
		} else {
			console.error('Unexpected USER SIGNUP ERROR:', error)
			throw new Error('An unexpected error occurred during user signup')
		}
	}
}
