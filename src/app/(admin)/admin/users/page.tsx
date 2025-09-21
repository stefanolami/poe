import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Users | Admin | POE',
	description: 'Manage platform users and roles.',
}
import UsersComponent from '@/components/admin/users/users-component'

const UsersPage = () => {
	return <UsersComponent />
}

export default UsersPage
