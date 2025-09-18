import { createClient } from '@/supabase/server'
import {
	sendAutoRenewInvoiceEmail,
	sendFreezeEmail,
	sendReminderEmail,
} from './subscription-mails'
import { addYears, subDays, isSameDay, parseISO } from 'date-fns'

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

		// Auto renew
		if (sub.auto_renew && isSameDay(end, today)) {
			const nextStart = new Date(end)
			nextStart.setDate(nextStart.getDate() + 1)
			const nextEnd = computeNextEnd(nextStart)

			const { data: inserted, error: insErr } = await supabase
				.from('subscriptions')
				.insert({
					client_id: sub.client_id,
					period_start: formatDate(nextStart),
					period_end: formatDate(nextEnd),
					auto_renew: true,
					status: 'active',
				})
				.select()
				.single()
			if (insErr) throw insErr

			await supabase
				.from('subscriptions')
				.update({
					status: 'expired',
					renewal_processed_at: new Date().toISOString(),
				})
				.eq('id', sub.id)

			await supabase
				.from('clients')
				.update({
					current_subscription: inserted.id,
					account_status: 'active',
				})
				.eq('id', sub.client_id)

			await sendAutoRenewInvoiceEmail(sub.client_id, inserted.id)
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

function computeNextEnd(start: Date) {
	const end = addYears(start, 1)
	end.setDate(end.getDate() - 1)
	return end
}

function formatDate(d: Date) {
	return d.toISOString().slice(0, 10)
}
