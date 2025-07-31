import { getUserById } from '@/actions/users'
import UserSingle from '@/components/admin/users/user/user-single'
import { notFound } from 'next/navigation'

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params

	const user = await getUserById(id)

	if (!user) {
		throw notFound()
	}

	return <UserSingle user={user} />
}

export default UserPage
