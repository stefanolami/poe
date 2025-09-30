import type { Metadata } from 'next'
import { getClientsByConsultantId } from '@/actions/clients'
import { TailoredAssessmentType } from '@/lib/types'
import { notFound } from 'next/navigation'
import React from 'react'
import { getInvestment } from '@/actions/investments'
import InvestmentSingle from '@/components/admin/investments/investment/investment-single'

export const metadata: Metadata = {
	title: 'Investment Details | Admin | POE',
	description: 'View investment details and matches.',
}

const InvestmentsPage = async ({
	params,
}: {
	params: Promise<{ id: string }>
}) => {
	const { id } = await params

	const investment = await getInvestment(id)

	if (!investment) {
		throw notFound()
	}
	const formattedInvestments = {
		...investment,
		tailored_assessment:
			investment.tailored_assessment as TailoredAssessmentType[],
	}

	const clients = await getClientsByConsultantId()

	const formattedClients = clients?.map((client) => ({
		id: client.id,
		first_name: client.first_name,
		email: client.email,
		last_name: client.last_name,
	}))

	return (
		<InvestmentSingle
			investment={formattedInvestments}
			clients={formattedClients}
		/>
	)
}

export default InvestmentsPage
