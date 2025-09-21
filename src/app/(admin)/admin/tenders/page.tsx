import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Tenders | Admin | POE',
	description: 'Manage tenders and send alerts.',
}
import TendersComponent from '@/components/admin/tenders/tenders-component'

export default function TendersPage() {
	return <TendersComponent />
}
