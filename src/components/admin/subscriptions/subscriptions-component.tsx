import Link from 'next/link'
import { fetchSubscriptionsWithClients } from '@/actions/subscriptions'
import { SubscriptionsTable } from './subscriptions-table'

const SubscriptionsComponent = async () => {
	const data = await fetchSubscriptionsWithClients()

	return (
		<div className="min-h-[calc(100vh-80px)] bg-primary">
			<div className="flex flex-row items-center justify-between gap-16 mb-8">
				<h1 className="text-white font-jose text-2xl">Subscriptions</h1>
				<Link href={'/admin/subscriptions/new'}>
					<button className="bg-primary-light hover:bg-primary-light/90 text-white font-jose text-base w-40 py-2 shadow-md hover:scale-[1.02] hover:shadow-xl">
						Create New
					</button>
				</Link>
			</div>
			<SubscriptionsTable data={data} />
		</div>
	)
}

export default SubscriptionsComponent
