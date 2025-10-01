'use server'

import {
	CreateAlertType,
	ClientType,
	GrantType,
	CreateInvestmentsType,
	UpdateInvestmentType,
} from '@/lib/types'
import { buildGrantEmailSubject } from '@/lib/utils'
import { Json } from '@/supabase/types'
import { fetchAttachments } from '@/lib/attachments'
import { runWithConcurrency } from '@/lib/concurrency'
import { createClient } from '@/supabase/server'
import {
	sendInvestment,
	sendInvestmentCharin,
	sendInvestmentTailored,
	sendInvestmentTailoredCharin,
} from './email'
import { createAlert } from './alerts'

export const createInvestment = async (formData: CreateInvestmentsType) => {
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
			files: uploadedFilePaths,
		}

		const { data, error } = await supabase
			.from('investments')
			.insert(formattedData)
			.select()

		if (error) {
			throw new Error(error.message)
		}

		return data
	} catch (error) {
		console.log('ERROR CREATING INVESTMENT', error)
		throw error
	}
}

export const updateInvestment = async (
	id: string,
	formData: UpdateInvestmentType
) => {
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
				formData.consultant === 'clear' ? null : formData.consultant,
			sector: formData.sector,
			files: filesArray,
		}

		console.log('FORMATTED DATA', formattedData)

		const { data, error } = await supabase
			.from('investments')
			.update(formattedData)
			.eq('id', id)
			.select()

		if (error) {
			throw new Error(error.message)
		}

		return data
	} catch (error) {
		console.log('ERROR UPDATING INVESTMENT', error)
		throw error
	}
}

export const getInvestments = async () => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('investments')
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
		console.log('ERROR FETCHING INVESTMENTS', error)
		throw error
	}
}

export const getInvestment = async (id: string) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('investments')
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
		console.log('ERROR FETCHING INVESTMENT', error)
		throw error
	}
}

export const addInvestmentsTailoredAssessments = async (
	investmentId: string,
	assessments: [string, string, string][]
) => {
	try {
		const supabase = await createClient()

		console.log('assessments', assessments, investmentId)

		const assessmentsObjectArray = assessments.map((assessment) => ({
			client: assessment[0],
			relevance: assessment[1],
			next_steps: assessment[2],
		}))

		const { data: existingData, error: existingError } = await supabase
			.from('investments')
			.select('tailored_assessment')
			.eq('id', investmentId)
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
			.from('investments')
			.update({
				tailored_assessment: updatedAssessments,
			})
			.eq('id', investmentId)
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

export const sendInvestmentAlert = async (investmentId: string) => {
	try {
		const supabase = await createClient()

		// 1) RPC to recompute matches
		const { error: rpcError } = await supabase.rpc(
			'refresh_investments_matched_clients',
			{ investment_id: investmentId }
		)
		if (rpcError) throw new Error(rpcError.message)

		// 2) Fetch investment
		const { data: investmentData, error: invError } = await supabase
			.from('investments')
			.select('*')
			.eq('id', investmentId)
			.single()
		if (invError) throw new Error(invError.message)

		const matchedClients = investmentData?.matched_clients
		if (!matchedClients || matchedClients.length === 0) {
			throw new Error('No matched clients found')
		}

		// 3) Fetch clients (lean)
		const { data: clientsData, error: clientsError } = await supabase
			.from('clients')
			.select(
				`id,email,referrer,org_name,additional_emails,vehicles_type,charging_stations_type,deployment,project,pif`
			)
			.in('id', matchedClients as string[])
		if (clientsError || !clientsData)
			throw new Error(clientsError?.message || 'Error fetching clients')

		// 4) Attachments via shared helper
		const attachments = await fetchAttachments(
			(investmentData.files as string[] | null) ?? null,
			'/grants/',
			'grants/'
		)

		// 5) Build recipients (investments currently reusing grant email templates/subject)
		const assessments =
			(investmentData.tailored_assessment as
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
					investmentData as unknown as GrantType,
					clientShape as ClientType
				),
			}
		})

		const normalRecipients = recipients.filter((r) => !r.tailored)
		const tailoredRecipients = recipients.filter((r) => r.tailored)

		const CONCURRENCY = 5

		const sendNormal = async (r: (typeof normalRecipients)[number]) => {
			if (r.referrer === 'charin') {
				await sendInvestmentCharin(
					r.email,
					r.subject,
					investmentData,
					attachments,
					r.cc,
					r.client
				)
			} else {
				await sendInvestment(
					r.email,
					r.subject,
					investmentData,
					attachments,
					r.cc,
					r.client
				)
			}
		}

		const sendTailored = async (r: (typeof tailoredRecipients)[number]) => {
			if (r.referrer === 'charin') {
				await sendInvestmentTailoredCharin(
					r.email,
					r.subject,
					investmentData,
					r.assessment,
					attachments,
					r.cc,
					r.client
				)
			} else {
				await sendInvestmentTailored(
					r.email,
					r.subject,
					investmentData,
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

		// 6) Mark as sent
		const { error: updateError } = await supabase
			.from('investments')
			.update({ sent: true })
			.eq('id', investmentId)
		if (updateError) throw new Error(updateError.message)

		// 7) Create alert log
		const alert: CreateAlertType = {
			subject:
				investmentData.call_title ||
				investmentData.programme_title ||
				'Investment',
			entity_type: 'investment',
			entity_id: investmentId,
			matched_clients: matchedClients,
		}
		await createAlert(alert)

		return { success: true }
	} catch (error) {
		console.log('ERROR SENDING INVESTMENT ALERT', error)
		throw error
	}
}

export const filterInvestmentClients = async (investmentId: string) => {
	try {
		const supabase = await createClient()

		const { error } = await supabase.rpc(
			'refresh_investments_matched_clients',
			{
				investment_id: investmentId,
			}
		)
		if (error) {
			throw new Error(error.message)
		}
		console.log('FILTERED CLIENTS', error)
		return error
	} catch (error) {
		console.log('ERROR FILTERING INVESTMENT CLIENTS', error)
		throw error
	}
}
