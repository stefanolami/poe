import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'User Details | Admin | POE',
	description: 'View and edit a user.',
}
import { getClients } from '@/actions/clients'
import { getUserById } from '@/actions/users'
import UserSingle from '@/components/admin/users/user/user-single'
import { notFound } from 'next/navigation'

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	const user = await getUserById(id)

	const clients = await getClients()

	if (!user) {
		throw notFound()
	}

	return (
		<UserSingle
			user={user.user}
			userClients={user.clients}
			clientsData={clients}
		/>
	)
}

export default UserPage
