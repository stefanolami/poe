import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Edit Tender | Admin | POE',
	description: 'Update tender details.',
}
import { getConsultants } from '@/actions/consultants'
import { getTender } from '@/actions/tenders'
import { TenderEdit } from '@/components/admin/tenders/tender/tender-edit'
import { TailoredAssessmentType, TenderType } from '@/lib/types'
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
	const formattedTender: TenderType = {
		alert_purpose: tender.alert_purpose ?? '',
		amendments: (tender.amendments as string[] | null) ?? null,
		awarding_authority: tender.awarding_authority ?? null,
		call_title: tender.call_title ?? null,
		consultant: tender.consultant?.id ?? null,
		created_at: tender.created_at,
		deadline: (tender.deadline as string[] | null) ?? [],
		vehicles: (tender.vehicles as string[] | null) ?? null,
		vehicles_contracts:
			(tender.vehicles_contracts as string[] | null) ?? null,
		stations: (tender.stations as string[] | null) ?? null,
		stations_contracts:
			(tender.stations_contracts as string[] | null) ?? null,
		files: (tender.files as string[] | null) ?? null,
		further_details: (tender.further_details as string[] | null) ?? null,
		geography: (tender.geography as string[]) ?? [],
		geography_details: tender.geography_details ?? '',
		programme_title: tender.programme_title ?? null,
		id: tender.id,
		in_brief: tender.in_brief ?? '',
		instrument_type: tender.instrument_type ?? null,
		internal_deadline: tender.internal_deadline ?? null,
		intro: tender.intro ?? null,
		matched_clients: (tender.matched_clients as string[] | null) ?? null,
		pre_launch: Boolean(tender.pre_launch),
		programme_purpose: tender.programme_purpose ?? null,
		reference_number: tender.reference_number ?? null,
		sector: tender.sector ?? '',
		sent: Boolean(tender.sent),
		subject_matter: tender.subject_matter ?? null,
		tailored_assessment:
			(tender.tailored_assessment as TailoredAssessmentType[] | null) ??
			null,
		value: tender.value ?? '',
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
