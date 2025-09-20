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
