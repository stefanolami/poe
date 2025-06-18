'use server'

import { createClient } from '@/supabase/server'

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
		if (!user || !user.app_metadata?.user_role) return null
		console.log('User role:', user.app_metadata.user_role)

		return user.app_metadata.user_role
	} catch (error) {
		console.log('GET USER ROLE ERROR', error)
		throw error
	}
}

export const forgotPassword = async (email: string) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase.auth.resetPasswordForEmail(
			email,
			{
				redirectTo: 'https://www.poeontap.com/update-password',
			}
		)
		if (error) throw error
		return data
	} catch (error) {
		console.log('FORGOT PASSWORD ERROR', error)
		throw error
	}
}

export const updatePassword = async (password: string, code: string) => {
	try {
		const supabase = await createClient()

		const { error: sessionError } =
			await supabase.auth.exchangeCodeForSession(code)
		if (sessionError) throw sessionError

		const { data, error } = await supabase.auth.updateUser({
			password,
		})
		if (error) throw error
		return data
	} catch (error) {
		console.log('UPDATE PASSWORD ERROR', error)
		throw error
	}
}
