'use server'

import { Json } from '@/supabase/types'
import { createClient } from '@/supabase/server'
import { fetchAttachments } from '@/lib/attachments'
import {
	buildGrantEmailSubject,
	buildTenderEmailSubject,
	buildInvestmentEmailSubject,
} from '@/lib/utils'
import { createAlert } from './alerts'
import {
	sendGrant,
	sendGrantCharin,
	sendTender,
	sendTenderCharin,
	sendTenderTailored,
	sendTenderTailoredCharin,
	sendInvestment,
	sendInvestmentCharin,
	sendInvestmentTailored,
	sendInvestmentTailoredCharin,
} from './email'
import type { ClientType, GrantType, TenderType } from '@/lib/types'
import type { RawTender } from '@/lib/opportunity-types'

type EntityType = 'grant' | 'tender' | 'investment'

export async function sendCustomAlert(
	entityType: EntityType,
	entityId: string,
	clientId: string
) {
	const supabase = await createClient()

	// Fetch client with lean projection
	const { data: client, error: clientError } = await supabase
		.from('clients')
		.select(
			`id,email,referrer,org_name,additional_emails,vehicles_type,charging_stations_type,deployment,project,pif`
		)
		.eq('id', clientId)
		.single()
	if (clientError || !client)
		throw new Error(clientError?.message || 'Client not found')

	// Branch by entity type
	if (entityType === 'grant') {
		const { data: grant, error } = await supabase
			.from('grants')
			.select('*')
			.eq('id', entityId)
			.single()
		if (error || !grant)
			throw new Error(error?.message || 'Grant not found')

		const attachments = await fetchAttachments(
			(grant.files as string[] | null) ?? null,
			'/grants/',
			'grants/'
		)

		const assessment =
			(Array.isArray(grant.tailored_assessment)
				? (grant.tailored_assessment as {
						client: string
						relevance: string
						next_steps: string
					}[])
				: []
			).find((a) => a && a.client === client.email) || null

		const clientShape: Partial<ClientType> = {
			email: client.email,
			vehicles_type: client.vehicles_type as Json | null,
			charging_stations_type:
				client.charging_stations_type as Json | null,
			pif: client.pif as Json | null,
			deployment: client.deployment as Json | null,
			project: client.project as Json | null,
		}
		const subject = buildGrantEmailSubject(
			grant as Pick<
				GrantType,
				'geography' | 'call_title' | 'programme_title'
			>,
			clientShape
		)
		const cc = (
			Array.isArray(client.additional_emails)
				? client.additional_emails
				: []
		).filter(Boolean)

		if (client.referrer === 'charin') {
			await sendGrantCharin(
				client.email,
				subject,
				grant,
				attachments,
				cc,
				client,
				assessment
			)
		} else {
			await sendGrant(
				client.email,
				subject,
				grant,
				attachments,
				cc,
				client,
				assessment
			)
		}

		await createAlert({
			subject: grant.call_title || grant.programme_title || 'Grant',
			entity_type: 'grant',
			entity_id: entityId,
			matched_clients: [clientId],
		})

		return { success: true }
	}

	if (entityType === 'tender') {
		const { data: tender, error } = await supabase
			.from('tenders')
			.select('*')
			.eq('id', entityId)
			.single()
		if (error || !tender)
			throw new Error(error?.message || 'Tender not found')

		const attachments = await fetchAttachments(
			(tender.files as string[] | null) ?? null,
			'/tenders/',
			'tenders/'
		)

		const assessment =
			(Array.isArray(tender.tailored_assessment)
				? (tender.tailored_assessment as {
						client: string
						relevance: string
						next_steps: string
					}[])
				: []
			).find((a) => a && a.client === client.email) || null

		const clientShape: Partial<ClientType> = {
			email: client.email,
			vehicles_type: client.vehicles_type as Json | null,
			charging_stations_type:
				client.charging_stations_type as Json | null,
			pif: client.pif as Json | null,
			deployment: client.deployment as Json | null,
			project: client.project as Json | null,
		}
		const subject = buildTenderEmailSubject(
			tender as Pick<TenderType, 'geography' | 'call_title'>,
			clientShape
		)
		const cc = (
			Array.isArray(client.additional_emails)
				? client.additional_emails
				: []
		).filter(Boolean)

		// Coerce to RawTender-friendly shape as senders do
		const rawTender: RawTender = {
			...tender,
			alert_purpose: tender.alert_purpose ?? null,
			deadline: Array.isArray(tender.deadline)
				? (tender.deadline as unknown[])
				: tender.deadline,
		}

		if (assessment) {
			if (client.referrer === 'charin') {
				await sendTenderTailoredCharin(
					client.email,
					subject,
					rawTender,
					assessment,
					attachments,
					cc,
					client
				)
			} else {
				await sendTenderTailored(
					client.email,
					subject,
					rawTender,
					assessment,
					attachments,
					cc,
					client
				)
			}
		} else {
			if (client.referrer === 'charin') {
				await sendTenderCharin(
					client.email,
					subject,
					rawTender,
					attachments,
					cc,
					client
				)
			} else {
				await sendTender(
					client.email,
					subject,
					rawTender,
					attachments,
					cc,
					client
				)
			}
		}

		await createAlert({
			subject: tender.programme_title || tender.call_title || 'Tender',
			entity_type: 'tender',
			entity_id: entityId,
			matched_clients: [clientId],
		})

		return { success: true }
	}

	// investment
	const { data: investment, error } = await supabase
		.from('investments')
		.select('*')
		.eq('id', entityId)
		.single()
	if (error || !investment)
		throw new Error(error?.message || 'Investment not found')

	const attachments = await fetchAttachments(
		(investment.files as string[] | null) ?? null,
		'/grants/',
		'grants/'
	)

	const assessment =
		(Array.isArray(investment.tailored_assessment)
			? (investment.tailored_assessment as {
					client: string
					relevance: string
					next_steps: string
				}[])
			: []
		).find((a) => a && a.client === client.email) || null

	const clientShape: Partial<ClientType> = {
		email: client.email,
		vehicles_type: client.vehicles_type as Json | null,
		charging_stations_type: client.charging_stations_type as Json | null,
		pif: client.pif as Json | null,
		deployment: client.deployment as Json | null,
		project: client.project as Json | null,
	}
	const subject = buildInvestmentEmailSubject(
		{
			geography: investment.geography,
			call_title: investment.call_title,
		} as Pick<TenderType, 'geography' | 'call_title'>,
		clientShape
	)
	const cc = (
		Array.isArray(client.additional_emails) ? client.additional_emails : []
	).filter(Boolean)

	const loose = investment as unknown as { geography: string[] }
	if (assessment) {
		if (client.referrer === 'charin') {
			await sendInvestmentTailoredCharin(
				client.email,
				subject,
				loose,
				assessment,
				attachments,
				cc,
				client
			)
		} else {
			await sendInvestmentTailored(
				client.email,
				subject,
				loose,
				assessment,
				attachments,
				cc,
				client
			)
		}
	} else {
		if (client.referrer === 'charin') {
			await sendInvestmentCharin(
				client.email,
				subject,
				loose,
				attachments,
				cc,
				client
			)
		} else {
			await sendInvestment(
				client.email,
				subject,
				loose,
				attachments,
				cc,
				client
			)
		}
	}

	await createAlert({
		subject:
			investment.call_title || investment.programme_title || 'Investment',
		entity_type: 'investment',
		entity_id: entityId,
		matched_clients: [clientId],
	})

	return { success: true }
}

// Form server action to be used directly in a client component form
export async function sendCustomAlertAction(formData: FormData) {
	'use server'
	const entityType = (formData.get('entityType') as EntityType) || 'grant'
	const entityId = String(formData.get('entityId') || '')
	const clientId = String(formData.get('clientId') || '')
	if (!entityId || !clientId) throw new Error('Missing entity or client')
	return sendCustomAlert(entityType, entityId, clientId)
}
