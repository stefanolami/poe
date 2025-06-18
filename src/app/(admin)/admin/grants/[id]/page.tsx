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
		name: client.name,
		email: client.email,
		family_name: client.family_name,
	}))

	return (
		<GrantSingle
			grant={formattedGrants}
			clients={formattedClients}
		/>
	)
}

export default GrantPage
