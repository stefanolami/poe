import { getClient } from '@/actions/clients'
import EditAccountComponent from '@/components/account/edit-account-component'

const EditAccountPage = async () => {
	const clientData = await getClient()
	console.log('CLIENT DATA:', clientData)
	if (!clientData) {
		return null
	}
	return <EditAccountComponent clientData={clientData} />
}

export default EditAccountPage
