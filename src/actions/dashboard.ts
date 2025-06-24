'use server'

import { createClient } from '@/supabase/server'

export const getDashboardData = async () => {
	try {
		const supabase = await createClient()

		// Calculate the ISO date string for 3 months ago
		const threeMonthsAgo = new Date()
		threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
		const threeMonthsAgoISO = threeMonthsAgo.toISOString()

		const { data: clientsData, error: clientsError } = await supabase
			.from('clients')
			.select('created_at')
			.gte('created_at', threeMonthsAgoISO)

		if (clientsError) {
			console.error('ERROR FETCHING CLIENTS FOR DASHBOARD', clientsError)
			throw new Error(clientsError.message)
		}

		const { data: grantsData, error: grantsError } = await supabase
			.from('grants')
			.select('created_at')
			.gte('created_at', threeMonthsAgoISO)

		if (grantsError) {
			console.error('ERROR FETCHING GRANTS FOR DASHBOARD', grantsError)
			throw new Error(grantsError.message)
		}

		const { data: alertsData, error: alertsError } = await supabase
			.from('alerts')
			.select('created_at, matched_clients')
			.gte('created_at', threeMonthsAgoISO)

		if (alertsError) {
			console.error('ERROR FETCHING ALERTS FOR DASHBOARD', alertsError)
			throw new Error(alertsError.message)
		}

		return {
			clients: clientsData ?? [],
			grants: grantsData ?? [],
			alerts: alertsData ?? [],
		}
	} catch (error) {
		console.log('ERROR FETCHING GRANTS', error)
		throw error
	}
}

export const getGrants = async () => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('grants')
			.select('*')
			.order('created_at', { ascending: false })

		if (error) {
			throw new Error(error.message)
		}

		const formattedData = data.map((grant) => ({
			id: grant.id,
			sent: grant.sent,
			geography: grant.geography.join(', '),
			call_title: grant.call_title,
			grant_programme: grant.grant_programme,
			value: grant.value,
		}))

		return formattedData
	} catch (error) {
		console.log('ERROR FETCHING GRANTS', error)
		throw error
	}
}
