import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Create Grant | Admin | POE',
	description: 'Create a new grant and notify matched clients.',
}

import { getConsultants } from '@/actions/consultants'
import { GrantsForm } from '@/components/admin/grants/grants-form'
import React from 'react'

const CreateGrantPage = async () => {
	const consultants = await getConsultants()
	return (
		<div className="w-full">
			<GrantsForm consultants={consultants} />
		</div>
	)
}

export default CreateGrantPage
