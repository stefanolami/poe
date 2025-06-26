import { getClientById } from '@/actions/clients'
import ClientSingle from '@/components/admin/clients/client/client-single'
import { notFound } from 'next/navigation'
import React from 'react'

const ClientPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	const client = await getClientById(id)

	if (!client) {
		throw notFound()
	}

	return <ClientSingle client={client} />
}

export default ClientPage
