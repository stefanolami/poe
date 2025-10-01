'use client'

import { render } from '@react-email/render'
import { FormattedInvestmentType } from '@/lib/types'
import { useEffect, useState } from 'react'
import InvestmentsEmailCharin from './investments-email-charin'

const InvestmentsEmailPreviewComponent = ({
	emailData,
}: {
	emailData: FormattedInvestmentType
}) => {
	const [emailHtml, setEmailHtml] = useState<string>('')

	useEffect(() => {
		const generatePreview = async () => {
			const html = await render(
				<InvestmentsEmailCharin
					investment={emailData}
					clientId={'1234-5678'}
					org_name={'Acme'}
					tailored={false}
				/>
			)
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

export default InvestmentsEmailPreviewComponent
