import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Create Account | POE',
	description: 'Create your POE e-mobility account.',
}
import CreateAccountComponent from '@/components/account/create-account-component'

const CreateAccountPage = () => {
	return <CreateAccountComponent />
}

export default CreateAccountPage
