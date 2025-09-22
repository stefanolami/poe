import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Tender Details | Admin | POE',
	description: 'View tender details and matches.',
}
import { getClientsByConsultantId } from '@/actions/clients'
import { getTender } from '@/actions/tenders'
import TenderSingle from '@/components/admin/tenders/tender/tender-single'
import { TailoredAssessmentType } from '@/lib/types'
import { notFound } from 'next/navigation'
import React from 'react'

const TenderPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	const tender = await getTender(id)

	if (!tender) {
		throw notFound()
	}
	const formattedTender = {
		...tender,
		tailored_assessment:
			tender.tailored_assessment as TailoredAssessmentType[],
	}

	const clients = await getClientsByConsultantId()

	const formattedClients = clients?.map((client) => ({
		id: client.id,
		first_name: client.first_name,
		email: client.email,
		last_name: client.last_name,
	}))

	return (
		<TenderSingle
			tender={formattedTender}
			clients={formattedClients}
		/>
	)
}

export default TenderPage
