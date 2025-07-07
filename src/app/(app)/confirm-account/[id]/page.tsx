import { getClientTempById } from '@/actions/clients'
import ConfirmAccountComponent from '@/components/account/confirm-account-component'
import { notFound } from 'next/navigation'
import React from 'react'

const ConfirmAccountPage = async ({
	params,
}: {
	params: Promise<{ id: string }>
}) => {
	const { id } = await params

	const client = await getClientTempById(id)

	console.log('client', client)

	if (!client) {
		throw notFound()
	}

	return <ConfirmAccountComponent clientData={client} />
}

export default ConfirmAccountPage
