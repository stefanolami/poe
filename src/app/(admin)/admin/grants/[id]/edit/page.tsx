import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Edit Grant | Admin | POE',
	description: 'Update grant details.',
}

import { getConsultants } from '@/actions/consultants'
import { getGrant } from '@/actions/grants'
import { GrantEdit } from '@/components/admin/grants/grant/grant-edit'
import { TailoredAssessmentType } from '@/lib/types'
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
	const formattedGrant = {
		...grant,
		tailored_assessment:
			grant.tailored_assessment as TailoredAssessmentType[],
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
