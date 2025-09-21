import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Edit Tender | Admin | POE',
	description: 'Update tender details.',
}
import { getConsultants } from '@/actions/consultants'
import { getTender } from '@/actions/tenders'
import { TenderEdit } from '@/components/admin/tenders/tender/tender-edit'
import { TailoredAssessmentType } from '@/lib/types'
import { notFound } from 'next/navigation'
import React from 'react'

const TenderEditPage = async ({
	params,
}: {
	params: Promise<{ id: string }>
}) => {
	const { id } = await params

	const consultants = await getConsultants()

	const tender = await getTender(id)
	const formattedTender = {
		...tender,
		tailored_assessment:
			tender.tailored_assessment as TailoredAssessmentType[],
	}

	if (!tender) {
		throw notFound()
	}

	return (
		<TenderEdit
			tender={formattedTender}
			consultants={consultants}
		/>
	)
}

export default TenderEditPage
