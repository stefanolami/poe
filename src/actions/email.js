'use server'

import { Resend } from 'resend'
//import Email1 from '@/components/emails/email-1'
import GrantsEmail from '@/components/emails/grants-email'
import GrantsEmailTailored from '@/components/emails/grants-email-tailored'
import GrantsEmailTailoredCharin from '@/components/emails/grants-email-tailored-charin'
import GrantsEmailCharin from '@/components/emails/grants-email-charin'

const resend = new Resend(process.env.RESEND_API_KEY)

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
	return await Promise.all(
		recipients.map((to) =>
			resend.emails.send({
				from: 'POE <alerts@poeontap.com>',
				to,
				subject,
				react: <GrantsEmailCharin grant={grant} />,
				...(attachments && attachments.length > 0
					? { attachments: attachments.filter(Boolean) }
					: {}),
			})
		)
	)
}

export async function sendGrantTailoredBatch(
	recipients,
	subject,
	grant,
	assessments,
	attachments
) {
	return await Promise.all(
		recipients.map((to, idx) =>
			resend.emails.send({
				from: 'POE <alerts@poeontap.com>',
				to,
				subject,
				react: (
					<GrantsEmailTailoredCharin
						grant={grant}
						assessment={assessments[idx]}
					/>
				),
				...(attachments && attachments.length > 0
					? { attachments: attachments.filter(Boolean) }
					: {}),
			})
		)
	)
}
