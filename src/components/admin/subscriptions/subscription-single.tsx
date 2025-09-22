import { getSubscriptionWithClient } from '@/actions/subscriptions'
import Link from 'next/link'

interface SubscriptionSingleProps {
	id: string
}

export const SubscriptionSingle = async ({ id }: SubscriptionSingleProps) => {
	const subscription = await getSubscriptionWithClient(id)
	const client = subscription.client_id
		? {
				id: subscription.client_id,
				first_name: subscription.client_first_name,
				last_name: subscription.client_last_name,
				email: subscription.client_email,
			}
		: null

	return (
		<div className="font-jose mb-20">
			<div className="flex flex-row items-center justify-between w-full mb-10">
				<h1 className="text-white font-jose text-2xl">Subscription</h1>
				<Link href={`/admin/subscriptions/${id}/edit`}>
					<button className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-primary-light hover:bg-primary-light/90 text-white w-40 py-2">
						Edit
					</button>
				</Link>
			</div>
			<div className="text-white font-jose text-sm grid grid-cols-2 gap-4 mt-4 space-y-2 max-w-[800px]">
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Client</span>
					<span className="block text-base">
						{client ? (
							<Link
								className="underline hover:text-primary-light"
								href={`/admin/clients/${client.id}`}
							>
								{[client.first_name, client.last_name]
									.filter(Boolean)
									.join(' ') ||
									client.email ||
									client.id}
							</Link>
						) : (
							'—'
						)}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Client Email</span>
					<span className="block text-base">
						{client?.email ?? subscription.client_email ?? '—'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Period Start</span>
					<span className="block text-base">
						{subscription.period_start}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Period End</span>
					<span className="block text-base">
						{subscription.period_end}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Status</span>
					<span className="block text-base capitalize">
						{subscription.status}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Auto Renew</span>
					<span
						className={`block text-base ${subscription.auto_renew ? 'text-green-400' : 'text-red-400'}`}
					>
						{subscription.auto_renew ? 'Enabled' : 'Disabled'}
					</span>
				</div>
				<div className="flex flex-col gap-2 col-span-2">
					<span className="block text-xl">Created</span>
					<span className="block text-base">
						{subscription.created_at
							? new Date(subscription.created_at).toLocaleString()
							: '—'}
					</span>
				</div>
			</div>
		</div>
	)
}

export default SubscriptionSingle
