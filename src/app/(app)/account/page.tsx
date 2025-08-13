import { getClient } from '@/actions/clients'
import AccountComponent from '@/components/account/account-component'
import { ErrorBoundary } from '@/components/error-boundary'

const AccountPage = async () => {
	const clientData = await getClient()
	console.log('CLIENT DATA:', clientData)
	if (!clientData) {
		return null
	}
	return (
		<ErrorBoundary>
			<AccountComponent clientData={clientData} />
		</ErrorBoundary>
	)
}

export default AccountPage
