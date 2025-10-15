import Link from 'next/link'
import { priceSingle } from '@/lib/selection-changes'
import type { ClientSelectionType, ClientDataJsonType } from '@/lib/types'
import { Button } from '@/components/ui/button'

type DiffEntry = {
	category: keyof ClientSelectionType
	item: ClientDataJsonType
}

export type SelectionChangeDetailProps = {
	change: {
		id: string
		client_id: string
		status: 'pending' | 'committed' | 'rolled_back'
		price_cents: number
		pending_since: string
		due_at: string
		diff_added: unknown
		diff_removed: unknown
		client?: { email: string | null; org_name: string | null } | null
	}
	periodStart: string | null
	periodEnd: string | null
	onMarkPaid?: (formData: FormData) => Promise<void>
	onCommit?: (formData: FormData) => Promise<void>
	onRollback?: (formData: FormData) => Promise<void>
}

export default function SelectionChangeDetail({
	change,
	periodStart,
	periodEnd,
	onMarkPaid,
	onCommit,
	onRollback,
}: SelectionChangeDetailProps) {
	const added = (change.diff_added || []) as unknown as DiffEntry[]
	const removed = (change.diff_removed || []) as unknown as DiffEntry[]

	const baseAdditionsEuros = added.reduce(
		(sum, x) => sum + priceSingle(x.category, x.item),
		0
	)
	const totalEuros = (change.price_cents || 0) / 100

	// Compute proration from subscription period if provided
	let prorationFactor = 1
	if (periodStart && periodEnd) {
		const today = new Date()
		const start = new Date(periodStart)
		const end = new Date(periodEnd)
		if (today >= start && today <= end) {
			const msPerDay = 24 * 60 * 60 * 1000
			const totalDays =
				Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1
			const remainingDays =
				Math.floor(
					(end.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) /
						msPerDay
				) + 1
			if (totalDays > 0) {
				prorationFactor = Math.min(
					1,
					Math.max(0, remainingDays / totalDays)
				)
			}
		}
	} else if (baseAdditionsEuros > 0) {
		// Fallback: infer from stored total
		prorationFactor = Math.min(
			1,
			Math.max(0, totalEuros / baseAdditionsEuros)
		)
	}

	const formatEur = (n: number) => `€${n.toFixed(2)}`

	return (
		<div className="p-6 space-y-6 text-white">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Selection Change</h1>
				<Link
					className="text-blue-600 underline"
					href="/admin/selection-changes"
				>
					Back to list
				</Link>
			</div>

			<section className="space-y-2">
				<div className="text-sm text-muted-foreground">Client</div>
				<div className="text-base">
					{change.client?.org_name || '—'}
					<div className="text-xs text-muted-foreground">
						{change.client?.email}
					</div>
				</div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="rounded border p-4 space-y-2">
					<div className="text-sm text-muted-foreground">Status</div>
					<div className="capitalize">
						{String(change.status).replace('_', ' ')}
					</div>
				</div>
				<div className="rounded border p-4 space-y-2">
					<div className="text-sm text-muted-foreground">
						Timeline
					</div>
					<div className="text-sm">
						Pending since:{' '}
						{new Date(change.pending_since).toLocaleDateString()}
					</div>
					<div className="text-sm">
						Due at: {new Date(change.due_at).toLocaleDateString()}
					</div>
				</div>
				<div className="rounded border p-4 space-y-2">
					<div className="text-sm text-muted-foreground">
						Subscription period
					</div>
					<div className="text-sm">
						{periodStart && periodEnd
							? `${new Date(periodStart).toLocaleDateString()} → ${new Date(periodEnd).toLocaleDateString()}`
							: '—'}
					</div>
				</div>
			</section>

			<section className="rounded border p-4 space-y-3">
				<h2 className="text-lg font-medium">Price breakdown</h2>
				<div className="flex flex-col gap-1">
					<div className="flex justify-between text-sm">
						<span>Base price (additions only)</span>
						<span>{formatEur(baseAdditionsEuros)}</span>
					</div>
					<div className="flex justify-between text-sm">
						<span>Proration</span>
						<span>{(prorationFactor * 100).toFixed(0)}%</span>
					</div>
					<div className="flex justify-between font-semibold">
						<span>Total</span>
						<span>{formatEur(totalEuros)}</span>
					</div>
				</div>

				{added.length > 0 && (
					<div className="mt-4">
						<h3 className="font-medium mb-2">Added items</h3>
						<ul className="space-y-2">
							{added.map((a, idx) => {
								const base = priceSingle(a.category, a.item)
								const prorated = base * prorationFactor
								return (
									<li
										key={`add-${idx}`}
										className="text-sm flex justify-between"
									>
										<div>
											<span className="font-medium">
												{a.category}
											</span>
											: {a.item.value}
											{a.item.geographies?.length ? (
												<span className="text-muted-foreground">
													{' '}
													—{' '}
													{a.item.geographies
														.map(
															(g) =>
																g.label ||
																g.value
														)
														.join(', ')}
												</span>
											) : null}
										</div>
										<div className="flex gap-3">
											<span className="text-muted-foreground line-through">
												{formatEur(base)}
											</span>
											<span className="font-medium">
												{formatEur(prorated)}
											</span>
										</div>
									</li>
								)
							})}
						</ul>
					</div>
				)}
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="rounded border p-4">
					<h3 className="font-medium mb-2">Removed</h3>
					{removed.length === 0 ? (
						<div className="text-sm text-muted-foreground">
							No removals
						</div>
					) : (
						<ul className="space-y-2">
							{removed.map((r, idx) => (
								<li
									key={`rem-${idx}`}
									className="text-sm"
								>
									<span className="font-medium">
										{r.category}
									</span>
									: {r.item.value}
									{r.item.geographies?.length ? (
										<span className="text-muted-foreground">
											{' '}
											—{' '}
											{r.item.geographies
												.map((g) => g.label || g.value)
												.join(', ')}
										</span>
									) : null}
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="rounded border p-4">
					<h3 className="font-medium mb-2">Actions</h3>
					{change.status === 'pending' ? (
						<div className="flex flex-wrap gap-2">
							{onMarkPaid && (
								<form action={onMarkPaid}>
									<input
										type="hidden"
										name="id"
										value={change.id}
									/>
									<Button
										variant="outline"
										size="sm"
									>
										Mark paid
									</Button>
								</form>
							)}
							{onCommit && (
								<form action={onCommit}>
									<input
										type="hidden"
										name="id"
										value={change.id}
									/>
									<Button
										variant="default"
										size="sm"
									>
										Commit
									</Button>
								</form>
							)}
							{onRollback && (
								<form action={onRollback}>
									<input
										type="hidden"
										name="id"
										value={change.id}
									/>
									<Button
										variant="destructive"
										size="sm"
									>
										Rollback
									</Button>
								</form>
							)}
						</div>
					) : (
						<div className="text-sm text-muted-foreground">
							No actions
						</div>
					)}
				</div>
			</section>
		</div>
	)
}
