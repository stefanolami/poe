import * as React from 'react'

interface EmailTemplateProps {
	firstName: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
	firstName,
}) => (
	<div className="bg-slate-600">
		<h1>Welcome, {firstName}!</h1>
	</div>
)
