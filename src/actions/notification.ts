'use server'

import { createClient } from '@/supabase/server'
import { sendEmail } from './email'

export async function notify(title: string) {
	const supabase = await createClient()

	const { data: tender, error } = await supabase
		.from('tenders_e_mobility')
		.select('*')
		.eq('title', title)
		.single()

	if (error || !tender)
		throw new Error('Error fetching tender: ' + error.message || '')

	if (tender.type_of_vehicle) {
		const { data, error: filterError } = await supabase
			.from('users')
			.select('email')
			.eq('type_of_vehicle', tender.type_of_vehicle[0])

		if (filterError)
			throw new Error('Error fetching users: ' + filterError.message)
		if (!data) {
			console.log('No users found')
			return
		}

		data.forEach(async (user: { email: string }) => {
			const emailResponse = await sendEmail(user.email, 'New Tender')
			console.log(emailResponse)
		})

		return data
	}
}
