import UpdatePassword from '@/components/auth/update-password'
import React from 'react'

const UpdatePasswordPage = ({
	searchParams,
}: {
	searchParams: { code?: string }
}) => {
	const code = searchParams.code

	if (!code) {
		return (
			<div className="w-full flex items-center justify-center">
				This Link is not valid. Please try again.
			</div>
		)
	}

	console.log('UpdatePasswordPage code:', code)

	return (
		<div className="w-full flex items-center justify-center">
			<UpdatePassword code={code} />
		</div>
	)
}

export default UpdatePasswordPage
