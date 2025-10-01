'use server'

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import GrantsEmail from '@/components/emails/grants-email'
import GrantsEmailTailored from '@/components/emails/grants-email-tailored'
import GrantsEmailTailoredCharin from '@/components/emails/grants-email-tailored-charin'
import GrantsEmailCharin from '@/components/emails/grants-email-charin'
import TendersEmailCharin from '@/components/emails/tenders-email-charin'
import InvestmentsEmailCharin from '@/components/emails/investments-email-charin'
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

export async function sendGrantCharin(
	to,
	subject,
	grant,
	attachments,
	cc = [],
	client
) {
	const emailHtml = await render(
		<GrantsEmailCharin
			grant={grant}
			clientId={client?.id || client?.email}
			org_name={client?.org_name || null}
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

export async function sendGrantTailoredCharin(
	to,
	subject,
	grant,
	assessment,
	attachments,
	cc = []
) {
	const emailHtml = await render(
		<GrantsEmailTailoredCharin
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
		call_title: tender.call_title,
		geography_details: tender.geography_details,
		awarding_authority: tender.awarding_authority,
		programme_title: tender.programme_title,
		value: tender.value,
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

function mapInvestmentToEmailProps(
	investment,
	tailored = false,
	assessment,
	client
) {
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
		investment,
		// also flatten the core fields for consistency with grants/tenders charin
		geography: investment.geography,
		call_title: investment.call_title,
		geography_details: investment.geography_details,
		awarding_authority: investment.awarding_authority,
		programme_title: investment.programme_title,
		value: investment.value,
		programme_purpose: investment.programme_purpose,
		instrument_type: investment.instrument_type,
		alert_purpose: investment.alert_purpose,
		in_brief: investment.in_brief,
		deadline: mapDeadline(investment.deadline),
		further_details: mapFurther(investment.further_details),
		tailored: !!tailored,
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
		<TendersEmailCharin
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

export async function sendTenderCharin(
	to,
	subject,
	tender,
	attachments,
	cc = [],
	client
) {
	const emailHtml = await render(
		<TendersEmailCharin
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
		<TendersEmailCharin
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

export async function sendTenderTailoredCharin(
	to,
	subject,
	tender,
	assessment,
	attachments,
	cc = [],
	client
) {
	const emailHtml = await render(
		<TendersEmailCharin
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

// Investments email senders (CharIN template)
export async function sendInvestment(
	to,
	subject,
	investment,
	attachments,
	cc = [],
	client
) {
	const emailHtml = await render(
		<InvestmentsEmailCharin
			{...mapInvestmentToEmailProps(investment, false, undefined, client)}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			(attachments || []).filter(Boolean).map((a) => fileToAttachment(a))
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
	to,
	subject,
	investment,
	attachments,
	cc = [],
	client
) {
	return await sendInvestment(
		to,
		subject,
		investment,
		attachments,
		cc,
		client
	)
}

export async function sendInvestmentTailored(
	to,
	subject,
	investment,
	assessment,
	attachments,
	cc = [],
	client
) {
	const emailHtml = await render(
		<InvestmentsEmailCharin
			{...mapInvestmentToEmailProps(investment, true, assessment, client)}
		/>
	)
	if (attachments && attachments.length > 0) {
		const bufferAttachments = await Promise.all(
			(attachments || []).map((a) => fileToAttachment(a))
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
	to,
	subject,
	investment,
	assessment,
	attachments,
	cc = [],
	client
) {
	return await sendInvestmentTailored(
		to,
		subject,
		investment,
		assessment,
		attachments,
		cc,
		client
	)
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
