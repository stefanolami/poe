'use server'

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import GrantsEmail from '@/components/emails/grants-email'
import GrantsEmailTailored from '@/components/emails/grants-email-tailored'
import GrantsEmailTailoredCharIn from '@/components/emails/grants-email-tailored-charin'
import GrantsEmailCharIn from '@/components/emails/grants-email-charin'
import TendersEmailCharIn from '@/components/emails/tenders-email-charin'
import { render } from '@react-email/components'
import { fileToAttachment } from '@/lib/utils'
import AccountRecapEmail from '@/components/emails/account-recap'

const mailerSend = new MailerSend({
	apiKey: process.env.MAILERSEND_API_KEY || '',
})

export async function sendGrant(to, subject, grant, attachments, cc = []) {
	const emailHtml = await render(<GrantsEmail grant={grant} />)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.filter(Boolean).map((a) => fileToAttachment(a))
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

export async function sendGrantCharIn(
	to,
	subject,
	grant,
	attachments,
	cc = []
) {
	const emailHtml = await render(<GrantsEmailCharIn grant={grant} />)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.filter(Boolean).map((a) => fileToAttachment(a))
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

export async function sendGrantTailored(
	to,
	subject,
	grant,
	assessment,
	attachments,
	cc = []
) {
	const emailHtml = await render(
		<GrantsEmailTailored
			grant={grant}
			assessment={assessment}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.filter(Boolean).map((a) => fileToAttachment(a))
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

export async function sendGrantTailoredCharIn(
	to,
	subject,
	grant,
	assessment,
	attachments,
	cc = []
) {
	const emailHtml = await render(
		<GrantsEmailTailoredCharIn
			grant={grant}
			assessment={assessment}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.filter(Boolean).map((a) => fileToAttachment(a))
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

function mapTenderToEmailProps(tender, tailored = false, assessment, client) {
	const mapDeadline = (arr) =>
		Array.isArray(arr)
			? arr.map((d) => {
					if (Array.isArray(d)) return d
					if (typeof d === 'string') return d.split('///')
					return []
				})
			: []
	const mapFurther = (arr) =>
		Array.isArray(arr)
			? arr.map((r) => (typeof r === 'string' ? r.split('///') : r))
			: []
	const props = {
		geography: tender.geography,
		awarding_authority: tender.awarding_authority,
		programme: tender.programme,
		programme_purpose: tender.programme_purpose,
		instrument_type: tender.instrument_type,
		alert_purpose: tender.alert_purpose,
		in_brief: tender.in_brief,
		deadline: mapDeadline(tender.deadline),
		further_details: mapFurther(tender.further_details),
		tailored: !!tailored,
		// pass client metadata through for display in template header
		clientId: client?.id || client?.email || undefined,
		org_name: client?.org_name || null,
	}
	if (tailored && assessment) {
		props.relevance = assessment.relevance || null
		props.next_steps = assessment.next_steps || null
	}
	return props
}

export async function sendTender(
	to,
	subject,
	tender,
	attachments,
	cc = [],
	client
) {
	const emailHtml = await render(
		<TendersEmailCharIn
			{...mapTenderToEmailProps(tender, false, undefined, client)}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.filter(Boolean).map((a) => fileToAttachment(a))
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

export async function sendTenderCharIn(
	to,
	subject,
	tender,
	attachments,
	cc = [],
	client
) {
	const emailHtml = await render(
		<TendersEmailCharIn
			{...mapTenderToEmailProps(tender, false, undefined, client)}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.filter(Boolean).map((a) => fileToAttachment(a))
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

export async function sendTenderTailored(
	to,
	subject,
	tender,
	assessment,
	attachments,
	cc = [],
	client
) {
	const emailHtml = await render(
		<TendersEmailCharIn
			{...mapTenderToEmailProps(tender, true, assessment, client)}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.map((a) => fileToAttachment(a))
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

export async function sendTenderTailoredCharIn(
	to,
	subject,
	tender,
	assessment,
	attachments,
	cc = [],
	client
) {
	const emailHtml = await render(
		<TendersEmailCharIn
			{...mapTenderToEmailProps(tender, true, assessment, client)}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			attachments.map((a) => fileToAttachment(a))
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

export async function sendAccountRecap(to, data, total, id) {
	const emailHtml = await render(
		<AccountRecapEmail
			data={data}
			total={total}
			id={id}
		/>
	)
	const emailParams = new EmailParams()
		.setFrom(new Sender('alerts@poeontap.com', 'POE'))
		.setTo([new Recipient(to)])
		.setSubject('POE - Your Account Recap')
		.setHtml(emailHtml)
	return await mailerSend.email.send(emailParams)
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
