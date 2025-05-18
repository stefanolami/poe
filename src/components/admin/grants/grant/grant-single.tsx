'use client'

import { sendEmail } from '@/actions/email'
import React from 'react'

const GrantSingle = ({
	grant,
}: {
	//eslint-disable-next-line
	grant: any
}) => {
	const handleEmail = async () => {
		const emailResponse = await sendEmail(
			'stefanolami90@gmail.com',
			grant.call_title,
			grant.in_brief
		)
		console.log('EMAIL RESPONSE', emailResponse)
	}
	return (
		<>
			<div className="text-white">
				{grant.call_title ? grant.call_title : grant.grant_programme}
			</div>
			<button onClick={handleEmail}>Send Email</button>
		</>
	)
}

export default GrantSingle
