'use server'

import {
	CreateAlertType,
	CreateGrantType,
	UpdateGrantType,
	ClientType,
	GrantType,
} from '@/lib/types'
import { buildGrantEmailSubject } from '@/lib/utils'
import { runWithConcurrency } from '@/lib/concurrency'
import { fetchAttachments } from '@/lib/attachments'
import { Json } from '@/supabase/types'
import { createClient } from '@/supabase/server'
import { sendGrant, sendGrantCharin } from './email'
import { createAlert } from './alerts'

export const createGrant = async (formData: CreateGrantType) => {
	try {
		const supabase = await createClient()

		// Normalize deadline: drop empty triplets and set null if none remain
		const filteredDeadline = (formData.deadline || []).filter(
			(triplet) =>
				Array.isArray(triplet) &&
				triplet.some((v) => (v || '').trim() !== '')
		)
		const flatDeadline =
			filteredDeadline.length > 0
				? filteredDeadline.map((element) => element.join('///'))
				: null
		const flatFurtherDetails = formData.further_details?.map((element) =>
			element.join('///')
		)

		const { files } = formData

		let uploadedFilePaths: string[] = []

		if (files && files.length > 0) {
			const uploadPromises = files.map(async (file: File) => {
				const filePath = `/grants/${file.name}`
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
				!formData.consultant || formData.consultant === 'clear'
					? null
					: formData.consultant,
			sector: formData.sector,
			deployment: formData.deployment,
			project: formData.project,
			files: uploadedFilePaths,
		}

		const { data, error } = await supabase
			.from('grants')
			.insert(formattedData)
			.select()

		if (error) {
			throw new Error(error.message)
		}

		return data
	} catch (error) {
		console.log('ERROR CREATING GRANT', error)
		throw error
	}
}

export const updateGrant = async (id: string, formData: UpdateGrantType) => {
	try {
		const supabase = await createClient()

		const filteredDeadline = (formData.deadline || []).filter(
			(triplet) =>
				Array.isArray(triplet) &&
				triplet.some((v) => (v || '').trim() !== '')
		)
		const flatDeadline =
			filteredDeadline.length > 0
				? filteredDeadline.map((element) => element.join('///'))
				: null
		const flatFurtherDetails = formData.further_details?.map((element) =>
			element.join('///')
		)

		const { files } = formData

		let uploadedFilePaths: string[] = []

		if (files && files.length > 0) {
			const uploadPromises = files.map(async (file: File) => {
				const filePath = `/grants/${file.name}`
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
				!formData.consultant || formData.consultant === 'clear'
					? null
					: formData.consultant,
			sector: formData.sector,
			deployment: formData.deployment,
			project: formData.project,
			files: filesArray,
		}

		console.log('FORMATTED DATA', formattedData)

		const { data, error } = await supabase
			.from('grants')
			.update(formattedData)
			.eq('id', id)
			.select()

		if (error) {
			throw new Error(error.message)
		}

		return data
	} catch (error) {
		console.log('ERROR UPDATING GRANT', error)
		throw error
	}
}

export const getGrants = async () => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('grants')
			.select('*')
			.order('created_at', { ascending: false })

		if (error) {
			throw new Error(error.message)
		}

		const formattedData = data.map((grant) => ({
			id: grant.id,
			sent: grant.sent,
			geography: grant.geography.join(', '),
			call_title: grant.call_title,
			programme_title: grant.programme_title,
			internal_deadline: grant.internal_deadline,
		}))

		return formattedData
	} catch (error) {
		console.log('ERROR FETCHING GRANTS', error)
		throw error
	}
}

export const getGrant = async (id: string) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('grants')
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
		console.log('ERROR FETCHING GRANT', error)
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

export const addGrantsTailoredAssessments = async (
	grantId: string,
	assessments: [string, string, string][]
) => {
	try {
		const supabase = await createClient()

		console.log('assessments', assessments, grantId)

		const assessmentsObjectArray = assessments.map((assessment) => ({
			client: assessment[0],
			relevance: assessment[1],
			next_steps: assessment[2],
		}))

		const { data: existingData, error: existingError } = await supabase
			.from('grants')
			.select('tailored_assessment')
			.eq('id', grantId)
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
			.from('grants')
			.update({
				tailored_assessment: updatedAssessments,
			})
			.eq('id', grantId)
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

export const sendGrantAlert = async (grantId: string) => {
	try {
		const supabase = await createClient()

		// 1) Recompute matched clients via RPC
		const { error: rpcError } = await supabase.rpc(
			'refresh_grants_matched_clients',
			{ grant_id: grantId }
		)
		if (rpcError) throw new Error(rpcError.message)

		// 2) Load grant
		const { data: grantData, error: grantError } = await supabase
			.from('grants')
			.select('*')
			.eq('id', grantId)
			.single()
		if (grantError) throw new Error(grantError.message)

		const matchedClients = grantData?.matched_clients
		if (!matchedClients || matchedClients.length === 0) {
			throw new Error('No matched clients found')
		}

		// 3) Fetch matched clients with lean projection
		const { data: clientsData, error: clientsError } = await supabase
			.from('clients')
			.select(
				`id,email,referrer,org_name,additional_emails,vehicles_type,charging_stations_type,deployment,project,pif,account_status`
			)
			.in('id', matchedClients as string[])
			.in('account_status', ['active', 'pending'])
		if (clientsError || !clientsData)
			throw new Error(clientsError?.message || 'Error fetching clients')

		// 4) Prepare attachments via helper
		const attachments = await fetchAttachments(
			(grantData.files as string[] | null) ?? null,
			'/grants/',
			'grants/'
		)

		// 5) Build recipient descriptors
		const assessments =
			(grantData.tailored_assessment as
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
					ClientType,
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
				subject: buildGrantEmailSubject(
					grantData as GrantType,
					clientShape as ClientType
				),
			}
		})

		const normalRecipients = recipients.filter((r) => !r.tailored)
		const tailoredRecipients = recipients.filter((r) => r.tailored)

		const CONCURRENCY = 5

		const sendNormal = async (r: (typeof normalRecipients)[number]) => {
			if (r.referrer === 'charin') {
				await sendGrantCharin(
					r.email,
					r.subject,
					grantData,
					attachments,
					r.cc,
					r.client
				)
			} else {
				await sendGrant(
					r.email,
					r.subject,
					grantData,
					attachments,
					r.cc,
					r.client
				)
			}
		}

		const sendTailored = async (r: (typeof tailoredRecipients)[number]) => {
			if (r.referrer === 'charin') {
				await sendGrantCharin(
					r.email,
					r.subject,
					grantData,
					attachments,
					r.cc,
					r.client,
					r.assessment
				)
			} else {
				await sendGrant(
					r.email,
					r.subject,
					grantData,
					attachments,
					r.cc,
					r.client,
					r.assessment
				)
			}
		}

		await Promise.all([
			runWithConcurrency(normalRecipients, CONCURRENCY, sendNormal),
			runWithConcurrency(tailoredRecipients, CONCURRENCY, sendTailored),
		])

		// 6) Mark as sent
		const { error: updateError } = await supabase
			.from('grants')
			.update({ sent: true })
			.eq('id', grantId)
		if (updateError) throw new Error(updateError.message)

		// 7) Create alert log
		const alert: CreateAlertType = {
			subject:
				grantData.call_title || grantData.programme_title || 'Grant',
			entity_type: 'grant',
			entity_id: grantId,
			matched_clients: matchedClients,
		}
		await createAlert(alert)

		return { success: true }
	} catch (error) {
		console.log('ERROR SENDING GRANT ALERT', error)
		throw error
	}
}

export const filterGrantClients = async (grantId: string) => {
	try {
		const supabase = await createClient()

		const { error } = await supabase.rpc('refresh_grants_matched_clients', {
			grant_id: grantId,
		})
		if (error) {
			throw new Error(error.message)
		}
		console.log('FILTERED CLIENTS', error)
		return error
	} catch (error) {
		console.log('ERROR FILTERING GRANT CLIENTS', error)
		throw error
	}
}
