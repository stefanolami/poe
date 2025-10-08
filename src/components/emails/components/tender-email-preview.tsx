'use client'

import { render } from '@react-email/render'
import { FormattedTenderType } from '@/lib/types'
import { useEffect, useState } from 'react'
import TendersEmail from '../opportunities/tenders-email'

const TenderEmailPreviewComponent = ({
	emailData,
}: {
	emailData: FormattedTenderType
}) => {
	const [emailHtml, setEmailHtml] = useState<string>('')

	useEffect(() => {
		const generatePreview = async () => {
			// Normalize values to string[] expected by the template
			const deadlineStrings: string[] = (emailData.deadline || []).map(
				(d) =>
					Array.isArray(d)
						? `${d[0] || ''}///${d[1] || ''}///${d[2] || ''}`
						: String(d)
			)

			const furtherDetailsStrings: string[] = Array.isArray(
				emailData.further_details
			)
				? (emailData.further_details as unknown as string[])
				: []

			const previewTender = {
				...emailData,
				deadline: deadlineStrings,
				further_details: furtherDetailsStrings,
			}

			const html = await render(
				<TendersEmail
					tender={previewTender}
					clientId={'1234-5678'}
					org_name={'Acme'}
				/>
			)
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

export default TenderEmailPreviewComponent
