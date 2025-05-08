import TenderSingle from '@/components/admin/tenders/tender-single'
import React from 'react'

const GrantPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	return <TenderSingle id={id} />
}

export default GrantPage
