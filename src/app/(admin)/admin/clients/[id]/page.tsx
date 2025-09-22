import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Client Details | Admin | POE',
	description: 'View and edit a client profile.',
}
import { getClientById } from '@/actions/clients'
import { getConsultants } from '@/actions/consultants'
import ClientSingle from '@/components/admin/clients/client/client-single'
import { notFound } from 'next/navigation'
import React from 'react'

const ClientPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	const [client, consultants] = await Promise.all([
		getClientById(id),
		getConsultants(),
	])

	if (!client) {
		throw notFound()
	}

	return (
		<ClientSingle
			client={client}
			consultants={consultants}
		/>
	)
}

export default ClientPage
