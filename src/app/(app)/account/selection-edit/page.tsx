import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Edit Selection | POE',
	description: 'Modify your E-Mobility selection.',
}

import { getClient } from '@/actions/clients'
import SelectionEdit from '@/components/account/selection-edit'

export default async function SelectionEditPage() {
	const clientData = await getClient()
	if (!clientData) return null

	const clientSelection = {
		typeOfVehicle: clientData.vehicles_type || [],
		typeOfVehicleContract: clientData.vehicles_contract || [],
		chargingStations: clientData.charging_stations_type || [],
		chargingStationsContract: clientData.charging_stations_contract || [],
		pif: clientData.pif || [],
		deployment: clientData.deployment || [],
		project: clientData.project || [],
	}

	return (
		<div className="w-full px-4 md:px-8 mx-auto max-w-6xl text-primary mb-16 lg:mb-20">
			<h1 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4">
				Edit Selection
			</h1>
			<SelectionEdit
				clientId={clientData.id}
				initialSelection={clientSelection}
			/>
		</div>
	)
}
