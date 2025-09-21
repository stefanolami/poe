import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Subscriptions | Admin | POE',
	description: 'Manage client subscriptions and renewals.',
}
import SubscriptionsComponent from '@/components/admin/subscriptions/subscriptions-component'

export default function AdminSubscriptionsPage() {
	return <SubscriptionsComponent />
}
