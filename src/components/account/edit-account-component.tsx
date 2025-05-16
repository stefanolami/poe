import React from 'react'
import { ClientDataType } from '@/lib/types'
import EditAccountForm from './edit-account-form'
import AccountSummary from './account-summary'

const EditAccountComponent = async ({
	clientData,
}: {
	clientData: ClientDataType
}) => {
	return (
		<div className="w-4/5 mx-auto max-w-[500px] lg:grid grid-cols-2 lg:max-w-[1000px] lg:gap-20 text-primary">
			<AccountSummary />
			<EditAccountForm clientData={clientData} />
		</div>
	)
}

export default EditAccountComponent
