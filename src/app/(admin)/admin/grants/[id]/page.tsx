import GrantSingle from '@/components/admin/grants/grant-single'
import React from 'react'

const GrantPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	return <GrantSingle id={id} />
}

export default GrantPage
