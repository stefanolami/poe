'use server'

import {
	MailerSend,
	EmailParams,
	Sender,
	Recipient,
	type Attachment,
} from 'mailersend'
import GrantsEmail from '../components/emails/opportunities/grants-email'
import GrantsEmailCharin from '../components/emails/opportunities/grants-email-charin'
import TendersEmail from '../components/emails/opportunities/tenders-email'
import TendersEmailCharin from '../components/emails/opportunities/tenders-email-charin'
import InvestmentsEmail from '../components/emails/opportunities/investments-email'
import InvestmentsEmailCharin from '../components/emails/opportunities/investments-email-charin'
import { render } from '@react-email/components'
import { fileToAttachment } from '../lib/utils'
import type { AttachmentDescriptor } from '../lib/attachments'
import AccountRecapEmail from '../components/emails/others/account-recap'
import AccountRecapEmailCharin from '../components/emails/others/account-recap-charin'
import WelcomeEmail from '../components/emails/others/welcome'
import WelcomeEmailCharin from '../components/emails/others/welcome-charin'
import { createAdminClient } from '../supabase/server'
import type { AccountRecapType } from '../lib/types'
import {
	normalizeGrant,
	normalizeTender,
	normalizeInvestment,
	type RawGrant,
	type RawTender,
	type RawInvestment,
} from '../lib/opportunity-types'

const mailerSend = new MailerSend({
	apiKey: process.env.MAILERSEND_API_KEY || '',
})

const mailerSendCharIn = new MailerSend({
	apiKey: process.env.MAILERSEND_CHARIN_API_KEY || '',
})

async function buildAccountMagicLink(
	client?: { email?: string | null },
	brand?: string
) {
	try {
		if (!client?.email) return null
		const supabase = await createAdminClient()
		const base =
			brand === 'charin'
				? 'https://www.poeontap-charin.com'
				: 'https://www.poeontap.com'
		const redirectTo = `${base}/auth/callback?next=%2Faccount`
		const { data, error } = await supabase.auth.admin.generateLink({
			type: 'magiclink',
			email: client.email,
			options: { redirectTo },
		})
		if (error) {
			console.error('Failed to generate magic link:', error)
			return null
		}
		return data?.properties?.action_link || null
	} catch (err) {
		console.error('Magic link generation error:', err)
		return null
	}
}

// Removed map* functions in favor of normalize* helpers from opportunity-types

export async function sendGrant(
	to: string,
	subject: string,
	grant: RawGrant,
	attachments: AttachmentDescriptor[] | null,
	cc: string[] = [],
	client?: {
		id?: string | null
		org_name?: string | null
		email?: string | null
	},
	assessment?: {
		relevance?: string | null
		next_steps?: string | null
	} | null
) {
	const accountLink = await buildAccountMagicLink(client, 'poe')
	const emailHtml = await render(
		<GrantsEmail
			grant={normalizeGrant(grant, !!assessment, assessment)}
			assessment={assessment || null}
			clientId={client?.id || client?.email || undefined}
			org_name={client?.org_name || null}
			accountLink={accountLink || undefined}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments: Attachment[] = await Promise.all(
			attachments.filter(Boolean).map(async (a) => {
				const fa = await fileToAttachment(a)
				return {
					filename: fa.filename,
					content: fa.content,
					disposition: 'attachment',
				}
			})
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSend.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSend.email.send(emailParams)
	}
}

export async function sendGrantCharin(
	to: string,
	subject: string,
	grant: RawGrant,
	attachments: AttachmentDescriptor[] | null,
	cc: string[] = [],
	client?: {
		id?: string | null
		org_name?: string | null
		email?: string | null
	},
	assessment?: {
		relevance?: string | null
		next_steps?: string | null
	} | null
) {
	const accountLink = await buildAccountMagicLink(client, 'charin')
	const emailHtml = await render(
		<GrantsEmailCharin
			grant={normalizeGrant(grant, !!assessment, assessment)}
			assessment={assessment || null}
			clientId={client?.id || client?.email || undefined}
			org_name={client?.org_name || null}
			accountLink={accountLink || undefined}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments: Attachment[] = await Promise.all(
			attachments.filter(Boolean).map(async (a) => {
				const fa = await fileToAttachment(a)
				return {
					filename: fa.filename,
					content: fa.content,
					disposition: 'attachment',
				}
			})
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap-charin.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSendCharIn.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap-charin.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSendCharIn.email.send(emailParams)
	}
}

export async function sendAccountRecap(
	to: string,
	data: AccountRecapType,
	total: number,
	id: string,
	options?: { brand?: 'poe' | 'charin'; cc?: string[] }
) {
	const brand = options?.brand || 'poe'
	const ccList = (options?.cc || []).filter(Boolean)

	const emailHtml = await render(
		brand === 'charin' ? (
			<AccountRecapEmailCharin
				data={data}
				total={total}
				id={id}
			/>
		) : (
			<AccountRecapEmail
				data={data}
				total={total}
				id={id}
			/>
		)
	)

	const fromSender =
		brand === 'charin'
			? new Sender('alerts@poeontap-charin.com', 'POE')
			: new Sender('alerts@poeontap.com', 'POE')
	const subject =
		brand === 'charin'
			? 'POE - Your Account Recap'
			: 'POE - Your Account Recap'

	const params = new EmailParams()
		.setFrom(fromSender)
		.setTo([new Recipient(to)])
		.setCc(ccList.map((addr) => new Recipient(addr)))
		.setSubject(subject)
		.setHtml(emailHtml)

	return brand === 'charin'
		? await mailerSendCharIn.email.send(params)
		: await mailerSend.email.send(params)
}

// Welcome Email (post full signup)
export async function sendWelcomeEmail(
	to: string,
	options?: {
		brand?: 'poe' | 'charin'
		org_name?: string | null
		clientId?: string | null
		paymentWindowDays?: number
	}
) {
	const brand = options?.brand || 'poe'
	const org_name = options?.org_name || null
	const clientId = options?.clientId || undefined
	const paymentWindowDays = options?.paymentWindowDays ?? 14
	// Build magic link for convenience
	const accountLink = await buildAccountMagicLink({ email: to }, brand)
	const emailHtml = await render(
		brand === 'charin' ? (
			<WelcomeEmailCharin
				clientId={clientId}
				org_name={org_name}
				paymentWindowDays={paymentWindowDays}
				accountLink={accountLink || undefined}
			/>
		) : (
			<WelcomeEmail
				clientId={clientId}
				org_name={org_name}
				paymentWindowDays={paymentWindowDays}
				accountLink={accountLink || undefined}
			/>
		)
	)

	const fromSender =
		brand === 'charin'
			? new Sender('alerts@poeontap-charin.com', 'POE')
			: new Sender('alerts@poeontap.com', 'POE')

	const subject = 'POE - Welcome'

	const params = new EmailParams()
		.setFrom(fromSender)
		.setTo([new Recipient(to)])
		.setSubject(subject)
		.setHtml(emailHtml)

	return brand === 'charin'
		? await mailerSendCharIn.email.send(params)
		: await mailerSend.email.send(params)
}

export async function sendTender(
	to: string,
	subject: string,
	tender: RawTender,
	attachments: AttachmentDescriptor[] | null,
	cc: string[] = [],
	client?: {
		id?: string | null
		org_name?: string | null
		email?: string | null
	}
) {
	const accountLink = await buildAccountMagicLink(client, 'poe')
	const emailHtml = await render(
		<TendersEmail
			tender={normalizeTender(tender as RawTender, false, undefined)}
			clientId={client?.id || client?.email || undefined}
			org_name={client?.org_name || null}
			accountLink={accountLink || undefined}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments: Attachment[] = await Promise.all(
			attachments.filter(Boolean).map(async (a) => {
				const fa = await fileToAttachment(a)
				return {
					filename: fa.filename,
					content: fa.content,
					disposition: 'attachment',
				}
			})
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSend.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSend.email.send(emailParams)
	}
}

export async function sendTenderCharin(
	to: string,
	subject: string,
	tender: RawTender,
	attachments: AttachmentDescriptor[] | null,
	cc: string[] = [],
	client?: {
		id?: string | null
		org_name?: string | null
		email?: string | null
	}
) {
	const accountLink = await buildAccountMagicLink(client, 'charin')
	const emailHtml = await render(
		<TendersEmailCharin
			tender={normalizeTender(tender as RawTender, false, undefined)}
			clientId={client?.id || client?.email || undefined}
			org_name={client?.org_name || null}
			accountLink={accountLink || undefined}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments: Attachment[] = await Promise.all(
			attachments.filter(Boolean).map(async (a) => {
				const fa = await fileToAttachment(a)
				return {
					filename: fa.filename,
					content: fa.content,
					disposition: 'attachment',
				}
			})
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap-charin.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSendCharIn.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap-charin.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSendCharIn.email.send(emailParams)
	}
}

export async function sendTenderTailored(
	to: string,
	subject: string,
	tender: RawTender,
	assessment: {
		relevance?: string | null
		next_steps?: string | null
	} | null,
	attachments: AttachmentDescriptor[] | null,
	cc: string[] = [],
	client?: {
		id?: string | null
		org_name?: string | null
		email?: string | null
	}
) {
	const accountLink = await buildAccountMagicLink(client, 'poe')
	const emailHtml = await render(
		<TendersEmail
			tender={normalizeTender(tender as RawTender, true, assessment)}
			assessment={assessment || null}
			clientId={client?.id || client?.email || undefined}
			org_name={client?.org_name || null}
			accountLink={accountLink || undefined}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments: Attachment[] = await Promise.all(
			attachments.map(async (a) => {
				const fa = await fileToAttachment(a)
				return {
					filename: fa.filename,
					content: fa.content,
					disposition: 'attachment',
				}
			})
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSend.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSend.email.send(emailParams)
	}
}

export async function sendTenderTailoredCharin(
	to: string,
	subject: string,
	tender: RawTender,
	assessment: {
		relevance?: string | null
		next_steps?: string | null
	} | null,
	attachments: AttachmentDescriptor[] | null,
	cc: string[] = [],
	client?: {
		id?: string | null
		org_name?: string | null
		email?: string | null
	}
) {
	const accountLink = await buildAccountMagicLink(client, 'charin')
	const emailHtml = await render(
		<TendersEmailCharin
			tender={normalizeTender(tender as RawTender, true, assessment)}
			assessment={assessment || null}
			clientId={client?.id || client?.email || undefined}
			org_name={client?.org_name || null}
			accountLink={accountLink || undefined}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments: Attachment[] = await Promise.all(
			attachments.map(async (a) => {
				const fa = await fileToAttachment(a)
				return {
					filename: fa.filename,
					content: fa.content,
					disposition: 'attachment',
				}
			})
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap-charin.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSendCharIn.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap-charin.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSendCharIn.email.send(emailParams)
	}
}

export async function sendInvestment(
	to: string,
	subject: string,
	investment: RawInvestment,
	attachments: AttachmentDescriptor[] | null,
	cc: string[] = [],
	client?: {
		id?: string | null
		org_name?: string | null
		email?: string | null
	}
) {
	const accountLink = await buildAccountMagicLink(client, 'poe')
	const emailHtml = await render(
		<InvestmentsEmail
			investment={normalizeInvestment(investment, false, undefined)}
			clientId={client?.id || client?.email || undefined}
			org_name={client?.org_name || null}
			accountLink={accountLink || undefined}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments: Attachment[] = await Promise.all(
			attachments.filter(Boolean).map(async (a) => {
				const fa = await fileToAttachment(a)
				return {
					filename: fa.filename,
					content: fa.content,
					disposition: 'attachment',
				}
			})
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSend.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSend.email.send(emailParams)
	}
}

export async function sendInvestmentCharin(
	to: string,
	subject: string,
	investment: RawInvestment,
	attachments: AttachmentDescriptor[] | null,
	cc: string[] = [],
	client?: {
		id?: string | null
		org_name?: string | null
		email?: string | null
	}
) {
	const accountLink = await buildAccountMagicLink(client, 'charin')
	const emailHtml = await render(
		<InvestmentsEmailCharin
			investment={normalizeInvestment(investment, false, undefined)}
			clientId={client?.id || client?.email || undefined}
			org_name={client?.org_name || null}
			accountLink={accountLink || undefined}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments: Attachment[] = await Promise.all(
			attachments.filter(Boolean).map(async (a) => {
				const fa = await fileToAttachment(a)
				return {
					filename: fa.filename,
					content: fa.content,
					disposition: 'attachment',
				}
			})
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap-charin.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSendCharIn.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap-charin.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSendCharIn.email.send(emailParams)
	}
}

export async function sendInvestmentTailored(
	to: string,
	subject: string,
	investment: RawInvestment,
	assessment: {
		relevance?: string | null
		next_steps?: string | null
	} | null,
	attachments: AttachmentDescriptor[] | null,
	cc: string[] = [],
	client?: {
		id?: string | null
		org_name?: string | null
		email?: string | null
	}
) {
	const accountLink = await buildAccountMagicLink(client, 'poe')
	const emailHtml = await render(
		<InvestmentsEmail
			investment={normalizeInvestment(investment, true, assessment)}
			assessment={assessment || null}
			clientId={client?.id || client?.email || undefined}
			org_name={client?.org_name || null}
			accountLink={accountLink || undefined}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments: Attachment[] = await Promise.all(
			attachments.map(async (a) => {
				const fa = await fileToAttachment(a)
				return {
					filename: fa.filename,
					content: fa.content,
					disposition: 'attachment',
				}
			})
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSend.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSend.email.send(emailParams)
	}
}

export async function sendInvestmentTailoredCharin(
	to: string,
	subject: string,
	investment: RawInvestment,
	assessment: {
		relevance?: string | null
		next_steps?: string | null
	} | null,
	attachments: AttachmentDescriptor[] | null,
	cc: string[] = [],
	client?: {
		id?: string | null
		org_name?: string | null
		email?: string | null
	}
) {
	const accountLink = await buildAccountMagicLink(client, 'charin')
	const emailHtml = await render(
		<InvestmentsEmailCharin
			investment={normalizeInvestment(investment, true, assessment)}
			assessment={assessment || null}
			clientId={client?.id || client?.email || undefined}
			org_name={client?.org_name || null}
			accountLink={accountLink || undefined}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments: Attachment[] = await Promise.all(
			attachments.map(async (a) => {
				const fa = await fileToAttachment(a)
				return {
					filename: fa.filename,
					content: fa.content,
					disposition: 'attachment',
				}
			})
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap-charin.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSendCharIn.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap-charin.com', 'POE'))
			.setTo([new Recipient(to)])
			.setCc((cc || []).map((addr) => new Recipient(addr)))
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSendCharIn.email.send(emailParams)
	}
}
