import { columns } from './users-columns'
import { UsersTable } from './users-table'
import UsersForm from './users-form'
import { getUsers } from '@/actions/users'

const UsersComponent = async () => {
	const data = await getUsers()

	return (
		<div className="min-h-[calc(100vh-80px)] bg-primary">
			<div className="flex flex-row items-center justify-between gap-16 mb-8">
				<h1 className="text-white font-jose text-2xl">Users</h1>
				<UsersForm />
			</div>

			<UsersTable
				columns={columns}
				data={data}
			/>
		</div>
	)
}

export default UsersComponent
