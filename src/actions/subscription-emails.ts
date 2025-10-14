import { createElement } from 'react'
import { createClient } from '@/supabase/server'
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { render } from '@react-email/components'
import AutoRenewInvoiceEmail from '@/components/emails/subscriptions/auto-renew-invoice'
import FreezeNoticeEmail from '@/components/emails/subscriptions/freeze-notice'
import PendingReminderEmail from '@/components/emails/subscriptions/pending-reminder'

const mailer = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY || '' })
const FROM = new Sender('alerts@poeontap.com', 'POE')

async function getClientEmail(clientId: string): Promise<string | null> {
	const supabase = await createClient()
	const { data } = await supabase
		.from('clients')
		.select('email')
		.eq('id', clientId)
		.single()
	return data?.email ?? null
}

export async function sendAutoRenewInvoiceEmail(
	clientId: string,
	previousSubscriptionId: string
): Promise<void> {
	const to = await getClientEmail(clientId)
	if (!to) return
	const html = await render(
		createElement(AutoRenewInvoiceEmail, {
			clientId,
			subscriptionId: previousSubscriptionId,
		})
	)
	const params = new EmailParams()
		.setFrom(FROM)
		.setTo([new Recipient(to)])
		.setSubject('POE Subscription Renewal - Payment Needed')
		.setHtml(html)
	await mailer.email.send(params)
}

export async function sendFreezeEmail(clientId: string): Promise<void> {
	const to = await getClientEmail(clientId)
	if (!to) return
	const html = await render(createElement(FreezeNoticeEmail, { clientId }))
	const params = new EmailParams()
		.setFrom(FROM)
		.setTo([new Recipient(to)])
		.setSubject('POE Account Frozen')
		.setHtml(html)
	await mailer.email.send(params)
}

export async function sendReminderEmail(
	clientId: string,
	days: number
): Promise<void> {
	const to = await getClientEmail(clientId)
	if (!to) return
	const html = await render(
		createElement(PendingReminderEmail, { clientId, days })
	)
	const params = new EmailParams()
		.setFrom(FROM)
		.setTo([new Recipient(to)])
		.setSubject('POE Payment Reminder')
		.setHtml(html)
	await mailer.email.send(params)
}
