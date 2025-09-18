'use server'

import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setAutoRenew({
	subscriptionId,
	autoRenew,
}: {
	subscriptionId: string
	autoRenew: boolean
}) {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('subscriptions')
		.update({ auto_renew: autoRenew })
		.eq('id', subscriptionId)
		.select('id, auto_renew')
		.maybeSingle()

	if (error) throw error
	if (!data) {
		throw new Error('Subscription not found or not updated')
	}
	revalidatePath('/account')
	revalidatePath('/admin/subscriptions')
	return { ok: true, auto_renew: data.auto_renew }
}

// Helper to create initial subscription (e.g. after manual payment recorded)
export async function createInitialSubscription({
	clientId,
	startDate,
}: {
	clientId: string
	startDate: Date
}) {
	const supabase = await createClient()
	const periodStart = startDate
	const periodEnd = new Date(periodStart)
	periodEnd.setFullYear(periodEnd.getFullYear() + 1)
	periodEnd.setDate(periodEnd.getDate() - 1)

	const { data, error } = await supabase
		.from('subscriptions')
		.insert({
			client_id: clientId,
			period_start: periodStart.toISOString().slice(0, 10),
			period_end: periodEnd.toISOString().slice(0, 10),
			auto_renew: false,
			status: 'active',
		})
		.select()
		.single()

	if (error) throw error

	await supabase
		.from('clients')
		.update({ current_subscription: data.id, account_status: 'active' })
		.eq('id', clientId)

	return data
}
export interface AdminSubscriptionRow {
	id: string
	client_id: string | null
	period_start: string
	period_end: string
	auto_renew: boolean
	status: string
	created_at: string | null
}

export async function fetchSubscriptions(): Promise<AdminSubscriptionRow[]> {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('subscriptions')
		.select(
			'id, client_id, period_start, period_end, auto_renew, status, created_at'
		)
		.order('created_at', { ascending: false })
	if (error) throw error
	return data as AdminSubscriptionRow[]
}

// Combined fetch with client email (and names) to avoid client-side joins in components
export interface AdminSubscriptionWithClient extends AdminSubscriptionRow {
	client_email: string | null
	client_name: string | null
	client_family_name: string | null
}

export async function fetchSubscriptionsWithClients(): Promise<
	AdminSubscriptionWithClient[]
> {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('subscriptions')
		.select(
			'id, client_id, period_start, period_end, auto_renew, status, created_at, clients:client_id ( email, name, family_name )'
		)
		.order('created_at', { ascending: false })
	if (error) throw error
	interface RawRow extends AdminSubscriptionRow {
		clients?: {
			email: string | null
			name: string | null
			family_name: string | null
		}
	}
	return (data as RawRow[]).map((row) => ({
		id: row.id,
		client_id: row.client_id,
		period_start: row.period_start,
		period_end: row.period_end,
		auto_renew: row.auto_renew,
		status: row.status,
		created_at: row.created_at,
		client_email: row.clients?.email ?? null,
		client_name: row.clients?.name ?? null,
		client_family_name: row.clients?.family_name ?? null,
	}))
}

// Get single subscription with client email
export async function getSubscriptionById(id: string) {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('subscriptions')
		.select(
			'id, client_id, period_start, period_end, auto_renew, status, created_at'
		)
		.eq('id', id)
		.single()

	if (error) throw error

	let clientEmail: string | null = null
	if (data.client_id) {
		const { data: clientData } = await supabase
			.from('clients')
			.select('email')
			.eq('id', data.client_id)
			.single()
		clientEmail = clientData?.email ?? null
	}

	return { ...data, client_email: clientEmail }
}

export async function getSubscriptionWithClient(id: string) {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('subscriptions')
		.select(
			'id, client_id, period_start, period_end, auto_renew, status, created_at, clients:client_id ( email, name, family_name )'
		)
		.eq('id', id)
		.single()
	if (error) throw error
	interface JoinedRow extends AdminSubscriptionRow {
		clients?: {
			email: string | null
			name: string | null
			family_name: string | null
		}
	}
	const row = data as JoinedRow
	return {
		...row,
		client_email: row.clients?.email ?? null,
		client_name: row.clients?.name ?? null,
		client_family_name: row.clients?.family_name ?? null,
	}
}

// Create subscription (admin manual)
export async function createSubscription(params: {
	clientId: string
	periodStart: string // yyyy-mm-dd
	periodEnd: string // yyyy-mm-dd
	autoRenew?: boolean
	status?: string
}) {
	const {
		clientId,
		periodStart,
		periodEnd,
		autoRenew = false,
		status = 'active',
	} = params
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('subscriptions')
		.insert({
			client_id: clientId,
			period_start: periodStart,
			period_end: periodEnd,
			auto_renew: autoRenew,
			status,
		})
		.select()
		.single()

	if (error) throw error

	// Optionally set as current if active and within period
	const today = new Date().toISOString().slice(0, 10)
	if (status === 'active' && today >= periodStart && today <= periodEnd) {
		await supabase
			.from('clients')
			.update({ current_subscription: data.id, account_status: 'active' })
			.eq('id', clientId)
	}

	revalidatePath('/admin/subscriptions')
	return data
}

// Update subscription
export async function updateSubscription(
	id: string,
	updates: Partial<{
		period_start: string
		period_end: string
		auto_renew: boolean
		status: string
	}>
) {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('subscriptions')
		.update(updates)
		.eq('id', id)
		.select()
		.single()
	if (error) throw error

	revalidatePath('/admin/subscriptions')
	revalidatePath(`/admin/subscriptions/${id}`)
	return data
}
