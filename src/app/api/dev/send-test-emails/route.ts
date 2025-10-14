import { NextResponse } from 'next/server'
import { render } from '@react-email/components'
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { createElement } from 'react'

// Selection Changes — default
import SelectionPendingEmail from '@/components/emails/selection-changes/pending'
import SelectionReminderEmail from '@/components/emails/selection-changes/reminder'
import SelectionRollbackEmail from '@/components/emails/selection-changes/rollback'
import SelectionCommittedEmail from '@/components/emails/selection-changes/committed'
// Selection Changes — CharIN
import SelectionPendingEmailCharin from '@/components/emails/selection-changes/pending-charin'
import SelectionReminderEmailCharin from '@/components/emails/selection-changes/reminder-charin'
import SelectionRollbackEmailCharin from '@/components/emails/selection-changes/rollback-charin'
import SelectionCommittedEmailCharin from '@/components/emails/selection-changes/committed-charin'

// Subscriptions — default
import PendingReminderEmail from '@/components/emails/subscriptions/pending-reminder'
import FreezeNoticeEmail from '@/components/emails/subscriptions/freeze-notice'
import AutoRenewInvoiceEmail from '@/components/emails/subscriptions/auto-renew-invoice'
// Subscriptions — CharIN
import PendingReminderEmailCharin from '@/components/emails/subscriptions/pending-reminder-charin'
import FreezeNoticeEmailCharin from '@/components/emails/subscriptions/freeze-notice-charin'
import AutoRenewInvoiceEmailCharin from '@/components/emails/subscriptions/auto-renew-invoice-charin'

const mailer = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY || '' })
const FROM = new Sender('alerts@poeontap.com', 'POE')

export async function GET(request: Request) {
	try {
		const url = new URL(request.url)
		const to = url.searchParams.get('to') || 'stefanolami90@gmail.com'
		const secret = url.searchParams.get('secret')
		const requiredSecret = process.env.EMAIL_TEST_SECRET

		// Simple guard: require secret in production; allow open in dev when no secret set
		const isDev = process.env.NODE_ENV !== 'production'
		if (
			(requiredSecret && secret !== requiredSecret) ||
			(!isDev && !requiredSecret)
		) {
			return NextResponse.json(
				{ ok: false, error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		if (!process.env.MAILERSEND_API_KEY) {
			return NextResponse.json(
				{ ok: false, error: 'MAILERSEND_API_KEY not configured' },
				{ status: 400 }
			)
		}

		const clientId = 'client_TEST123'
		const org_name = 'ACME'
		const priceCents = 129900
		const days = 3
		const subscriptionId = 'sub_ABC123'
		const accountLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.poeontap.com'}/account?token=TEST`

		type Item = { subject: string; html: string }
		const items: Item[] = []

		// Helper to push rendered email
		const add = async (subject: string, element: React.ReactElement) => {
			const html = await render(element)
			items.push({ subject, html })
		}

		// Selection Changes — default
		await add(
			'[POE][Default] Selection Change Pending',
			createElement(SelectionPendingEmail, {
				clientId,
				priceCents,
				org_name,
				accountLink,
			})
		)
		await add(
			'[POE][Default] Selection Change Reminder',
			createElement(SelectionReminderEmail, {
				clientId,
				days,
				org_name,
				accountLink,
			})
		)
		await add(
			'[POE][Default] Selection Change Rolled Back',
			createElement(SelectionRollbackEmail, {
				clientId,
				org_name,
				accountLink,
			})
		)
		await add(
			'[POE][Default] Selection Change Committed',
			createElement(SelectionCommittedEmail, {
				clientId,
				org_name,
				accountLink,
			})
		)

		// Selection Changes — CharIN
		await add(
			'[POE][CharIN] Selection Change Pending',
			createElement(SelectionPendingEmailCharin, {
				clientId,
				priceCents,
				org_name,
				accountLink,
			})
		)
		await add(
			'[POE][CharIN] Selection Change Reminder',
			createElement(SelectionReminderEmailCharin, {
				clientId,
				days,
				org_name,
				accountLink,
			})
		)
		await add(
			'[POE][CharIN] Selection Change Rolled Back',
			createElement(SelectionRollbackEmailCharin, {
				clientId,
				org_name,
				accountLink,
			})
		)
		await add(
			'[POE][CharIN] Selection Change Committed',
			createElement(SelectionCommittedEmailCharin, {
				clientId,
				org_name,
				accountLink,
			})
		)

		// Subscriptions — default
		await add(
			'[POE][Default] Subscription Pending Reminder',
			createElement(PendingReminderEmail, {
				clientId,
				days,
				org_name,
				accountLink,
			})
		)
		await add(
			'[POE][Default] Account Freeze Notice',
			createElement(FreezeNoticeEmail, {
				clientId,
				org_name,
				accountLink,
			})
		)
		await add(
			'[POE][Default] Auto-Renew Invoice',
			createElement(AutoRenewInvoiceEmail, {
				clientId,
				subscriptionId,
				org_name,
				accountLink,
			})
		)

		// Subscriptions — CharIN
		await add(
			'[POE][CharIN] Subscription Pending Reminder',
			createElement(PendingReminderEmailCharin, {
				clientId,
				days,
				org_name,
				accountLink,
			})
		)
		await add(
			'[POE][CharIN] Account Freeze Notice',
			createElement(FreezeNoticeEmailCharin, {
				clientId,
				org_name,
				accountLink,
			})
		)
		await add(
			'[POE][CharIN] Auto-Renew Invoice',
			createElement(AutoRenewInvoiceEmailCharin, {
				clientId,
				subscriptionId,
				org_name,
				accountLink,
			})
		)

		// Send all emails sequentially
		const results: {
			subject: string
			status: 'sent' | 'failed'
			error?: string
		}[] = []
		for (const item of items) {
			try {
				const params = new EmailParams()
					.setFrom(FROM)
					.setTo([new Recipient(to)])
					.setSubject(item.subject)
					.setHtml(item.html)
				await mailer.email.send(params)
				results.push({ subject: item.subject, status: 'sent' })
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err)
				results.push({
					subject: item.subject,
					status: 'failed',
					error: message,
				})
			}
		}

		return NextResponse.json({
			ok: true,
			to,
			count: results.length,
			results,
		})
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err)
		return NextResponse.json({ ok: false, error: message }, { status: 500 })
	}
}
