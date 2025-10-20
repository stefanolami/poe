import { createElement } from 'react'
import { createClient, createAdminClient } from '@/supabase/server'
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { resolveBrand, brandSiteBase, brandEmailAddress } from '@/lib/utils'
import { render } from '@react-email/components'
import AutoRenewInvoiceEmail from '@/components/emails/subscriptions/auto-renew-invoice'
import FreezeNoticeEmail from '@/components/emails/subscriptions/freeze-notice'
import PendingReminderEmail from '@/components/emails/subscriptions/pending-reminder'

const mailerPOE = new MailerSend({
	apiKey: process.env.MAILERSEND_API_KEY || '',
})
const mailerCharin = new MailerSend({
	apiKey: process.env.MAILERSEND_CHARIN_API_KEY || '',
})

// brand helpers now imported from utils

function pickMailer(brand: 'poe' | 'charin') {
	return brand === 'charin' ? mailerCharin : mailerPOE
}

type ClientContact = {
	email: string | null
	org_name: string | null
	referrer?: string | null
}

async function getClientContact(clientId: string): Promise<ClientContact> {
	const supabase = await createClient()
	const { data } = await supabase
		.from('clients')
		.select('email, org_name, referrer')
		.eq('id', clientId)
		.single()
	return {
		email: data?.email ?? null,
		org_name: (data?.org_name as string | null) ?? null,
		referrer: (data?.referrer as string | null) ?? null,
	}
}

async function generateAccountLink(
	email: string,
	brand: 'poe' | 'charin'
): Promise<string | null> {
	try {
		const supabase = await createAdminClient()
		const siteBase = brandSiteBase(brand)
		const redirectTo = `${siteBase}/account`
		const adminAny = (
			supabase as unknown as {
				auth: {
					admin: {
						generateLink: (
							args: unknown
						) => Promise<{ data: unknown; error: unknown }>
					}
				}
			}
		).auth.admin
		const { data, error } = await adminAny.generateLink({
			type: 'magiclink',
			email,
			options: { redirectTo },
		})
		if (error) return null
		const properties = (
			data as unknown as { properties?: { action_link?: string } }
		)?.properties
		const link = properties?.action_link
		return link || redirectTo
	} catch {
		return null
	}
}

export async function sendAutoRenewInvoiceEmail(
	clientId: string,
	previousSubscriptionId: string
): Promise<void> {
	const { email: to, org_name, referrer } = await getClientContact(clientId)
	if (!to) return
	const brand = resolveBrand(referrer)
	const accountLink = await generateAccountLink(to, brand)
	const html = await render(
		createElement(AutoRenewInvoiceEmail, {
			clientId,
			subscriptionId: previousSubscriptionId,
			org_name,
			accountLink: accountLink || undefined,
		})
	)
	const params = new EmailParams()
		.setFrom(new Sender(brandEmailAddress(brand, 'noreply'), 'POE'))
		.setTo([new Recipient(to)])
		.setSubject('POE Subscription Renewal - Payment Needed')
		.setHtml(html)
	await pickMailer(brand).email.send(params)
}

export async function sendFreezeEmail(clientId: string): Promise<void> {
	const { email: to, org_name, referrer } = await getClientContact(clientId)
	if (!to) return
	const brand = resolveBrand(referrer)
	const accountLink = await generateAccountLink(to, brand)
	const html = await render(
		createElement(FreezeNoticeEmail, {
			clientId,
			org_name,
			accountLink: accountLink || undefined,
		})
	)
	const params = new EmailParams()
		.setFrom(new Sender(brandEmailAddress(brand, 'noreply'), 'POE'))
		.setTo([new Recipient(to)])
		.setSubject('POE Account Frozen')
		.setHtml(html)
	await pickMailer(brand).email.send(params)
}

export async function sendReminderEmail(
	clientId: string,
	days: number
): Promise<void> {
	const { email: to, org_name, referrer } = await getClientContact(clientId)
	if (!to) return
	const brand = resolveBrand(referrer)
	const accountLink = await generateAccountLink(to, brand)
	const html = await render(
		createElement(PendingReminderEmail, {
			clientId,
			days,
			org_name,
			accountLink: accountLink || undefined,
		})
	)
	const params = new EmailParams()
		.setFrom(new Sender(brandEmailAddress(brand, 'noreply'), 'POE'))
		.setTo([new Recipient(to)])
		.setSubject('POE Payment Reminder')
		.setHtml(html)
	await pickMailer(brand).email.send(params)
}
