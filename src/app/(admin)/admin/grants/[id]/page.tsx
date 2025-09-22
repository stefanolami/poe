import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Grant Details | Admin | POE',
	description: 'View grant details and matches.',
}

import { getClientsByConsultantId } from '@/actions/clients'
import { getGrant } from '@/actions/grants'
import GrantSingle from '@/components/admin/grants/grant/grant-single'
import { TailoredAssessmentType } from '@/lib/types'
import { notFound } from 'next/navigation'
import React from 'react'

const GrantPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	const grant = await getGrant(id)

	if (!grant) {
		throw notFound()
	}
	const formattedGrants = {
		...grant,
		tailored_assessment:
			grant.tailored_assessment as TailoredAssessmentType[],
	}

	const clients = await getClientsByConsultantId()

	const formattedClients = clients?.map((client) => ({
		id: client.id,
		first_name: client.first_name,
		email: client.email,
		last_name: client.last_name,
	}))

	return (
		<GrantSingle
			grant={formattedGrants}
			clients={formattedClients}
		/>
	)
}

export default GrantPage
