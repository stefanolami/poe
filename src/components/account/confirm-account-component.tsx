import React from 'react'
import CreateAccountForm from './create-account-form'
import { ClientTempType } from '@/lib/types'
import ConfirmAccountSummary from './confirm-account-summary'

const ConfirmAccountComponent = ({
	clientData,
}: {
	clientData: ClientTempType
}) => {
	return (
		<div className="w-4/5 mx-auto max-w-[500px] lg:grid grid-cols-2 lg:max-w-[1000px] lg:gap-20 text-primary mb-16 lg:mb-0">
			<ConfirmAccountSummary clientData={clientData} />
			<CreateAccountForm />
		</div>
	)
}

export default ConfirmAccountComponent
