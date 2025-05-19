'use server'

import { Resend } from 'resend'
//import Email1 from '@/components/emails/email-1'
import GrantsEmail from '@/components/emails/grants-email'
import GrantsEmailTailored from '@/components/emails/grants-email-tailored'

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
