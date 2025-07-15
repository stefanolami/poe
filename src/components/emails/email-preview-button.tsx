import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import EmailPreviewComponent from './email-preview'
import { FormattedGrantType } from '@/lib/types'
import { Button } from '../ui/button'

const EmailPreviewButton = ({
	emailData,
	disabled = false,
}: {
	emailData: FormattedGrantType
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
					See Email
				</Button>
			</DialogTrigger>
			<DialogContent
				id="email-preview-dialog"
				className="w-auto h-4/5 overflow-y-auto bg-white"
			>
				<DialogHeader>
					<DialogTitle className="hidden">Email Preview</DialogTitle>
				</DialogHeader>
				<EmailPreviewComponent emailData={emailData} />
			</DialogContent>
		</Dialog>
	)
}

export default EmailPreviewButton
