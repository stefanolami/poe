'use server'

import {
	CreateAlertType,
	CreateTendersType,
	UpdateTenderType,
	ClientType,
	TenderType,
} from '@/lib/types'
import { createClient } from '@/supabase/server'
import { buildTenderEmailSubject } from '@/lib/utils'
import {
	sendTender,
	sendTenderCharIn,
	sendTenderTailored,
	sendTenderTailoredCharIn,
} from './email'
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
			programme: formData.programme,
			alert_purpose: formData.alert_purpose,
			programme_purpose: formData.programme_purpose,
			instrument_type: formData.instrument_type,
			awarding_authority: formData.awarding_authority,
			deadline: flatDeadline,
			further_details: flatFurtherDetails,
			in_brief: formData.in_brief,
			value: formData.value,
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
			programme: formData.programme,
			alert_purpose: formData.alert_purpose,
			programme_purpose: formData.programme_purpose,
			instrument_type: formData.instrument_type,
			awarding_authority: formData.awarding_authority,
			deadline: flatDeadline,
			further_details: flatFurtherDetails,
			in_brief: formData.in_brief,
			value: formData.value,
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
			programme: tender.programme,
			deadline: tender.deadline[0].split('///')[0],
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

export const sendTenderAlert = async (tenderId: string) => {
	try {
		const supabase = await createClient()

		const { error: rpcError } = await supabase.rpc(
			'update_tender_clients_call',
			{
				tender_id: tenderId,
			}
		)
		if (rpcError) {
			throw new Error(rpcError.message)
		}
		console.log('RPC CALL DONE')

		const { data: tenderData, error } = await supabase
			.from('tenders')
			.select('*')
			.eq('id', tenderId)
			.single()

		if (error) {
			throw new Error(error.message)
		}
		console.log('TENDER CALL DONE')

		const matchedClients = tenderData?.matched_clients

		if (!matchedClients || matchedClients.length === 0)
			throw new Error('No matched clients found')

		const { data: clientsData, error: clientsError } = await supabase
			.from('clients')
			.select('*')
			.in('id', matchedClients)

		console.log('CLIENTS CALL DONE')

		if (clientsError || !clientsData || clientsData.length === 0) {
			throw new Error(clientsError?.message || 'No clients found')
		}

		const alertSubject = `${tenderData.programme}`

		let attachments: ({
			filename: string | undefined
			content: Buffer<ArrayBuffer>
		} | null)[] = []

		if (tenderData.files && tenderData.files.length > 0) {
			attachments = await Promise.all(
				(tenderData.files || []).map(async (filePath) => {
					const { data, error } = await supabase.storage
						.from('documents')
						.download(filePath.replace('/tenders/', 'tenders/'))

					if (error) return null

					const buffer = await data.arrayBuffer()
					return {
						filename: filePath.split('/').pop(),
						content: Buffer.from(buffer),
					}
				})
			)
		}
		console.log('ATTACHMENTS DONE')

		type ClientLite = Pick<
			ClientType,
			| 'email'
			| 'id'
			| 'org_name'
			| 'referrer'
			| 'vehicles_type'
			| 'charging_stations_type'
			| 'pif'
			| 'deployment'
			| 'project'
			| 'additional_emails'
		>

		const clientsList = clientsData.map((client: ClientLite) => ({
			email: client.email as string,
			referrer: client.referrer as string | null,
			cc: (Array.isArray(client.additional_emails)
				? (client.additional_emails as string[]).filter(
						(e) => !!e && e.trim().length > 0
					)
				: []) as string[],
			data: client,
		}))

		const assessments = tenderData.tailored_assessment as
			| {
					client: string
					relevance: string
					next_steps: string
			  }[]
			| []
		const tailoredEmails = assessments?.map(
			(assessment) => assessment.client
		)

		// Split emails into tailored and normal
		const tailoredRecipients = clientsList.filter((client) =>
			tailoredEmails?.includes(client.email)
		)
		const normalRecipients = clientsList.filter(
			(client) => !tailoredEmails?.includes(client.email)
		)

		// For tailored, match each email to its assessment
		const tailoredAssessments = tailoredRecipients.map(
			(client) => assessments.find((a) => a.client === client.email) || {}
		)
		console.log('RECIPIENTS SPLIT DONE')

		function sleep(ms: number) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		}

		if (normalRecipients && normalRecipients.length > 0) {
			for (const client of normalRecipients) {
				const personalizedSubject = buildTenderEmailSubject(
					tenderData as TenderType,
					client.data
				)
				if (client.referrer === 'charIn') {
					await sendTenderCharIn(
						client.email,
						personalizedSubject,
						tenderData,
						attachments,
						client.cc,
						client.data
					)
					await sleep(600)
				} else {
					await sendTender(
						client.email,
						personalizedSubject,
						tenderData,
						attachments,
						client.cc,
						client.data
					)
					await sleep(600)
				}
			}
		}

		if (tailoredRecipients && tailoredRecipients.length > 0) {
			for (let i = 0; i < tailoredRecipients.length; i++) {
				const to = tailoredRecipients[i].email
				const assessment = tailoredAssessments[i]
				const personalizedSubject = buildTenderEmailSubject(
					tenderData as TenderType,
					tailoredRecipients[i].data
				)
				if (tailoredRecipients[i].referrer === 'charIn') {
					await sendTenderTailoredCharIn(
						to,
						personalizedSubject,
						tenderData,
						assessment,
						attachments,
						tailoredRecipients[i].cc,
						tailoredRecipients[i].data
					)
					await sleep(600)
				} else {
					await sendTenderTailored(
						to,
						personalizedSubject,
						tenderData,
						assessment,
						attachments,
						tailoredRecipients[i].cc,
						tailoredRecipients[i].data
					)
					await sleep(600)
				}
			}
		}
		console.log('TENDER SENT')

		const { error: updateError } = await supabase
			.from('tenders')
			.update({ sent: true })
			.eq('id', tenderId)

		if (updateError) {
			throw new Error(updateError.message)
		}

		console.log('TENDER ALERT SENT')

		const alert: CreateAlertType = {
			subject: alertSubject,
			entity_type: 'tender',
			entity_id: tenderId,
			matched_clients: matchedClients,
		}

		await createAlert(alert)

		return { success: true }
	} catch (error) {
		console.log('ERROR SENDING TENDER ALERT', error)
		throw error
	}
}

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
