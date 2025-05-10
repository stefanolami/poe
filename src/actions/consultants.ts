'use server'

import { createClient } from '@/supabase/server'

export const getConsultants = async () => {
	const supabase = await createClient()

	const { data, error } = await supabase.from('consultants').select('*')

	if (error) {
		throw new Error(error.message)
	}

	return data
}
