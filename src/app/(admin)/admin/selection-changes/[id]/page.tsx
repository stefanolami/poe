import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import SelectionChangeDetail from '@/components/admin/selection-changes/selection-change-detail'
import {
	markSelectionChangePaid,
	commitSelectionChange,
	rollbackSelectionChange,
} from '@/actions/selection-changes'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const supabase = await createClient()
	const { id } = await params
	const changeId = id

	const { data: change } = await supabase
		.from('selection_changes')
		.select(
			'id, client_id, status, price_cents, pending_since, due_at, diff_added, diff_removed, clients:client_id ( email, org_name, current_subscription )'
		)
		.eq('id', changeId)
		.single()

	// Fetch subscription period if available
	let periodStart: string | null = null
	let periodEnd: string | null = null
	if (change?.clients?.current_subscription) {
		const { data: sub } = await supabase
			.from('subscriptions')
			.select('period_start, period_end')
			.eq('id', change.clients.current_subscription)
			.single()
		periodStart = sub?.period_start ?? null
		periodEnd = sub?.period_end ?? null
	}

	async function actionMarkPaid(formData: FormData) {
		'use server'
		const id = String(formData.get('id') || '')
		if (!id) return
		await markSelectionChangePaid(id)
		revalidatePath(`/admin/selection-changes/${id}`)
		revalidatePath('/admin/selection-changes')
	}

	async function actionCommit(formData: FormData) {
		'use server'
		const id = String(formData.get('id') || '')
		if (!id) return
		await commitSelectionChange(id)
		revalidatePath(`/admin/selection-changes/${id}`)
		revalidatePath('/admin/selection-changes')
	}

	async function actionRollback(formData: FormData) {
		'use server'
		const id = String(formData.get('id') || '')
		if (!id) return
		await rollbackSelectionChange(id)
		revalidatePath(`/admin/selection-changes/${id}`)
		revalidatePath('/admin/selection-changes')
	}

	if (!change) return null

	return (
		<SelectionChangeDetail
			change={{
				id: change.id,
				client_id: change.client_id,
				status: change.status as
					| 'pending'
					| 'committed'
					| 'rolled_back',
				price_cents: change.price_cents,
				pending_since: change.pending_since,
				due_at: change.due_at,
				diff_added: change.diff_added,
				diff_removed: change.diff_removed,
				client: {
					email: change.clients?.email ?? null,
					org_name: change.clients?.org_name ?? null,
				},
			}}
			periodStart={periodStart}
			periodEnd={periodEnd}
			onMarkPaid={actionMarkPaid}
			onCommit={actionCommit}
			onRollback={actionRollback}
		/>
	)
}
