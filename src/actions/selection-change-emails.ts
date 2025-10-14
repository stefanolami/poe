import { createElement } from 'react'
import { createClient } from '@/supabase/server'
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { render } from '@react-email/components'
import SelectionPendingEmail from '@/components/emails/selection-changes/pending'
import SelectionReminderEmail from '@/components/emails/selection-changes/reminder'
import SelectionRollbackEmail from '@/components/emails/selection-changes/rollback'
import SelectionCommittedEmail from '@/components/emails/selection-changes/committed'

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

export async function sendSelectionPendingEmail(
	clientId: string,
	priceCents: number
) {
	const to = await getClientEmail(clientId)
	if (!to) return
	const html = await render(
		createElement(SelectionPendingEmail, { clientId, priceCents })
	)
	const params = new EmailParams()
		.setFrom(FROM)
		.setTo([new Recipient(to)])
		.setSubject('POE Selection Change - Pending')
		.setHtml(html)
	await mailer.email.send(params)
}

export async function sendSelectionReminderEmail(
	clientId: string,
	days: number
) {
	const to = await getClientEmail(clientId)
	if (!to) return
	const html = await render(
		createElement(SelectionReminderEmail, { clientId, days })
	)
	const params = new EmailParams()
		.setFrom(FROM)
		.setTo([new Recipient(to)])
		.setSubject('POE Selection Change - Reminder')
		.setHtml(html)
	await mailer.email.send(params)
}

export async function sendSelectionRollbackEmail(clientId: string) {
	const to = await getClientEmail(clientId)
	if (!to) return
	const html = await render(
		createElement(SelectionRollbackEmail, { clientId })
	)
	const params = new EmailParams()
		.setFrom(FROM)
		.setTo([new Recipient(to)])
		.setSubject('POE Selection Change - Rolled Back')
		.setHtml(html)
	await mailer.email.send(params)
}

export async function sendSelectionCommittedEmail(clientId: string) {
	const to = await getClientEmail(clientId)
	if (!to) return
	const html = await render(
		createElement(SelectionCommittedEmail, { clientId })
	)
	const params = new EmailParams()
		.setFrom(FROM)
		.setTo([new Recipient(to)])
		.setSubject('POE Selection Change - Committed')
		.setHtml(html)
	await mailer.email.send(params)
}
