import React from 'react'
import CreateAccountForm from './create-account-form'
import CreateAccountSummary from './create-account-summary'

const CreateAccountComponent = () => {
	return (
		<div className="w-4/5 mx-auto max-w-[500px] lg:grid grid-cols-2 lg:max-w-[1000px] lg:gap-20 text-primary">
			<CreateAccountSummary />
			<CreateAccountForm />
		</div>
	)
}

export default CreateAccountComponent
