import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Clients | Admin | POE',
	description: 'Browse and manage client accounts.',
}
import ClientsComponent from '@/components/admin/clients/clients-component'

export default function ClientsPage() {
	return <ClientsComponent />
}
