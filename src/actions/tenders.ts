'use server'

/* import { TenderSchema } from '@/lib/tenders.schema'
import { createClient } from '@/supabase/server' */

/* export const createTender = async (formData: TenderSchema) => {
	const supabase = await createClient()

	const newFormData = {
		title: formData.title,
		location: [formData.location],
		description: formData.description,
		value: Number(formData.value),
		contracting_org: 'Org inc.',
		contract_type: formData.contract_type,
		submission_language: formData.submission_language,
		sector: formData.sector,
		agent: Number(formData.agent),
		type_of_vehicle: [formData.eMobility?.eVehicles.typeOfVehicle],
		type_of_contract: [formData.eMobility?.eVehicles.typeOfContract],
		lots_divided: false,
		eu_funded: true,
		opening: new Date().toISOString(),
		closing: new Date().toISOString(),
	}

	const { data, error } = await supabase
		.from('tenders_e_mobility')
		.insert(newFormData)

	if (error) {
		throw new Error(error.message)
	}

	console.log('DATA: ', data)

	return data
} */
