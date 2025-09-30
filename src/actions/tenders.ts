'use server'

import {
	CreateAlertType,
	CreateTendersType,
	UpdateTenderType,
} from '@/lib/types'
import { Json } from '@/supabase/types'
import { createClient } from '@/supabase/server'
import { buildTenderEmailSubject } from '@/lib/utils'
import {
	sendTender,
	sendTenderCharIn,
	sendTenderTailored,
	sendTenderTailoredCharIn,
} from './email'
import { runWithConcurrency } from '@/lib/concurrency'
import { fetchAttachments } from '@/lib/attachments'
import { createAlert } from './alerts'
/* import {
	sendGrant,
	sendGrantCharIn,
	sendGrantTailored,
	sendGrantTailoredCharIn,
} from './email'
import { createAlert } from './alerts' */

export const createTender = async (formData: CreateTendersType) => {
	try {
		const supabase = await createClient()

		const flatDeadline = formData.deadline.map((element) =>
			element.join('///')
		)
		const flatFurtherDetails = formData.further_details?.map((element) =>
			element.join('///')
		)

		const { files } = formData

		let uploadedFilePaths: string[] = []

		if (files && files.length > 0) {
			const uploadPromises = files.map(async (file: File) => {
				const filePath = `/tenders/${file.name}`
				const { error } = await supabase.storage
					.from('documents')
					.upload(filePath, file, {
						cacheControl: '3600',
						upsert: false,
					})
				if (error)
					throw new Error(`File upload failed: ${error.message}`)
				return filePath
			})
			uploadedFilePaths = await Promise.all(uploadPromises)
		}

		const formattedData = {
			geography: formData.geography,
			call_title: formData.call_title ?? '',
			programme_title: formData.programme_title ?? '',
			alert_purpose: formData.alert_purpose,
			programme_purpose: formData.programme_purpose,
			instrument_type: formData.instrument_type,
			awarding_authority: formData.awarding_authority,
			reference_number: formData.reference_number,
			deadline: flatDeadline,
			further_details: flatFurtherDetails,
			in_brief: formData.in_brief,
			value: formData.value,
			geography_details: formData.geography_details ?? '',
			internal_deadline: formData.internal_deadline ?? null,
			intro: formData.intro ?? null,
			subject_matter: formData.subject_matter ?? null,
			pre_launch: formData.pre_launch ?? false,
			consultant:
				formData.consultant === 'clear' ? null : formData.consultant,
			sector: formData.sector,
			vehicles: formData.vehicles,
			vehicles_contracts: formData.vehicles_contracts,
			stations: formData.stations,
			stations_contracts: formData.stations_contracts,
			files: uploadedFilePaths,
		}

		const { data, error } = await supabase
			.from('tenders')
			.insert(formattedData)
			.select()

		if (error) {
			throw new Error(error.message)
		}

		return data
	} catch (error) {
		console.log('ERROR CREATING TENDER', error)
		throw error
	}
}

export const updateTender = async (id: string, formData: UpdateTenderType) => {
	try {
		const supabase = await createClient()

		const flatDeadline = formData.deadline.map((element) =>
			element.join('///')
		)
		const flatFurtherDetails = formData.further_details?.map((element) =>
			element.join('///')
		)

		const { files } = formData

		let uploadedFilePaths: string[] = []

		if (files && files.length > 0) {
			const uploadPromises = files.map(async (file: File) => {
				const filePath = `/tenders/${file.name}`
				const { error } = await supabase.storage
					.from('documents')
					.upload(filePath, file, {
						cacheControl: '3600',
						upsert: true,
					})
				if (error)
					throw new Error(`File upload failed: ${error.message}`)
				return filePath
			})
			uploadedFilePaths = await Promise.all(uploadPromises)
		}

		const filesArray =
			formData.oldFiles?.concat(uploadedFilePaths) || uploadedFilePaths

		const formattedData = {
			geography: formData.geography,
			call_title: formData.call_title ?? '',
			programme_title: formData.programme_title ?? '',
			alert_purpose: formData.alert_purpose,
			programme_purpose: formData.programme_purpose,
			instrument_type: formData.instrument_type,
			awarding_authority: formData.awarding_authority,
			reference_number: formData.reference_number,
			deadline: flatDeadline,
			further_details: flatFurtherDetails,
			in_brief: formData.in_brief,
			value: formData.value,
			geography_details: formData.geography_details ?? '',
			internal_deadline: formData.internal_deadline ?? null,
			intro: formData.intro ?? null,
			subject_matter: formData.subject_matter ?? null,
			pre_launch: formData.pre_launch ?? false,
			consultant:
				formData.consultant === 'clear' ? null : formData.consultant,
			sector: formData.sector,
			vehicles: formData.vehicles,
			vehicles_contracts: formData.vehicles_contracts,
			stations: formData.stations,
			stations_contracts: formData.stations_contracts,
			files: filesArray,
		}

		console.log('FORMATTED DATA', formattedData)

		const { data, error } = await supabase
			.from('tenders')
			.update(formattedData)
			.eq('id', id)
			.select()

		if (error) {
			throw new Error(error.message)
		}

		return data
	} catch (error) {
		console.log('ERROR UPDATING TENDER', error)
		throw error
	}
}

export const getTenders = async () => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('tenders')
			.select('*')
			.order('created_at', { ascending: false })

		if (error) {
			throw new Error(error.message)
		}

		const formattedData = data.map((tender) => ({
			id: tender.id,
			sent: tender.sent,
			geography: tender.geography.join(', '),
			awarding_authority: tender.awarding_authority,
			programme_title: tender.programme_title,
			internal_deadline: tender.internal_deadline,
		}))

		return formattedData
	} catch (error) {
		console.log('ERROR FETCHING TENDERS', error)
		throw error
	}
}

export const getTender = async (id: string) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('tenders')
			.select(
				`
    *,
    consultant:users (*)
  `
			)
			.eq('id', id)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		return data
	} catch (error) {
		console.log('ERROR FETCHING TENDER', error)
		throw error
	}
}

/* export const matchGrant = async ({
	geography,
	deployment,
	project,
}: {
	geography: string[]
	deployment?: string[] | null
	project?: string[] | null
}) => {
	try {
		const supabase = await createClient()

		// Step 1: Fetch clients that overlap in geography
		const { data: geoClients, error } = await supabase
			.from('clients')
			.select('*')
			.overlaps('geography', geography)

		if (error) {
			throw new Error('Error fetching clients: ' + error.message)
		}

		console.log('GEO CLIENTS', geoClients)

		// Step 2: Filter those clients for deployment/project overlap (if arrays provided)
		const filteredClients = (geoClients ?? []).filter((client) => {
			const deploymentMatch =
				deployment && deployment.length > 0
					? client.deployment?.some((d: string) =>
							deployment.includes(d)
						)
					: false
			const projectMatch =
				project && project.length > 0
					? client.project?.some((p: string) => project.includes(p))
					: false
			// Must match geography AND (deployment OR project)
			return deploymentMatch || projectMatch
		})

		return filteredClients
	} catch (error) {
		console.log('ERROR MATCHING GRANT', error)
		throw error
	}
} */

export const addTendersTailoredAssessments = async (
	tenderId: string,
	assessments: [string, string, string][]
) => {
	try {
		const supabase = await createClient()

		console.log('assessments', assessments, tenderId)

		const assessmentsObjectArray = assessments.map((assessment) => ({
			client: assessment[0],
			relevance: assessment[1],
			next_steps: assessment[2],
		}))

		const { data: existingData, error: existingError } = await supabase
			.from('tenders')
			.select('tailored_assessment')
			.eq('id', tenderId)
			.single()

		if (existingError) {
			throw new Error(existingError.message)
		}

		const safeAssessments: {
			client: string
			relevance: string
			next_steps: string
		}[] = Array.isArray(existingData?.tailored_assessment)
			? //eslint-disable-next-line
				(existingData.tailored_assessment as any[]).filter(
					(
						item
					): item is {
						client: string
						relevance: string
						next_steps: string
					} =>
						!!item &&
						typeof item === 'object' &&
						'client' in item &&
						'relevance' in item &&
						'next_steps' in item
				)
			: []

		// Add only new assessments (by client)
		const updatedAssessments = [...safeAssessments]
		for (const assessment of assessmentsObjectArray) {
			const exists = safeAssessments.some(
				(item) => item.client === assessment.client
			)
			if (!exists) {
				updatedAssessments.push(assessment)
			}
		}
		const { data, error } = await supabase
			.from('tenders')
			.update({
				tailored_assessment: updatedAssessments,
			})
			.eq('id', tenderId)
			.select('*')

		if (error) {
			throw new Error(error.message)
		}

		return data
	} catch (error) {
		console.log('ERROR ADDING ASSESSMENTS', error)
		throw error
	}
}
// ...existing code...

export const sendTenderAlert = async (tenderId: string) => {
	try {
		const supabase = await createClient()

		// 1) Recompute matched clients
		const { error: rpcError } = await supabase.rpc(
			'update_tender_clients_call',
			{
				tender_id: tenderId,
			}
		)
		if (rpcError) throw new Error(rpcError.message)

		// 2) Load tender
		const { data: tenderData, error: tenderError } = await supabase
			.from('tenders')
			.select('*')
			.eq('id', tenderId)
			.single()
		if (tenderError) throw new Error(tenderError.message)

		const matchedClients = tenderData?.matched_clients
		if (!matchedClients || matchedClients.length === 0) {
			throw new Error('No matched clients found')
		}

		// 3) Fetch matched clients (pull only needed columns)
		const { data: clientsData, error: clientsError } = await supabase
			.from('clients')
			.select(
				`id,email,referrer,org_name,additional_emails,vehicles_type,charging_stations_type,deployment,project,pif`
			)
			.in('id', matchedClients as string[])
		if (clientsError || !clientsData)
			throw new Error(clientsError?.message || 'Error fetching clients')

		// 4) Prepare attachments once (shared helper)
		const attachments = await fetchAttachments(
			(tenderData.files as string[] | null) ?? null,
			'/tenders/',
			'tenders/'
		)

		// 5) Build recipient descriptors (normal + tailored split)
		const assessments =
			(tenderData.tailored_assessment as
				| { client: string; relevance: string; next_steps: string }[]
				| undefined) || []
		type ClientRow = {
			id: string
			email: string
			referrer: string | null
			org_name: string | null
			additional_emails: string[] | null
			vehicles_type: unknown | null
			charging_stations_type: unknown | null
			deployment: unknown | null
			project: unknown | null
			pif: unknown | null
		}

		const recipients = (clientsData as ClientRow[]).map((c) => {
			const assessment = assessments.find((a) => a.client === c.email)
			const clientShape: Partial<
				Pick<
					import('@/lib/types').ClientType,
					| 'email'
					| 'vehicles_type'
					| 'charging_stations_type'
					| 'pif'
					| 'deployment'
					| 'project'
				>
			> = {
				email: c.email,
				vehicles_type: c.vehicles_type as Json | null,
				charging_stations_type: c.charging_stations_type as Json | null,
				pif: c.pif as Json | null,
				deployment: c.deployment as Json | null,
				project: c.project as Json | null,
			}
			return {
				client: c,
				email: c.email,
				referrer: c.referrer,
				cc: (Array.isArray(c.additional_emails)
					? c.additional_emails
					: []
				).filter((e) => !!e),
				tailored: !!assessment,
				assessment,
				subject: buildTenderEmailSubject(tenderData, clientShape),
			}
		})

		const normalRecipients = recipients.filter((r) => !r.tailored)
		const tailoredRecipients = recipients.filter((r) => r.tailored)

		// 6) Email send (concurrent)
		const CONCURRENCY = 5 // adjust as needed

		// Worker for normal
		const sendNormal = async (r: (typeof normalRecipients)[number]) => {
			if (r.referrer === 'charIn') {
				await sendTenderCharIn(
					r.email,
					r.subject,
					tenderData,
					attachments,
					r.cc,
					r.client
				)
			} else {
				await sendTender(
					r.email,
					r.subject,
					tenderData,
					attachments,
					r.cc,
					r.client
				)
			}
		}

		// Worker for tailored
		const sendTailored = async (r: (typeof tailoredRecipients)[number]) => {
			if (r.referrer === 'charIn') {
				await sendTenderTailoredCharIn(
					r.email,
					r.subject,
					tenderData,
					r.assessment,
					attachments,
					r.cc,
					r.client
				)
			} else {
				await sendTenderTailored(
					r.email,
					r.subject,
					tenderData,
					r.assessment,
					attachments,
					r.cc,
					r.client
				)
			}
		}

		await Promise.all([
			runWithConcurrency(normalRecipients, CONCURRENCY, sendNormal),
			runWithConcurrency(tailoredRecipients, CONCURRENCY, sendTailored),
		])

		// 7) Mark as sent
		const { error: updateError } = await supabase
			.from('tenders')
			.update({ sent: true })
			.eq('id', tenderId)
		if (updateError) throw new Error(updateError.message)

		// 8) Create alert log
		const alert: CreateAlertType = {
			subject:
				tenderData.programme_title ?? tenderData.call_title ?? 'Tender',
			entity_type: 'tender',
			entity_id: tenderId,
			matched_clients: matchedClients,
		}
		await createAlert(alert)

		return { success: true }
	} catch (e) {
		console.error('ERROR SENDING TENDER ALERT', e)
		throw e
	}
}

// ...existing code...
export const filterTenderClients = async (tenderId: string) => {
	try {
		const supabase = await createClient()

		const { error } = await supabase.rpc('update_tender_clients_call', {
			tender_id: tenderId,
		})
		if (error) {
			throw new Error(error.message)
		}
		console.log('FILTERED CLIENTS', error)
		return error
	} catch (error) {
		console.log('ERROR FILTERING TENDER CLIENTS', error)
		throw error
	}
}
