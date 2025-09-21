import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Alert Details | Admin | POE',
	description: 'View the details of a specific alert.',
}
import { getAlert } from '@/actions/alerts'
import { getClientsByIds } from '@/actions/clients'
import AlertSingle from '@/components/admin/alerts/alert/alert-single'
import { notFound } from 'next/navigation'
import React from 'react'

const AlertPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	const alert = await getAlert(id)

	if (!alert) {
		throw notFound()
	}
	console.log('ALERT:', alert)

	const clients = await getClientsByIds(alert.matched_clients || [])

	const formattedClients = clients?.map((client) => ({
		id: client.id,
		email: client.email,
		name: client.name,
		family_name: client.family_name,
	}))

	return (
		<AlertSingle
			alert={alert}
			clients={formattedClients}
		/>
	)
}

export default AlertPage
