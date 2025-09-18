import { getClientWithSubscription } from '@/actions/clients'
import AccountComponent from '@/components/account/account-component'
import { ErrorBoundary } from '@/components/error-boundary'

const AccountPage = async () => {
	const data = await getClientWithSubscription()
	if (!data?.client) return null
	return (
		<ErrorBoundary>
			<AccountComponent
				clientData={data.client}
				subscription={data.subscription}
			/>
		</ErrorBoundary>
	)
}

export default AccountPage
