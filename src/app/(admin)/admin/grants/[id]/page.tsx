import { getGrant } from '@/actions/grants'
import GrantSingle from '@/components/admin/grants/grant-single'
import React from 'react'

const GrantPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	const grant = await getGrant(Number(id))

	if (!grant) {
		return <div>Tender not found</div>
	}

	return <GrantSingle grant={grant} />
}

export default GrantPage
