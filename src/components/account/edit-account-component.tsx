import React from 'react'
import { ClientDataType } from '@/lib/types'
import EditAccountForm from './forms/edit-account-form'
import AccountSummaryFromDB from './summaries/account-summary-db'

const EditAccountComponent = async ({
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
			<EditAccountForm clientData={clientData} />
			<AccountSummaryFromDB clientSelection={clientSelection} />
		</div>
	)
}

export default EditAccountComponent
