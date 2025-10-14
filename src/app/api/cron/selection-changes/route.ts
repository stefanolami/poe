import { NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { selectionToClientUpdates } from '@/lib/selection-changes'
import type { ClientSelectionType } from '@/lib/types'
import {
	sendSelectionPendingEmail,
	sendSelectionReminderEmail,
	sendSelectionRollbackEmail,
	sendSelectionCommittedEmail,
} from '@/actions/selection-change-emails'

export async function GET() {
	const supabase = await createClient()

	// fetch all pending changes
	const { data: pending, error } = await supabase
		.from('selection_changes')
		.select('*')
		.eq('status', 'pending')
	if (error) {
		return NextResponse.json(
			{ ok: false, error: error.message },
			{ status: 500 }
		)
	}

	const now = new Date()
	const results = {
		committed: [] as string[],
		rolledBack: [] as string[],
		reminders: [] as { id: string; client_id: string; days: number }[],
		pendingNotified: [] as string[],
	}

	// iterate changes
	for (const ch of pending || []) {
		const pendingSince = new Date(ch.pending_since)
		const dueAt = new Date(ch.due_at)
		const daysPending = Math.floor(
			(now.getTime() - pendingSince.getTime()) / (1000 * 60 * 60 * 24)
		)

		// Send initial pending email if created today (best-effort/no tracking)
		if (daysPending === 0) {
			await sendSelectionPendingEmail(ch.client_id, ch.price_cents)
			results.pendingNotified.push(ch.id)
		}

		// Reminders at day 7 and 12
		if (daysPending === 7) {
			await sendSelectionReminderEmail(ch.client_id, 7)
			results.reminders.push({
				id: ch.id,
				client_id: ch.client_id,
				days: 7,
			})
		}
		if (daysPending === 12) {
			await sendSelectionReminderEmail(ch.client_id, 2)
			results.reminders.push({
				id: ch.id,
				client_id: ch.client_id,
				days: 2,
			})
		}

		// If paid, commit immediately
		if (ch.paid_at) {
			// Apply to client and mark committed
			const updates = selectionToClientUpdates(
				ch.to_selection as unknown as ClientSelectionType
			)
			const { error: updErr } = await supabase
				.from('clients')
				.update(updates)
				.eq('id', ch.client_id)
			if (!updErr) {
				await supabase
					.from('selection_changes')
					.update({
						status: 'committed',
						committed_at: new Date().toISOString(),
					})
					.eq('id', ch.id)
				await sendSelectionCommittedEmail(ch.client_id)
				results.committed.push(ch.id)
				// Skip further processing (e.g., rollback) for this change
				continue
			}
		}

		// Rollback when due
		if (now >= dueAt) {
			await supabase
				.from('selection_changes')
				.update({
					status: 'rolled_back',
					rolled_back_at: new Date().toISOString(),
				})
				.eq('id', ch.id)
			await sendSelectionRollbackEmail(ch.client_id)
			results.rolledBack.push(ch.id)
		}
	}

	return NextResponse.json({ ok: true, ...results })
}
