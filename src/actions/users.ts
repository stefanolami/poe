'use server'

import { CreateUserType, UpdateUserType } from '@/lib/types'
import { createAdminClient, createClient } from '@/supabase/server'

export const signUpUser = async (data: CreateUserType) => {
	try {
		const adminSupabase = await createAdminClient()
		const supabase = await createClient()

		const { data: authData, error: authError } =
			await adminSupabase.auth.admin.createUser({
				email: data.email,
				password: data.password,
				email_confirm: true,
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

export const updateUser = async (data: UpdateUserType, id: string) => {
	try {
		const supabase = await createClient()

		const { data: userData, error } = await supabase
			.from('users')
			.update({
				first_name: data.firstName,
				last_name: data.lastName,
				email: data.email,
				role: data.role,
				clients: data.clients,
			})
			.eq('id', id)
			.select()
			.single()

		if (error) {
			throw new Error(`User update failed: ${error.message}`)
		}

		console.log('User account updated successfully')

		return userData
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('USER UPDATE ERROR:', error.message)
			throw error
		} else {
			console.error('Unexpected USER UPDATE ERROR:', error)
			throw new Error('An unexpected error occurred during user update')
		}
	}
}

export const getUsers = async () => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('users')
			.select('*')
			.order('created_at', { ascending: false })

		if (error) {
			throw new Error(error.message)
		}

		const formattedData = data.map((user) => ({
			id: user.id,
			name: `${user.first_name} ${user.last_name || ''}`.trim(),
			role: user.role,
			email: user.email,
			created_at: user.created_at,
		}))

		return formattedData
	} catch (error) {
		console.log('ERROR FETCHING USERS', error)
		throw error
	}
}

export const getUserById = async (id: string) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('users')
			.select('*')
			.eq('id', id)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		if (data.clients) {
			const { data: clientData, error: clientError } = await supabase
				.from('clients')
				.select('*')
				.in('id', data.clients)

			if (clientError) {
				throw new Error(clientError.message)
			}
			return {
				user: data,
				clients: clientData.map((client) => ({
					id: client.id,
					name: `${client.name} ${client.family_name || ''}`.trim(),
					org: client.org_name,
					email: client.email,
					created_at: client.created_at,
				})),
			}
		}

		return {
			user: data,
			clients: null,
		}
	} catch (error) {
		console.log('ERROR FETCHING USER', error)
		throw error
	}
}
