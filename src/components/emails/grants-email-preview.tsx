'use client'

import { render } from '@react-email/render'
import { FormattedGrantType } from '@/lib/types'
import { useEffect, useState } from 'react'
import GrantsEmailCharIn from './grants-email-charin'

const GrantsEmailPreviewComponent = ({
	emailData,
}: {
	emailData: FormattedGrantType
}) => {
	const [emailHtml, setEmailHtml] = useState<string>('')

	useEffect(() => {
		const generatePreview = async () => {
			const html = await render(<GrantsEmailCharIn grant={emailData} />)
			setEmailHtml(html)
		}
		generatePreview()
	}, [emailData])

	return (
		<div
			className="w-full h-full"
			dangerouslySetInnerHTML={{ __html: emailHtml }}
		/>
	)
}

export default GrantsEmailPreviewComponent
