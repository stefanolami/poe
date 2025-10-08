'use client'

import { render } from '@react-email/render'
import { FormattedGrantType } from '@/lib/types'
import { useEffect, useState } from 'react'
import GrantsEmail from '../opportunities/grants-email'

const GrantsEmailPreviewComponent = ({
	emailData,
}: {
	emailData: FormattedGrantType
}) => {
	const [emailHtml, setEmailHtml] = useState<string>('')

	useEffect(() => {
		const generatePreview = async () => {
			const html = await render(<GrantsEmail grant={emailData} />)
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
