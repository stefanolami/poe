'use server'

import { CreateGrantType, UpdateGrantType } from '@/lib/types'
import { createClient } from '@/supabase/server'
import { sendGrantBatch, sendGrantTailoredBatch } from './email'

export const createGrant = async (formData: CreateGrantType) => {
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
			call_title: formData.call_title,
			grant_programme: formData.grant_programme,
			alert_purpose: formData.alert_purpose,
			programme_purpose: formData.programme_purpose,
			instrument_type: formData.instrument_type,
			awarding_authority: formData.awarding_authority,
			reference_number: formData.reference_number,
			deadline: flatDeadline,
			further_details: flatFurtherDetails,
			in_brief: formData.in_brief,
			value: formData.value,
			consultant: Number(formData.consultant),
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

export const updateGrant = async (id: number, formData: UpdateGrantType) => {
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

		const filesArray =
			formData.oldFiles?.concat(uploadedFilePaths) || uploadedFilePaths

		const formattedData = {
			geography: formData.geography,
			call_title: formData.call_title,
			grant_programme: formData.grant_programme,
			alert_purpose: formData.alert_purpose,
			programme_purpose: formData.programme_purpose,
			instrument_type: formData.instrument_type,
			awarding_authority: formData.awarding_authority,
			reference_number: formData.reference_number,
			deadline: flatDeadline,
			further_details: flatFurtherDetails,
			in_brief: formData.in_brief,
			value: formData.value,
			consultant: Number(formData.consultant),
			sector: formData.sector,
			deployment: formData.deployment,
			project: formData.project,
			files: filesArray,
		}

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
			grant_programme: grant.grant_programme,
			value: grant.value,
		}))

		return formattedData
	} catch (error) {
		console.log('ERROR FETCHING GRANTS', error)
		throw error
	}
}

export const getGrant = async (id: number) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase
			.from('grants')
			.select('*')
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
	grantId: number,
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

export const sendGrantAlert = async (grantId: number) => {
	try {
		const supabase = await createClient()

		const { error: rpcError } = await supabase.rpc(
			'update_grant_clients_call',
			{
				grant_id: grantId,
			}
		)
		if (rpcError) {
			throw new Error(rpcError.message)
		}

		const { data: grantData, error } = await supabase
			.from('grants')
			.select('*')
			.eq('id', grantId)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		const matchedClients = grantData?.matched_clients

		if (!matchedClients || matchedClients.length === 0)
			return new Error('No matched clients found')

		const { data: clientsData, error: clientsError } = await supabase
			.from('clients')
			.select('*')
			.in('id', matchedClients)

		if (clientsError || !clientsData || clientsData.length === 0) {
			throw new Error(clientsError?.message || 'No clients found')
		}

		const emailSubject = `POE Alert - Grant - ${grantData.call_title || grantData.grant_programme}`

		let attachments: ({
			filename: string | undefined
			content: Buffer<ArrayBuffer>
		} | null)[] = []

		if (grantData.files && grantData.files.length > 0) {
			attachments = await Promise.all(
				(grantData.files || []).map(async (filePath) => {
					const { data, error } = await supabase.storage
						.from('documents')
						.download(filePath.replace('/grants/', 'grants/'))

					if (error) return null

					const buffer = await data.arrayBuffer()
					return {
						filename: filePath.split('/').pop(),
						content: Buffer.from(buffer),
					}
				})
			)
		}

		const clientsEmails = clientsData.map((client) => client.email)
		//console.log('CLIENTS EMAILS', clientsEmails)
		const assessments = grantData.tailored_assessment as
			| {
					client: string
					relevance: string
					next_steps: string
			  }[]
			| []
		const tailoredEmails = assessments?.map(
			(assessment) => assessment.client
		)
		//console.log('TAILORED EMAILS', tailoredEmails)

		// Split emails into tailored and normal
		const tailoredRecipients = clientsEmails.filter((email) =>
			tailoredEmails?.includes(email)
		)
		const normalRecipients = clientsEmails.filter(
			(email) => !tailoredEmails?.includes(email)
		)

		console.log('normalRecipients', normalRecipients)

		// For tailored, match each email to its assessment
		const tailoredAssessments = tailoredRecipients.map(
			(email) => assessments.find((a) => a.client === email) || {}
		)

		function sleep(ms: number) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		}

		// Send in parallel (or sequentially if you need to respect rate limits)
		const response = await Promise.all([
			normalRecipients.length > 0
				? sendGrantBatch(
						normalRecipients,
						emailSubject,
						grantData,
						attachments
					)
				: Promise.resolve(),
			normalRecipients.length > 0 && tailoredRecipients.length > 0
				? await sleep(1000)
				: Promise.resolve(),
			tailoredRecipients.length > 0
				? sendGrantTailoredBatch(
						tailoredRecipients,
						emailSubject,
						grantData,
						tailoredAssessments,
						attachments
					)
				: Promise.resolve(),
		])
		return response
	} catch (error) {
		console.log('ERROR SENDING GRANT ALERT', error)
		throw error
	}
}

export const filterGrantClients = async (grantId: number) => {
	try {
		const supabase = await createClient()

		const { error } = await supabase.rpc('update_grant_clients_call', {
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
