import { getClients } from '@/actions/clients'
import { columns } from './users-columns'
import { UsersTable } from './users-table'
import UsersForm from './users-form'

/* import { TendersForm } from './tender-form'
import { sendEmail } from '@/actions/email'
import { notify } from '@/actions/notification' */

const UsersComponent = async () => {
	/* const submitEmail = async () => {
		const emailResponse = await sendEmail(
			['stefanolami90@gmail.com'],
			'New Tender'
		)
		console.log(emailResponse)
	}

	const filterUsers = async (tenderTitle: string) => {
		const users = await notify(tenderTitle)
		console.log(users)
	} */

	const data = await getClients()

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
