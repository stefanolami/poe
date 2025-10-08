'use client'

import { render } from '@react-email/render'
import { FormattedGrantType } from '@/lib/types'
import { useEffect, useState } from 'react'
import GrantsEmailCharin from '../opportunities/grants-email-charin'

const GrantsEmailPreviewComponent = ({
	emailData,
}: {
	emailData: FormattedGrantType
}) => {
	const [emailHtml, setEmailHtml] = useState<string>('')

	useEffect(() => {
		const generatePreview = async () => {
			const html = await render(<GrantsEmailCharin grant={emailData} />)
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
