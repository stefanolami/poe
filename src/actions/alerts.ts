'use server'

import { CreateAlertType } from '@/lib/types'
import { createClient } from '@/supabase/server'

export const getAlerts = async () => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('alerts')
			.select('*')
			.order('created_at', { ascending: false })

		if (error) {
			throw new Error(error.message)
		}

		const formattedData = data.map((alert) => ({
			id: alert.id,
			subject: alert.subject,
			entity_type: alert.entity_type,
			created_at: new Date(alert.created_at).toLocaleDateString('en-GB', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			}),
			entity_id: alert.entity_id,
			matched_clients: alert.matched_clients,
		}))

		return formattedData
	} catch (error) {
		console.log('ERROR FETCHING ALERTS', error)
		throw error
	}
}

export const getAlert = async (id: string) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('alerts')
			.select('*')
			.eq('id', id)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		const formattedData = {
			id: data.id,
			subject: data.subject,
			entity_type: data.entity_type,
			created_at: new Date(data.created_at).toLocaleDateString('en-GB', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			}),
			entity_id: data.entity_id,
			matched_clients: data.matched_clients,
		}

		return formattedData
	} catch (error) {
		console.log('ERROR FETCHING ALERT', error)
		throw error
	}
}

export const createAlert = async (alert: CreateAlertType) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase.from('alerts').insert(alert)

		if (error) {
			throw new Error(error.message)
		}
		console.log('Alert created successfully:', data)
		return data
	} catch (error) {
		console.log('ERROR CREATING ALERT', error)
		throw error
	}
}
