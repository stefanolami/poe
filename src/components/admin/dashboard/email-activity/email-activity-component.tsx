import React from 'react'
import { EmailActivityTable } from './email-activity-table'
import { Activity } from '@/lib/types'
import { columns } from './email-activity-columns'

const EmailActivityComponent = ({ data }: { data: Activity[] }) => {
	return (
		<div className="my-20">
			<h1 className="text-white font-jose text-2xl mb-10">
				Email Activity
			</h1>
			<EmailActivityTable
				data={data}
				columns={columns}
			/>
		</div>
	)
}

export default EmailActivityComponent
