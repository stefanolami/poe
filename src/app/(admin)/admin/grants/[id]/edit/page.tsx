import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Edit Grant | Admin | POE',
	description: 'Update grant details.',
}

import { getConsultants } from '@/actions/consultants'
import { getGrant } from '@/actions/grants'
import { GrantEdit } from '@/components/admin/grants/grant/grant-edit'
import { TailoredAssessmentType, GrantType } from '@/lib/types'
import { notFound } from 'next/navigation'
import React from 'react'

const GrantEditPage = async ({
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

	const grant = await getGrant(id)
	// Normalize to GrantType shape expected by the form component
	const formattedGrant: GrantType = {
		alert_purpose: grant.alert_purpose ?? '',
		amendments: (grant.amendments as string[] | null) ?? null,
		awarding_authority: grant.awarding_authority ?? null,
		call_title: grant.call_title ?? null,
		consultant: grant.consultant?.id ?? null,
		created_at: grant.created_at,
		deadline: (grant.deadline as string[] | null) ?? [],
		deployment: (grant.deployment as string[] | null) ?? null,
		files: (grant.files as string[] | null) ?? null,
		further_details: (grant.further_details as string[] | null) ?? null,
		geography: (grant.geography as string[]) ?? [],
		geography_details: grant.geography_details ?? '',
		programme_title: grant.programme_title ?? null,
		id: grant.id,
		in_brief: grant.in_brief ?? '',
		instrument_type: grant.instrument_type ?? null,
		internal_deadline: grant.internal_deadline ?? null,
		intro: grant.intro ?? null,
		matched_clients: (grant.matched_clients as string[] | null) ?? null,
		pre_launch: Boolean(grant.pre_launch),
		programme_purpose: grant.programme_purpose ?? null,
		project: (grant.project as string[] | null) ?? null,
		reference_number: grant.reference_number ?? null,
		sector: grant.sector ?? '',
		sent: Boolean(grant.sent),
		subject_matter: grant.subject_matter ?? null,
		tailored_assessment:
			(grant.tailored_assessment as TailoredAssessmentType[] | null) ??
			null,
		value: grant.value ?? '',
	}

	if (!grant) {
		throw notFound()
	}

	return (
		<GrantEdit
			grant={formattedGrant}
			consultants={consultants}
		/>
	)
}

export default GrantEditPage
