'use client'

import { render } from '@react-email/render'
import { FormattedGrantType } from '@/lib/types'
import GrantsEmail from './grants-email'
import { useEffect, useState } from 'react'

const EmailPreviewComponent = ({
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
		<>
			{/* <div className="border rounded-lg p-4">
			<h3 className="text-lg font-semibold mb-4">Email Preview</h3>
			<div
				className="border border-gray-300 rounded bg-white"
				dangerouslySetInnerHTML={{ __html: emailHtml }}
			/>
		</div> */}
			<div
				className="w-full h-full"
				dangerouslySetInnerHTML={{ __html: emailHtml }}
			/>
		</>
	)
}

export default EmailPreviewComponent
