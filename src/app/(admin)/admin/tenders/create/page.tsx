import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Create Tender | Admin | POE',
	description: 'Create a new tender and notify matched clients.',
}
import { getConsultants } from '@/actions/consultants'
import { TendersForm } from '@/components/admin/tenders/tenders-form'
import React from 'react'

const CreateTenderPage = async () => {
	const consultants = await getConsultants()
	return (
		<div className="w-full">
			<TendersForm consultants={consultants} />
		</div>
	)
}

export default CreateTenderPage
