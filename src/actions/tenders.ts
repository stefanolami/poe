'use server'

import { TenderSchema } from '@/lib/tenders.schema'
import { createClient } from '@/supabase/server'

export const createTender = async (formData: TenderSchema) => {
	const supabase = await createClient()

	const newFormData = {
		title: formData.title,
		location: [formData.location],
		description: formData.description,
		value: Number(formData.value),
		contracting_org: formData.contracting_org_name,
		contract_type: formData.contract_type,
		submission_language: formData.submission_language,
		sector: formData.sector,
		agent: Number(formData.agent),
		lots_divided: formData.lots_divided === 'yes' ? true : false,
		lots_number: Number(formData.lots_number) || null,
		tenders_for_all_lots:
			formData.tenders_for_all_lots === 'yes' ? true : false,
		eu_funded: formData.eu_funded === 'yes' ? true : false,
		eu_funded_details: formData.eu_funded_details || null,
		opening: formData.opening.toISOString(),
		closing: formData.closing.toISOString(),
		type_of_vehicle: formData.eMobility?.eVehicles.typeOfVehicle,
		type_of_contract_vehicles: formData.eMobility?.eVehicles.typeOfContract,
		charging_stations: formData.eMobility?.chargingStations.typeOfVehicle,
		type_of_contract_charging_stations:
			formData.eMobility?.chargingStations.typeOfContract,
	}

	const { data, error } = await supabase
		.from('tenders_e_mobility')
		.insert(newFormData)
		.select()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export const getTenders = async () => {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('tenders_e_mobility')
		.select('*')
		.order('created_at', { ascending: false })

	if (error) {
		throw new Error(error.message)
	}

	const formattedData = data.map((tender) => ({
		id: tender.id,
		title: tender.title,
		location: tender.location[0],
		value: tender.value,
	}))

	return formattedData
}

export const getTender = async (id: number) => {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('tenders_e_mobility')
		.select('*')
		.eq('id', id)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}
