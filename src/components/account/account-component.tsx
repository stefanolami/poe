import React from 'react'
import AccountView from './account-view'
import { ClientDataType } from '@/lib/types'
import AccountSummaryFromDB from './summaries/account-summary-db'

const AccountComponent = async ({
	clientData,
}: {
	clientData: ClientDataType
}) => {
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
		<div className="w-4/5 mx-auto max-w-[500px] lg:grid grid-cols-2 lg:max-w-[1000px] lg:gap-20 text-primary mb-16 lg:mb-0">
			<AccountSummaryFromDB clientSelection={clientSelection} />
			<AccountView clientData={clientData} />
		</div>
	)
}

export default AccountComponent
