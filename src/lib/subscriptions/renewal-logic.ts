import { createClient } from '@/supabase/server'
import {
	sendAutoRenewInvoiceEmail,
	sendFreezeEmail,
	sendReminderEmail,
} from '../../actions/subscription-emails'
import { subDays, isSameDay, parseISO, addDays } from 'date-fns'

// Status values used:
// active | expired | frozen

const REMINDER_OFFSETS = [30, 7, 1]

interface SubscriptionRow {
	id: string
	client_id: string | null
	period_start: string
	period_end: string
	auto_renew: boolean
	status: string
	invoice_sent_at: string | null
	renewal_processed_at: string | null
}

export async function processDueRenewals() {
	const supabase = await createClient()
	const today = new Date()
	const { data, error } = await supabase
		.from('subscriptions')
		.select('*')
		.in('status', ['active'])

	if (error) throw error
	if (!data) return { renewals: [], freezes: [], reminders: [] }

	const renewals: string[] = []
	const freezes: string[] = []
	const reminders: string[] = []

	for (const sub of data as SubscriptionRow[]) {
		if (!sub.client_id) continue
		const end = parseISO(sub.period_end)

		// Reminders for non auto-renew
		if (!sub.auto_renew) {
			for (const offset of REMINDER_OFFSETS) {
				if (isSameDay(subDays(end, offset), today)) {
					await sendReminderEmail(sub.client_id, offset)
					reminders.push(`${sub.id}:${offset}`)
				}
			}
		}

		// Auto renew now transitions to pending for a 14-day payment window
		if (sub.auto_renew && isSameDay(end, today)) {
			await supabase
				.from('subscriptions')
				.update({
					status: 'expired',
					renewal_processed_at: new Date().toISOString(),
				})
				.eq('id', sub.id)

			// Put account into pending state and clear current_subscription
			await supabase
				.from('clients')
				.update({
					current_subscription: null,
					account_status: 'pending',
					pending_since: new Date().toISOString(),
				})
				.eq('id', sub.client_id)

			// Notify client to pay (invoice/renewal email) and mark invoice_sent_at if not already set
			if (!sub.invoice_sent_at) {
				await sendAutoRenewInvoiceEmail(sub.client_id, sub.id)
				await supabase
					.from('subscriptions')
					.update({ invoice_sent_at: new Date().toISOString() })
					.eq('id', sub.id)
			}
			renewals.push(sub.id)
			continue
		}

		// Freeze if expired and not auto-renew
		if (!sub.auto_renew && end < today) {
			await supabase
				.from('subscriptions')
				.update({ status: 'frozen' })
				.eq('id', sub.id)

			await supabase
				.from('clients')
				.update({ account_status: 'frozen' })
				.eq('id', sub.client_id)

			await sendFreezeEmail(sub.client_id)
			freezes.push(sub.id)
		}
	}

	return { renewals, freezes, reminders }
}

// Separate pass to freeze long-pending accounts (no active subscription after 14 days)
export async function processPendingFreezes() {
	const supabase = await createClient()
	const today = new Date()

	// Find clients in pending with no current subscription and pending_since older than 14 days

	// Fetch pending clients (id, created_at)
	const { data: clients, error } = await supabase
		.from('clients')
		.select(
			'id, created_at, pending_since, account_status, current_subscription'
		)
		.eq('account_status', 'pending')
		.is('current_subscription', null)
	if (error) throw error
	if (!clients || clients.length === 0)
		return { frozen: [], pendingReminders: [] }

	const frozen: string[] = []
	const pendingReminders: string[] = []
	for (const c of clients as {
		id: string
		created_at: string
		pending_since?: string | null
	}[]) {
		const basis = c.pending_since
			? parseISO(c.pending_since)
			: parseISO(c.created_at)
		const day7 = addDays(basis, 7)
		const day12 = addDays(basis, 12)
		const deadline = addDays(basis, 14)

		// pending window reminders on exact day 7 and 12
		if (isSameDay(today, day7)) {
			await sendReminderEmail(c.id, 7)
			pendingReminders.push(`${c.id}:7`)
		}
		if (isSameDay(today, day12)) {
			await sendReminderEmail(c.id, 2)
			pendingReminders.push(`${c.id}:2`)
		}
		if (today > deadline) {
			await supabase
				.from('clients')
				.update({ account_status: 'frozen', pending_since: null })
				.eq('id', c.id)
			await sendFreezeEmail(c.id)
			frozen.push(c.id)
		}
	}

	return { frozen, pendingReminders }
}

// Helpers removed (not used in pending-based flow)
