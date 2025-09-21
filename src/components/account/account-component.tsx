'use client'

import React from 'react'
import AccountView from './account-view'
import { ClientDataType } from '@/lib/types'
import AccountSummaryFromDB from './summaries/account-summary-db'
import SubscriptionCard, { SubscriptionRow } from './subscription-card'

const AccountComponent = ({
	clientData,
	subscription,
}: {
	clientData: ClientDataType
	subscription?: SubscriptionRow | null
}) => {
	console.log('SUBSCRIPTION:', subscription)
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
			<div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
				<div className="space-y-6 lg:col-span-1">
					<div className="bg-white/70 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-sm">
						<AccountView clientData={clientData} />
					</div>
					<SubscriptionCard
						subscription={subscription}
						accountCreatedAt={clientData.created_at}
					/>
				</div>
				<div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-sm">
					<AccountSummaryFromDB clientSelection={clientSelection} />
				</div>
			</div>
		</div>
	)
}

export default AccountComponent
