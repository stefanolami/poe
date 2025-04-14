'use server'

import { createClient } from '@/supabase/server'

export const authenticate = async (email: string, password: string) => {
	try {
		const supabase = await createClient()

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		console.log(email, password)
		console.log('Authenticated')
		if (error) throw error
	} catch (error) {
		console.log('AUTH ERROR', error)
		throw error
	}
}

export const logout = async () => {
	try {
		const supabase = await createClient()

		const { error } = await supabase.auth.signOut()
		if (error) throw error
	} catch (error) {
		console.log('LOGOUT ERROR', error)
		throw error
	}
}
