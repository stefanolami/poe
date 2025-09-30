import { getDashboardData } from '@/actions/dashboard'
import { getEmailActivity } from '@/actions/mailersend'
import { DashboardCardSection } from '@/components/admin/dashboard/dashboard-cards-section'
import { ActivityItem } from '@/lib/types'
import React from 'react'
import EmailActivityComponent from './email-activity/email-activity-component'

const DashboardComponent = async () => {
	const data = await getDashboardData()
	const activity = await getEmailActivity()

	const formattedActivity = (activity?.data ?? []).map(
		(item: ActivityItem) => {
			const match = item.email.subject.match(
				/^POE Alert - ([^-]+) - (.+)$/
			)
			const entity_type = match?.[1]?.trim() || 'Unknown'
			const entity_name = match?.[2]?.trim() || item.email.subject
			return {
				entity_name,
				entity_type,
				created_at: new Date(item.created_at).toLocaleDateString(
					'en-GB',
					{
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
					}
				),
				recipient: item.email.recipient.email,
				event_type: item.type,
				email_status: item.email.status,
			}
		}
	)
	return (
		<div className="bg-primary text-white">
			<h1 className="text-white font-jose text-2xl">Dashboard</h1>
			<DashboardCardSection data={data} />
			<EmailActivityComponent data={formattedActivity} />
		</div>
	)
}

export default DashboardComponent
