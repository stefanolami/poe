import SubscriptionForm from '@/components/admin/subscriptions/subscription-form'
import { getClientsEligibleForSubscription } from '@/actions/clients'

interface RawClient {
	id: string
	name: string
	email: string
}

export default async function NewSubscriptionPage() {
	const clients = (await getClientsEligibleForSubscription()) as RawClient[]
	const formClients = clients.map((c) => ({
		id: c.id,
		name: c.name,
		email: c.email,
	}))
	return (
		<SubscriptionForm
			mode="create"
			clients={formClients}
		/>
	)
}
