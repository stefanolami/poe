'use server'

import { ActivityEventType, MailerSend } from 'mailersend'

const mailerSend = new MailerSend({
	apiKey: process.env.MAILERSEND_API_KEY || '',
})

export const getEmailActivity = async () => {
	const dateTo = Math.floor(Date.now() / 1000)

	const dateFrom = Math.floor((Date.now() - 14 * 24 * 60 * 60 * 1000) / 1000)

	const queryParams = {
		limit: 100, // Min: 10, Max: 100, Default: 25
		page: 1,
		date_from: dateFrom, // Unix timestamp
		date_to: dateTo, // Unix timestamp
		event: [
			ActivityEventType.SENT,
			ActivityEventType.SOFT_BOUNCED,
			ActivityEventType.HARD_BOUNCED,
		],
	}

	try {
		const response = await mailerSend.email.activity.domain(
			'z3m5jgry7o04dpyo',
			queryParams
		)
		console.log('response', response.body)
		return response.body
	} catch (error) {
		console.log(error)
		return null
	}
}
