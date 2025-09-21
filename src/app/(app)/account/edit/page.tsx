import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Edit Account | POE',
	description: 'Edit your POE account details.',
}
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
