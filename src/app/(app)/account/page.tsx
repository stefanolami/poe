import { getClient } from '@/actions/clients'
import AccountComponent from '@/components/account/account-component'

const AccountPage = async () => {
	const clientData = await getClient()
	console.log('CLIENT DATA:', clientData)
	if (!clientData) {
		return null
	}
	return <AccountComponent clientData={clientData} />
}

export default AccountPage
