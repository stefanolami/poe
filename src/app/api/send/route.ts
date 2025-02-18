import { EmailTemplate } from '@/components/email-template'
import { ReactNode } from 'react'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
	try {
		const { data, error } = await resend.emails.send({
			from: 'no-reply@stefanolami.com',
			to: ['stefanolami90@gmail.com'],
			subject: 'Hello world',
			react: EmailTemplate({ firstName: 'John' }) as React.ReactElement,
		})

		if (error) {
			return Response.json({ error }, { status: 500 })
		}

		return Response.json({ data })
	} catch (error) {
		return Response.json({ error }, { status: 500 })
	}
}
