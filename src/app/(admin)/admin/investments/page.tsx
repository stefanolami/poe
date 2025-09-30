import type { Metadata } from 'next'
import InvestmentsComponent from '@/components/admin/investments/investments-component'

export const metadata: Metadata = {
	title: 'Investments | Admin | POE',
	description: 'Manage investments and send alerts.',
}

export default function InvestmentsPage() {
	return <InvestmentsComponent />
}
