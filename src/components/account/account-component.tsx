import React from 'react'
import AccountSummary from './account-summary'
import AccountView from './account-view'
import { ClientDataType } from '@/lib/types'

const AccountComponent = async ({
	clientData,
}: {
	clientData: ClientDataType
}) => {
	return (
		<div className="w-4/5 mx-auto max-w-[500px] lg:grid grid-cols-2 lg:max-w-[1000px] lg:gap-20 text-primary mb-16 lg:mb-0">
			<AccountSummary />
			<AccountView clientData={clientData} />
		</div>
	)
}

export default AccountComponent
