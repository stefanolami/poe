import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import GrantsEmailPreviewComponent from './grants-email-preview'
import { FormattedGrantType } from '@/lib/types'

const GrantEmailPreviewButton = ({
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
				<GrantsEmailPreviewComponent emailData={emailData} />
			</DialogContent>
		</Dialog>
	)
}

export default GrantEmailPreviewButton
