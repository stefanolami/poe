'use server'

import { Resend } from 'resend'
//import Email1 from '@/components/emails/email-1'
import EmailTest from '@/components/emails/email-test'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(to, subject, text) {
	return await resend.emails.send({
		from: 'Stefano <stefanolami90@stefanolami.com>',
		to,
		subject,
		react: <EmailTest text={text} />,
	})
}
