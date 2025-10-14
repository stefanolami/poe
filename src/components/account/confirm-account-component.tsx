import React from 'react'
import CreateAccountForm from './forms/create-account-form'
import { ClientTempType } from '@/lib/types'
import AccountSummaryFromDB from './summaries/account-summary-db'

const ConfirmAccountComponent = ({
	clientData,
}: {
	clientData: ClientTempType
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
			<CreateAccountForm />
			<AccountSummaryFromDB
				clientSelection={clientSelection}
				enableEditing={false}
			/>
		</div>
	)
}

export default ConfirmAccountComponent
