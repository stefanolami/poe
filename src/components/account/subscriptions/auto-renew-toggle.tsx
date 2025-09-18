'use client'

import { useTransition, useState } from 'react'
import { setAutoRenew } from '@/actions/subscriptions'

interface AutoRenewToggleProps {
	subscriptionId: string
	initial: boolean
}

export function AutoRenewToggle({
	subscriptionId,
	initial,
}: AutoRenewToggleProps) {
	const [pending, startTransition] = useTransition()
	const [checked, setChecked] = useState(initial)
	const [error, setError] = useState<string | null>(null)

	const onChange = (next: boolean) => {
		setError(null)
		const previous = checked
		setChecked(next)
		startTransition(async () => {
			try {
				const res = await setAutoRenew({
					subscriptionId,
					autoRenew: next,
				})
				if (!res?.ok) throw new Error('Update failed')
			} catch (e) {
				console.error('Failed to update auto-renew', e)
				setChecked(previous)
				setError('Could not update')
			}
		})
	}

	return (
		<div className="flex flex-col items-end gap-1">
			<label className="flex items-center gap-3 cursor-pointer select-none">
				<span className="text-sm text-primary font-medium">
					{checked ? 'Auto-renew enabled' : 'Enable auto-renew'}
				</span>
				<input
					type="checkbox"
					className="h-4 w-4 cursor-pointer rounded-sm border border-primary/70 bg-white checked:bg-primary checked:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 transition-colors"
					aria-label="Toggle auto renew"
					aria-checked={checked}
					checked={checked}
					disabled={pending}
					onChange={(e) => onChange(e.target.checked)}
				/>
			</label>
			{pending && (
				<span className="text-[10px] uppercase tracking-wide text-primary/60">
					Saving…
				</span>
			)}
			{error && !pending && (
				<span className="text-[10px] text-red-600">{error}</span>
			)}
		</div>
	)
}
