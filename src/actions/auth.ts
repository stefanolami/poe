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
		//console.log('GET USER', user)
		if (!user) return null

		const { data: profile } = await supabase
			.from('users_profiles')
			.select('*')
			.eq('user_id', user.id)
			.single()
		//console.log('GET USER PROFILE', profile)

		return profile?.role ?? null
	} catch (error) {
		console.log('GET USER ROLE ERROR', error)
		throw error
	}
}
