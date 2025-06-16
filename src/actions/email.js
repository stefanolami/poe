'use server'

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import GrantsEmail from '@/components/emails/grants-email'
import GrantsEmailTailored from '@/components/emails/grants-email-tailored'
import GrantsEmailTailoredCharIn from '@/components/emails/grants-email-tailored-charin'
import GrantsEmailCharIn from '@/components/emails/grants-email-charin'
import { render } from '@react-email/components'
import { fileToAttachment } from '@/lib/utils'

const mailerSend = new MailerSend({
	apiKey: process.env.MAILERSEND_API_KEY || '',
})

export async function sendGrant(to, subject, grant, attachments) {
	const emailHtml = await render(<GrantsEmail grant={grant} />)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.map((a) => fileToAttachment(a))
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSend.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSend.email.send(emailParams)
	}
}

export async function sendGrantCharIn(to, subject, grant, attachments) {
	const emailHtml = await render(<GrantsEmailCharIn grant={grant} />)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.map((a) => fileToAttachment(a))
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSend.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSend.email.send(emailParams)
	}
}

export async function sendGrantTailored(
	to,
	subject,
	grant,
	assessment,
	attachments
) {
	const emailHtml = await render(
		<GrantsEmailTailored
			grant={grant}
			assessment={assessment}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.map((a) => fileToAttachment(a))
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSend.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSend.email.send(emailParams)
	}
}

export async function sendGrantTailoredCharIn(
	to,
	subject,
	grant,
	assessment,
	attachments
) {
	const emailHtml = await render(
		<GrantsEmailTailoredCharIn
			grant={grant}
			assessment={assessment}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.map((a) => fileToAttachment(a))
		)
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setSubject(subject)
			.setHtml(emailHtml)
			.setAttachments(bufferAttachments)
		return await mailerSend.email.send(emailParams)
	} else {
		const emailParams = new EmailParams()
			.setFrom(new Sender('alerts@poeontap.com', 'POE'))
			.setTo([new Recipient(to)])
			.setSubject(subject)
			.setHtml(emailHtml)
		return await mailerSend.email.send(emailParams)
	}
}

/* export async function sendGrantBatch(recipients, subject, grant, attachments) {
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

	const results = await mailerSend.email.sendBulk(bulkEmails)
	console.log('Sending bulk emails:', results)
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

	const results = await mailerSend.email.sendBulk(bulkEmails)
	return results
} */
