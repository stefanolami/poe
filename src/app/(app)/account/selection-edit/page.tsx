import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Edit Selection | POE',
	description: 'Modify your E-Mobility selection.',
}

import { getClientWithSubscription } from '@/actions/clients'
import SelectionEdit from '@/components/account/selection-edit'

export default async function SelectionEditPage() {
	const result = await getClientWithSubscription()
	if (!result || !result.client) return null

	const { client, subscription } = result
	const clientSelection = {
		typeOfVehicle: client.vehicles_type || [],
		typeOfVehicleContract: client.vehicles_contract || [],
		chargingStations: client.charging_stations_type || [],
		chargingStationsContract: client.charging_stations_contract || [],
		pif: client.pif || [],
		deployment: client.deployment || [],
		project: client.project || [],
	}

	// Extract ISO date (yyyy-mm-dd) from subscription.period_end if present
	const subscriptionPeriodEnd = subscription?.period_end
		? subscription.period_end.slice(0, 10)
		: null

	return (
		<div className="w-full px-4 md:px-8 mx-auto max-w-6xl text-primary mb-16 lg:mb-20">
			<h1 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4">
				Edit Selection
			</h1>
			<SelectionEdit
				clientId={client.id}
				initialSelection={clientSelection}
				subscriptionPeriodEnd={subscriptionPeriodEnd}
			/>
		</div>
	)
}
