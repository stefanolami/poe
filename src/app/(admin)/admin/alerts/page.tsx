import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Alerts | Admin | POE',
	description: 'Manage alerts for grants and tenders.',
}
import AlertsComponent from '@/components/admin/alerts/alerts-component'

export default function AlertsPage() {
	return <AlertsComponent />
}
