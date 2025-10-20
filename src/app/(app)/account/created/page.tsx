import AccountCreated from '@/components/account/account-created'
import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Account Created | POE',
	description: 'Confirmation page after account creation.',
}

export default async function AccountCreatedPage() {
	return <AccountCreated />
}
