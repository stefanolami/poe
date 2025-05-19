import { getClientsByConsultantId } from '@/actions/clients'
import { getGrant } from '@/actions/grants'
import GrantSingle from '@/components/admin/grants/grant/grant-single'
import { notFound } from 'next/navigation'
import React from 'react'

const GrantPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	const grant = await getGrant(Number(id))

	if (!grant) {
		throw notFound()
	}

	const clients = await getClientsByConsultantId()

	const formattedClients = clients?.map((client) => ({
		id: client.id,
		name: client.name,
		email: client.email,
		family_name: client.family_name,
	}))

	return (
		<GrantSingle
			grant={grant}
			clients={formattedClients}
		/>
	)
}

export default GrantPage
