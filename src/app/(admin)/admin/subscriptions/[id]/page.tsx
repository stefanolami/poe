import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Subscription Details | Admin | POE',
	description: 'View subscription details.',
}
import SubscriptionSingle from '@/components/admin/subscriptions/subscription-single'

const SubscriptionDetailPage = async ({
	params,
}: {
	params: Promise<{ id: string }>
}) => {
	const { id } = await params
	return <SubscriptionSingle id={id} />
}

export default SubscriptionDetailPage
