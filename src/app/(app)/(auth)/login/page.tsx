import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Login | POE',
	description: 'Access your POE account.',
}
import AuthComponent from '@/components/auth/auth-component'
import React from 'react'

const AuthPage = () => {
	return (
		<div className="w-full flex items-center justify-center">
			<AuthComponent />
		</div>
	)
}

export default AuthPage
