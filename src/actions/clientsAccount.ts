'use server'

import { CreateAccountType } from '@/lib/types'
import { createClient } from '@/supabase/server'

export const createClientAccount = async (data: CreateAccountType) => {
	try {
		const supabase = await createClient()

		const { data: response, error } = await supabase
			.from('clients')
			.insert({
				name: data.name,
				family_name: data.familyName,
				org_name: data.orgName,
				email: data.email,
				password: data.password,
			})
			.select()
			.single()

		if (error) throw error
		console.log('Account created successfully', response)
		return response
	} catch (error) {
		console.log('CREATE ACCOUNT ERROR', error)
		throw error
	}
}

export const getClientAccount = async (id: number) => {
	try {
		const supabase = await createClient()

		const { data: response, error } = await supabase
			.from('clients')
			.select('*')
			.eq('id', id)
			.single()

		if (error) throw error
		console.log('Account retrieved successfully', response)
		return response
	} catch (error) {
		console.log('GET ACCOUNT ERROR', error)
		throw error
	}
}
