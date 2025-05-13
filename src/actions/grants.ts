'use server'

import { CreateGrantType } from '@/lib/types'
import { createClient } from '@/supabase/server'

export const createGrant = async (formData: CreateGrantType) => {
	const supabase = await createClient()

	const flatDeadline = formData.deadline.map((element) => element.join(' '))
	const flatFurtherDetails = formData.further_details?.map((element) =>
		element.join(' ')
	)

	const formattedData = {
		geography: formData.geography,
		call_title: formData.call_title,
		grant_programme: formData.grant_programme,
		alert_purpose: formData.alert_purpose,
		instrument_type: formData.instrument_type,
		awarding_authority: formData.awarding_authority,
		reference_number: formData.reference_number,
		deadline: flatDeadline,
		further_details: flatFurtherDetails,
		in_brief: formData.in_brief,
		value: formData.value,
		consultant: Number(formData.consultant),
		sector: formData.sector,
		vehicles_type: formData.vehicles_type,
		vehicles_contract: formData.vehicles_contract,
		charging_stations_type: formData.charging_stations_type,
		charging_stations_contract: formData.charging_stations_contract,
	}

	const { data, error } = await supabase
		.from('grants')
		.insert(formattedData)
		.select()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export const getGrants = async () => {
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
		geography: grant.geography.join(', '),
		call_title: grant.call_title,
		grant_programme: grant.grant_programme,
		value: grant.value,
	}))

	return formattedData
}

export const getGrant = async (id: number) => {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('grants')
		.select('*')
		.eq('id', id)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}
