'use server'

import { CreateGrantType } from '@/lib/types'
import { createClient } from '@/supabase/server'
import { sendEmail } from './email'

export const createGrant = async (formData: CreateGrantType) => {
	const supabase = await createClient()

	const flatDeadline = formData.deadline.map((element) => element.join('///'))
	const flatFurtherDetails = formData.further_details?.map((element) =>
		element.join('///')
	)

	const { files } = formData

	let uploadedFilePaths: string[] = []

	if (files && files.length > 0) {
		const uploadPromises = files.map(async (file: File) => {
			// Use the file name as the path (optionally add a folder prefix if needed)
			const filePath = `/grants/${file.name}`
			const { error } = await supabase.storage
				.from('documents')
				.upload(filePath, file, {
					cacheControl: '3600',
					upsert: false,
				})
			if (error) throw new Error(`File upload failed: ${error.message}`)
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

	const emailSubject = formattedData.call_title
		? formattedData.call_title
		: formattedData.grant_programme

	if (uploadedFilePaths.length > 0) {
		const attachments = await Promise.all(
			(uploadedFilePaths || []).map(async (filePath) => {
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
		const emailResponse = await sendEmail(
			'stefanolami90@gmail.com',
			emailSubject,
			formattedData,
			attachments
		)
		console.log('EMAIL RESPONSE', emailResponse)
		return data
	}

	const emailResponse = await sendEmail(
		'stefanolami90@gmail.com',
		emailSubject,
		formattedData
	)
	console.log('EMAIL RESPONSE', emailResponse)

	return data
}

export const getGrants = async () => {
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
}

export const getGrant = async (id: number) => {
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
}
