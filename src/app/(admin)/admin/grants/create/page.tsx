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
