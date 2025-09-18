'use client'

import React from 'react'
import { AutoRenewToggle } from './subscriptions/auto-renew-toggle'
import Link from 'next/link'

export interface SubscriptionRow {
	id: string
	period_start: string
	period_end: string
	auto_renew: boolean
	status: string
	invoice_sent_at: string | null
	renewal_processed_at: string | null
}

interface Props {
	subscription?: SubscriptionRow | null
	accountCreatedAt: string
	className?: string
}

// Utility (minimal) – could be moved to a shared utils if pattern repeats
const formatDate = (d: string | null | undefined) => {
	if (!d) return '-'
	const date = new Date(d)
	if (isNaN(date.getTime())) return '-'
	return date.toLocaleDateString()
}

export function SubscriptionCard({
	subscription,
	accountCreatedAt,
	className = '',
}: Props) {
	return (
		<div
			className={`bg-white/70 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-sm ${className}`}
		>
			<h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4">
				Subscription
			</h2>
			{subscription ? (
				<dl className="space-y-3 text-sm md:text-base">
					<div className="flex justify-between">
						<dt className="text-primary/70">Account created</dt>
						<dd>{formatDate(accountCreatedAt)}</dd>
					</div>
					<div className="flex justify-between">
						<dt className="text-primary/70">Period start</dt>
						<dd>{formatDate(subscription.period_start)}</dd>
					</div>
					<div className="flex justify-between">
						<dt className="text-primary/70">Period end</dt>
						<dd>{formatDate(subscription.period_end)}</dd>
					</div>
					<div className="flex justify-between items-center">
						<dt className="text-primary/70">Auto renew</dt>
						<dd>
							<AutoRenewToggle
								subscriptionId={subscription.id}
								initial={subscription.auto_renew}
							/>
						</dd>
					</div>
					<div className="flex justify-between">
						<dt className="text-primary/70">Status</dt>
						<dd className="capitalize">{subscription.status}</dd>
					</div>
				</dl>
			) : (
				<div className="text-sm md:text-base text-primary/70 space-y-4">
					<p>No active subscription found.</p>
					<ul className="list-disc pl-5 space-y-1">
						<li>
							Your account was created on{' '}
							<strong>{formatDate(accountCreatedAt)}</strong>.
						</li>
						<li>
							To activate a yearly subscription, please complete
							your payment offline.
						</li>
						<li>
							Once recorded, your subscription period and renewal
							options will appear here.
						</li>
					</ul>
					<div className="pt-2 border-t border-primary/10 text-xs md:text-sm text-primary/60">
						Need help?{' '}
						<Link
							href="https://www.consultingontap.com/contact"
							className="underline"
						>
							Contact support.
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

export default SubscriptionCard
