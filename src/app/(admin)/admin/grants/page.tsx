import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Grants | Admin | POE',
	description: 'Manage grants and send alerts.',
}
import GrantsComponent from '@/components/admin/grants/grants-component'

export default function GrantsPage() {
	return <GrantsComponent />
}
