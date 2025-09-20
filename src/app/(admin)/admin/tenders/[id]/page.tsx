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
		name: client.name,
		email: client.email,
		family_name: client.family_name,
	}))

	return (
		<TenderSingle
			tender={formattedTender}
			clients={formattedClients}
		/>
	)
}

export default TenderPage
