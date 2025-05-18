import { getGrant } from '@/actions/grants'
import GrantSingle from '@/components/admin/grants/grant/grant-single'
import { notFound } from 'next/navigation'
import React from 'react'

const GrantPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	const grant = await getGrant(Number(id))

	if (!grant) {
		throw notFound()
	}

	return <GrantSingle grant={grant} />
}

export default GrantPage
