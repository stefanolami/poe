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
			const toTuple = (
				val: string | [string, string, string]
			): [string, string, string] => {
				if (Array.isArray(val)) return val
				const parts = val.split('///')
				return [parts[0] || '', parts[1] || '', parts[2] || '']
			}

			const deadlineTuples: [string, string, string][] = (
				emailData.deadline || []
			).map((d) => toTuple(d as unknown as string))

			const furtherDetailsRaw: string[] = Array.isArray(
				emailData.further_details
			)
				? (emailData.further_details as unknown as string[])
				: []
			const furtherDetailsTuples: [string, string, string][] =
				furtherDetailsRaw.map((r) => {
					const parts = (r || '').split('///')
					return [parts[0] || '', parts[1] || '', parts[2] || ''] as [
						string,
						string,
						string,
					]
				})

			const html = await render(
				<TendersEmailCharin
					clientId={'1234-5678'}
					org_name={'Acme'}
					geography={emailData.geography}
					awarding_authority={emailData.awarding_authority}
					programme={emailData.programme}
					alert_purpose={emailData.alert_purpose}
					programme_purpose={emailData.programme_purpose}
					instrument_type={emailData.instrument_type}
					in_brief={emailData.in_brief}
					deadline={deadlineTuples}
					further_details={furtherDetailsTuples}
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
