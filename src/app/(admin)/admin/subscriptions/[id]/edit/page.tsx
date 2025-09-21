import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Edit Subscription | Admin | POE',
	description: 'Update subscription details.',
}
import { getSubscriptionById } from '@/actions/subscriptions'
import SubscriptionForm from '@/components/admin/subscriptions/subscription-form'

export default async function EditSubscriptionPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const subscription = await getSubscriptionById(id)
	if (!subscription)
		return (
			<div className="text-white font-jose">Subscription not found</div>
		)

	return (
		<SubscriptionForm
			mode="edit"
			subscriptionId={subscription.id}
			defaultValues={{
				clientId: subscription.client_id || undefined,
				periodStart: subscription.period_start?.slice(0, 10) || '',
				periodEnd: subscription.period_end?.slice(0, 10) || '',
				status:
					(subscription.status as 'active' | 'expired' | 'frozen') ||
					'active',
			}}
		/>
	)
}
