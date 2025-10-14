import { createElement } from 'react'
import { createClient, createAdminClient } from '@/supabase/server'
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { render } from '@react-email/components'
import SelectionPendingEmail from '@/components/emails/selection-changes/pending'
import SelectionReminderEmail from '@/components/emails/selection-changes/reminder'
import SelectionRollbackEmail from '@/components/emails/selection-changes/rollback'
import SelectionCommittedEmail from '@/components/emails/selection-changes/committed'

const mailer = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY || '' })
const FROM = new Sender('alerts@poeontap.com', 'POE')

type ClientContact = { email: string | null; org_name: string | null }

async function getClientContact(clientId: string): Promise<ClientContact> {
	const supabase = await createClient()
	const { data } = await supabase
		.from('clients')
		.select('email, org_name')
		.eq('id', clientId)
		.single()
	return {
		email: data?.email ?? null,
		org_name: (data?.org_name as string | null) ?? null,
	}
}

async function generateAccountLink(email: string): Promise<string | null> {
	try {
		const supabase = await createAdminClient()
		// Redirect to the account page after magic-link sign-in
		const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.poeontap.com'}/account`
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
		// supabase-js v2 returns data.properties.action_link
		// Fallback to redirectTo if not present
		const properties = (
			data as unknown as { properties?: { action_link?: string } }
		)?.properties
		const link = properties?.action_link
		return link || redirectTo
	} catch {
		return null
	}
}

export async function sendSelectionPendingEmail(
	clientId: string,
	priceCents: number
) {
	const { email: to, org_name } = await getClientContact(clientId)
	if (!to) return
	const accountLink = await generateAccountLink(to)
	const html = await render(
		createElement(SelectionPendingEmail, {
			clientId,
			priceCents,
			org_name,
			accountLink: accountLink || undefined,
		})
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
	const { email: to, org_name } = await getClientContact(clientId)
	if (!to) return
	const accountLink = await generateAccountLink(to)
	const html = await render(
		createElement(SelectionReminderEmail, {
			clientId,
			days,
			org_name,
			accountLink: accountLink || undefined,
		})
	)
	const params = new EmailParams()
		.setFrom(FROM)
		.setTo([new Recipient(to)])
		.setSubject('POE Selection Change - Reminder')
		.setHtml(html)
	await mailer.email.send(params)
}

export async function sendSelectionRollbackEmail(clientId: string) {
	const { email: to, org_name } = await getClientContact(clientId)
	if (!to) return
	const accountLink = await generateAccountLink(to)
	const html = await render(
		createElement(SelectionRollbackEmail, {
			clientId,
			org_name,
			accountLink: accountLink || undefined,
		})
	)
	const params = new EmailParams()
		.setFrom(FROM)
		.setTo([new Recipient(to)])
		.setSubject('POE Selection Change - Rolled Back')
		.setHtml(html)
	await mailer.email.send(params)
}

export async function sendSelectionCommittedEmail(clientId: string) {
	const { email: to, org_name } = await getClientContact(clientId)
	if (!to) return
	const accountLink = await generateAccountLink(to)
	const html = await render(
		createElement(SelectionCommittedEmail, {
			clientId,
			org_name,
			accountLink: accountLink || undefined,
		})
	)
	const params = new EmailParams()
		.setFrom(FROM)
		.setTo([new Recipient(to)])
		.setSubject('POE Selection Change - Committed')
		.setHtml(html)
	await mailer.email.send(params)
}
