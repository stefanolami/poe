'use client'

import { render } from '@react-email/render'
import { FormattedTenderType } from '@/lib/types'
import { useEffect, useState } from 'react'
import TendersEmailCharin from './tenders-email-charin'

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

			const html = await render(
				<TendersEmailCharin
					clientId={'1234-5678'}
					org_name={'Acme'}
					call_title={emailData.call_title}
					geography_details={emailData.geography_details}
					value={emailData.value ?? undefined}
					geography={emailData.geography}
					awarding_authority={
						emailData.awarding_authority ?? undefined
					}
					programme_title={emailData.programme_title ?? ''}
					alert_purpose={emailData.alert_purpose ?? undefined}
					programme_purpose={emailData.programme_purpose ?? undefined}
					instrument_type={emailData.instrument_type ?? undefined}
					in_brief={emailData.in_brief ?? undefined}
					deadline={deadlineStrings}
					further_details={furtherDetailsStrings}
					tailored={false}
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
