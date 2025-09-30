import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Edit Investment | Admin | POE',
	description: 'Update investment details.',
}

import { getConsultants } from '@/actions/consultants'
import { TailoredAssessmentType, InvestmentType } from '@/lib/types'
import { notFound } from 'next/navigation'
import React from 'react'
import { getInvestment } from '@/actions/investments'
import { InvestmentEdit } from '@/components/admin/investments/investment/investment-edit'

const InvestmentsEditPage = async ({
	params,
}: {
	params: Promise<{ id: string }>
}) => {
	const { id } = await params

	const consultantsRaw = await getConsultants()
	type ConsultantRow = {
		id: string
		first_name?: string | null
		last_name?: string | null
		email?: string | null
	}
	const consultants = (
		(consultantsRaw as ConsultantRow[] | null | undefined) || []
	).map((c: ConsultantRow) => ({
		id: c.id,
		name:
			[c.first_name, c.last_name].filter(Boolean).join(' ') ||
			c.email ||
			'Unnamed',
	}))

	const investment = await getInvestment(id)
	const formattedInvestment: InvestmentType = {
		alert_purpose: investment.alert_purpose ?? '',
		amendments: (investment.amendments as string[] | null) ?? null,
		awarding_authority: investment.awarding_authority ?? null,
		call_title: investment.call_title ?? null,
		consultant: investment.consultant?.id ?? null,
		created_at: investment.created_at,
		deadline: (investment.deadline as string[] | null) ?? null,
		files: (investment.files as string[] | null) ?? null,
		further_details:
			(investment.further_details as string[] | null) ?? null,
		geography: (investment.geography as string[]) ?? [],
		geography_details: investment.geography_details ?? '',
		programme_title: investment.programme_title ?? null,
		id: investment.id,
		in_brief: investment.in_brief ?? '',
		instrument_type: investment.instrument_type ?? null,
		internal_deadline: investment.internal_deadline ?? null,
		intro: investment.intro ?? null,
		matched_clients:
			(investment.matched_clients as string[] | null) ?? null,
		pre_launch: Boolean(investment.pre_launch),
		programme_purpose: investment.programme_purpose ?? null,
		reference_number: investment.reference_number ?? null,
		sector: investment.sector ?? '',
		sent: Boolean(investment.sent),
		subject_matter: investment.subject_matter ?? null,
		tailored_assessment:
			(investment.tailored_assessment as
				| TailoredAssessmentType[]
				| null) ?? null,
		value: investment.value ?? '',
	}

	if (!investment) {
		throw notFound()
	}

	return (
		<InvestmentEdit
			investment={formattedInvestment}
			consultants={consultants}
		/>
	)
}

export default InvestmentsEditPage
