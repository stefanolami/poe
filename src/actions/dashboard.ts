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
			.select('created_at, id, first_name, last_name, org_name')
			.gte('created_at', threeMonthsAgoISO)
			.order('created_at', { ascending: false })

		if (clientsError) {
			console.error('ERROR FETCHING CLIENTS FOR DASHBOARD', clientsError)
			throw new Error(clientsError.message)
		}

		const { data: grantsData, error: grantsError } = await supabase
			.from('grants')
			.select('created_at, id, call_title, programme_title')
			.gte('created_at', threeMonthsAgoISO)
			.order('created_at', { ascending: false })

		if (grantsError) {
			console.error('ERROR FETCHING GRANTS FOR DASHBOARD', grantsError)
			throw new Error(grantsError.message)
		}

		const { data: alertsData, error: alertsError } = await supabase
			.from('alerts')
			.select('created_at, matched_clients, id, subject')
			.gte('created_at', threeMonthsAgoISO)
			.order('created_at', { ascending: false })

		if (alertsError) {
			console.error('ERROR FETCHING ALERTS FOR DASHBOARD', alertsError)
			throw new Error(alertsError.message)
		}

		const { data: tendersData, error: tendersError } = await supabase
			.from('tenders')
			.select('created_at, id, call_title, programme_title')
			.gte('created_at', threeMonthsAgoISO)
			.order('created_at', { ascending: false })

		if (tendersError) {
			console.error('ERROR FETCHING TENDERS FOR DASHBOARD', tendersError)
			throw new Error(tendersError.message)
		}

		const { data: investmentsData, error: investmentsError } =
			await supabase
				.from('investments')
				.select('created_at, id, call_title, programme_title')
				.gte('created_at', threeMonthsAgoISO)
				.order('created_at', { ascending: false })

		if (investmentsError) {
			console.error(
				'ERROR FETCHING INVESTMENTS FOR DASHBOARD',
				investmentsError
			)
			throw new Error(investmentsError.message)
		}

		return {
			clients: clientsData ?? [],
			grants: grantsData ?? [],
			tenders: tendersData ?? [],
			investments: investmentsData ?? [],
			alerts: alertsData ?? [],
		}
	} catch (error) {
		console.log('ERROR FETCHING GRANTS', error)
		throw error
	}
}
