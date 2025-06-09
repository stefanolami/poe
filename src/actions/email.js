'use server'

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import GrantsEmail from '@/components/emails/grants-email'
import GrantsEmailTailored from '@/components/emails/grants-email-tailored'
import GrantsEmailTailoredCharin from '@/components/emails/grants-email-tailored-charin'
import GrantsEmailCharin from '@/components/emails/grants-email-charin'
import { render } from '@react-email/components'

const mailerSend = new MailerSend({
	apiKey: process.env.MAILERSEND_API_KEY || '',
})

export async function sendGrant(to, subject, grant, attachments) {
	if (attachments) {
		return await resend.emails.send({
			from: 'POE <alerts@poeontap.com>',
			to,
			subject,
			react: <GrantsEmail grant={grant} />,
			attachments: attachments.filter(Boolean),
		})
	} else {
		return await resend.emails.send({
			from: 'POE <alerts@poeontap.com>',
			to,
			subject,
			react: <GrantsEmail grant={grant} />,
		})
	}
}

export async function sendGrantTailored(
	to,
	subject,
	grant,
	assessment,
	attachments
) {
	if (attachments) {
		return await resend.emails.send({
			from: 'POE <alerts@poeontap.com>',
			to,
			subject,
			react: (
				<GrantsEmailTailored
					grant={grant}
					assessment={assessment}
				/>
			),
			attachments: attachments.filter(Boolean),
		})
	} else {
		return await resend.emails.send({
			from: 'POE <alerts@poeontap.com>',
			to,
			subject,
			react: (
				<GrantsEmailTailored
					grant={grant}
					assessment={assessment}
				/>
			),
		})
	}
}

export async function sendGrantBatch(recipients, subject, grant, attachments) {
	const bulkEmails = []
	const emailHtml = await render(<GrantsEmailCharin grant={grant} />)
	if (attachments && attachments.length > 0) {
		for (const to of recipients) {
			const emailParams = new EmailParams()
				.setFrom(new Sender('alerts@poeontap.com', 'POE'))
				.setTo(new Recipient(to))
				.setSubject(subject)
				.setHtml(emailHtml)
				.setAttachments(attachments.filter(Boolean))

			bulkEmails.push(emailParams)
		}
	} else {
		for (const to of recipients) {
			const emailParams = new EmailParams()
				.setFrom(new Sender('alerts@poeontap.com', 'POE'))
				.setTo(new Recipient(to))
				.setSubject(subject)
				.setHtml(emailHtml)

			bulkEmails.push(emailParams)
		}
	}

	const results = await mailerSend.sendBulk(bulkEmails)
	return results
}

export async function sendGrantTailoredBatch(
	recipients,
	subject,
	grant,
	assessments,
	attachments
) {
	const bulkEmails = []
	if (attachments && attachments.length > 0) {
		for (let i = 0; i < recipients.length; i++) {
			const to = recipients[i]
			const emailHtml = await render(
				<GrantsEmailTailoredCharin
					grant={grant}
					assessment={assessments[i]}
				/>
			)
			const emailParams = new EmailParams()
				.setFrom(new Sender('alerts@poeontap.com', 'POE'))
				.setTo(new Recipient(to))
				.setSubject(subject)
				.setHtml(emailHtml)
				.setAttachments(attachments.filter(Boolean))

			bulkEmails.push(emailParams)
		}
	} else {
		for (let i = 0; i < recipients.length; i++) {
			const to = recipients[i]
			const emailHtml = await render(
				<GrantsEmailTailoredCharin
					grant={grant}
					assessment={assessments[i]}
				/>
			)
			const emailParams = new EmailParams()
				.setFrom(new Sender('alerts@poeontap.com', 'POE'))
				.setTo(new Recipient(to))
				.setSubject(subject)
				.setHtml(emailHtml)

			bulkEmails.push(emailParams)
		}
	}

	const results = await mailerSend.sendBulk(bulkEmails)
	return results
}
