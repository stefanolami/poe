'use server'

import { ActivityEventType, MailerSend } from 'mailersend'

const mailerSend = new MailerSend({
	apiKey: process.env.MAILERSEND_API_KEY || '',
})

export const getEmailActivity = async () => {
	// MailerSend free plans often have a 7-day retention window. Try 7 days and fallback down to 1 day if needed.
	const dateTo = Math.floor(Date.now() / 1000 - 10)

	const tryFetch = async (days: number) => {
		const windowMs = days * 24 * 60 * 60 * 1000
		const dateFrom = Math.floor((Date.now() - windowMs) / 1000)
		const queryParams = {
			limit: 100 as const, // Min: 10, Max: 100, Default: 25
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
			// Narrow the response body defensively
			const body: unknown = (response as { body?: unknown }).body
			if (!body || typeof body !== 'object' || !('data' in body)) {
				return null
			}
			const data = (body as { data: unknown }).data
			if (!Array.isArray(data)) return null
			return { data }
		} catch (error) {
			// Network or SDK error
			console.log(error)
			return null
		}
	}

	// Try 7 days down to 1 day
	for (let d = 7; d >= 1; d--) {
		const res = await tryFetch(d)
		if (res) return res
	}
	// Safe fallback
	return { data: [] }
}
