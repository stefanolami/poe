'use server'

import { Resend } from 'resend'
//import Email1 from '@/components/emails/email-1'
import GrantsEmail from '@/components/emails/grants-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(to, subject, grant, attachments) {
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
