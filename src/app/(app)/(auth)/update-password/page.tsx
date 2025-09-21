import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Update Password | POE',
	description: 'Set a new password for your POE account.',
}
import UpdatePassword from '@/components/auth/update-password'

const UpdatePasswordPage = () => {
	return (
		<div className="w-full flex items-center justify-center">
			<UpdatePassword />
		</div>
	)
}

export default UpdatePasswordPage
