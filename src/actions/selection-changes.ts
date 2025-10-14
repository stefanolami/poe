'use server'

import { createClient } from '@/supabase/server'
import type { Database } from '@/supabase/types'
import {
	clientRowToSelection,
	diffSelections,
	priceSingle,
	selectionToClientUpdates,
} from '@/lib/selection-changes'
import type { ClientSelectionType, ClientDataJsonType } from '@/lib/types'

type Tables = Database['public']['Tables']

export async function requestSelectionChange(
	clientId: string,
	toSelection: ClientSelectionType
) {
	const supabase = await createClient()
	// Load client current selection
	const { data: client, error: clientErr } = await supabase
		.from('clients')
		.select(
			'id, current_subscription, vehicles_type, vehicles_contract, charging_stations_type, charging_stations_contract, pif, deployment, project'
		)
		.eq('id', clientId)
		.single()
	if (clientErr || !client) throw clientErr || new Error('Client not found')

	const fromSelection = clientRowToSelection({
		vehicles_type: client.vehicles_type as unknown as
			| ClientDataJsonType[]
			| null,
		vehicles_contract: client.vehicles_contract as string[] | null,
		charging_stations_type: client.charging_stations_type as unknown as
			| ClientDataJsonType[]
			| null,
		charging_stations_contract: client.charging_stations_contract as
			| string[]
			| null,
		pif: client.pif as unknown as ClientDataJsonType[] | null,
		deployment: client.deployment as unknown as ClientDataJsonType[] | null,
		project: client.project as unknown as ClientDataJsonType[] | null,
	})
	const { added, removed } = diffSelections(fromSelection, toSelection)
	// Price only the additions, not removals, using selectionData pricing
	const baseAdditionsEuros = added.reduce(
		(sum, x) => sum + priceSingle(x.category, x.item),
		0
	)

	// Pro-rate by remaining time in the current subscription period if present and active
	let prorationFactor = 1
	try {
		// Fetch current subscription dates if available
		if (client.current_subscription) {
			const { data: sub } = await supabase
				.from('subscriptions')
				.select('period_start, period_end, status')
				.eq('id', client.current_subscription)
				.single()
			if (sub && sub.period_start && sub.period_end) {
				const today = new Date()
				const start = new Date(sub.period_start)
				const end = new Date(sub.period_end)
				// If today is outside the period, charge full price (factor=1)
				if (today >= start && today <= end) {
					// Compute inclusive day counts
					const msPerDay = 24 * 60 * 60 * 1000
					const totalDays =
						Math.floor(
							(end.getTime() - start.getTime()) / msPerDay
						) + 1
					const remainingDays =
						Math.floor(
							(end.getTime() - today.setHours(0, 0, 0, 0)) /
								msPerDay
						) + 1
					if (totalDays > 0) {
						prorationFactor = Math.min(
							1,
							Math.max(0, remainingDays / totalDays)
						)
					}
				}
			}
		}
	} catch {
		// If anything goes wrong computing proration, fall back to full price
		prorationFactor = 1
	}

	// Convert to cents and apply proration
	const price_cents = Math.round(baseAdditionsEuros * 100 * prorationFactor)

	// Insert selection change pending (14d default due handled by DB default)
	const { data: change, error: insErr } = await supabase
		.from('selection_changes')
		.insert({
			client_id: clientId,
			from_selection:
				fromSelection as unknown as Tables['selection_changes']['Insert']['from_selection'],
			to_selection:
				toSelection as unknown as Tables['selection_changes']['Insert']['to_selection'],
			diff_added:
				added as unknown as Tables['selection_changes']['Insert']['diff_added'],
			diff_removed:
				removed as unknown as Tables['selection_changes']['Insert']['diff_removed'],
			price_cents,
			status: 'pending',
		})
		.select('*')
		.single()

	if (insErr) throw insErr
	// fire-and-forget pending email
	try {
		const { sendSelectionPendingEmail } = await import(
			'./selection-change-emails'
		)
		await sendSelectionPendingEmail(clientId, price_cents)
	} catch {}
	return change
}

export async function markSelectionChangePaid(changeId: string) {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('selection_changes')
		.update({ paid_at: new Date().toISOString() })
		.eq('id', changeId)
		.select('*')
		.single()
	if (error) throw error
	return data
}

export async function commitSelectionChange(changeId: string) {
	const supabase = await createClient()
	// Fetch change
	const { data: change, error: chErr } = await supabase
		.from('selection_changes')
		.select('*')
		.eq('id', changeId)
		.single()
	if (chErr || !change) throw chErr || new Error('Change not found')
	if (change.status !== 'pending') return change

	// Apply to client
	const toSel = change.to_selection as unknown as ClientSelectionType
	const clientUpdates = selectionToClientUpdates(toSel)
	const { error: updErr } = await supabase
		.from('clients')
		.update(clientUpdates)
		.eq('id', change.client_id)
	if (updErr) throw updErr

	// Mark committed
	const { data: committed, error: cmErr } = await supabase
		.from('selection_changes')
		.update({ status: 'committed', committed_at: new Date().toISOString() })
		.eq('id', changeId)
		.select('*')
		.single()
	if (cmErr) throw cmErr
	// fire-and-forget email
	try {
		const { sendSelectionCommittedEmail } = await import(
			'./selection-change-emails'
		)
		await sendSelectionCommittedEmail(change.client_id)
	} catch {}
	return committed
}

export async function rollbackSelectionChange(changeId: string) {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('selection_changes')
		.update({
			status: 'rolled_back',
			rolled_back_at: new Date().toISOString(),
		})
		.eq('id', changeId)
		.select('*')
		.single()
	if (error) throw error
	return data
}

export async function fetchPendingSelectionChanges() {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('selection_changes')
		.select('*')
		.eq('status', 'pending')
	if (error) throw error
	return data
}
