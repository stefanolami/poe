import { getDashboardData } from '@/actions/dashboard'
import { getEmailActivity } from '@/actions/mailersend'
import { DashboardCardSection } from '@/components/admin/dashboard/dashboard-cards-section'
import { ActivityItem } from '@/lib/types'
import React from 'react'
import EmailActivityComponent from './email-activity/email-activity-component'

const DashboardComponent = async () => {
	const data = await getDashboardData()
	const activity = await getEmailActivity()

	const formattedActivity = activity.data.map((item: ActivityItem) => ({
		entity_name: item.email.subject
			.match(/^POE Alert - ([^-]+) - (.+)$/)?.[2]
			.trim(),
		entity_type: item.email.subject
			.match(/^POE Alert - ([^-]+) - (.+)$/)?.[1]
			.trim(),
		created_at: new Date(item.created_at).toLocaleDateString('en-GB', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}),
		recipient: item.email.recipient.email,
		event_type: item.type,
		email_status: item.email.status,
	}))
	console.log('Email activity:', formattedActivity)
	return (
		<div className="bg-primary text-white">
			<h1 className="text-white font-jose text-2xl">Dashboard</h1>
			<DashboardCardSection data={data} />
			<EmailActivityComponent data={formattedActivity} />
		</div>
	)
}

export default DashboardComponent
