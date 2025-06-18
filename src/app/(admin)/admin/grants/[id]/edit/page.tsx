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

	const consultants = await getConsultants()

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
