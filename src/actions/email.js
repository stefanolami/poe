'use server'

import { Resend } from 'resend'
import Email1 from '@/components/emails/email-1'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(to, subject) {
	return await resend.emails.send({
		from: 'Stefano <stefanolami90@stefanolami.com>',
		to,
		subject,
		react: <Email1 text="ciao bello" />,
	})
}
