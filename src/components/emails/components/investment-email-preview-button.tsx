import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog'
import { Button } from '../../ui/button'
import InvestmentsEmailPreviewComponent from './investments-email-preview'
import { FormattedInvestmentType } from '@/lib/types'

const InvestmentEmailPreviewButton = ({
	emailData,
	disabled = false,
}: {
	emailData: FormattedInvestmentType
	disabled?: boolean
}) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					disabled={disabled}
					variant="default"
					type="button"
					className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5 font-jose"
				>
					Show Email
				</Button>
			</DialogTrigger>
			<DialogContent
				id="email-preview-dialog"
				className="w-auto h-4/5 overflow-y-auto bg-white"
			>
				<DialogHeader>
					<DialogTitle className="hidden">Email Preview</DialogTitle>
				</DialogHeader>
				<InvestmentsEmailPreviewComponent emailData={emailData} />
			</DialogContent>
		</Dialog>
	)
}

export default InvestmentEmailPreviewButton
