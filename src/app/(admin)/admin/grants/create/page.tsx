import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Create Grant | Admin | POE',
	description: 'Create a new grant and notify matched clients.',
}

import { getConsultants } from '@/actions/consultants'
import { GrantsForm } from '@/components/admin/grants/grants-form'
import React from 'react'

const CreateGrantPage = async () => {
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
	return (
		<div className="w-full">
			<GrantsForm consultants={consultants} />
		</div>
	)
}

export default CreateGrantPage
