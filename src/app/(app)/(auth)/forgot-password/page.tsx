import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Forgot Password | POE',
	description: 'Reset your POE account password.',
}
import ForgotPassword from '@/components/auth/forgot-password'
import React from 'react'

const ForgotPasswordPage = () => {
	return (
		<div className="w-full flex items-center justify-center">
			<ForgotPassword />
		</div>
	)
}

export default ForgotPasswordPage
