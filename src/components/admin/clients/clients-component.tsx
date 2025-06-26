import { getClients } from '@/actions/clients'
import { columns } from './clients-columns'
import { ClientsTable } from './clients-table'

/* import { TendersForm } from './tender-form'
import { sendEmail } from '@/actions/email'
import { notify } from '@/actions/notification' */

const ClientsComponent = async () => {
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
	console.log('grants data', data)

	return (
		<div className="min-h-[calc(100vh-80px)] bg-primary">
			<div className="flex flex-row items-center justify-between gap-16 mb-8">
				<h1 className="text-white font-jose text-2xl">Clients</h1>
			</div>

			<ClientsTable
				columns={columns}
				data={data}
			/>
		</div>
	)
}

export default ClientsComponent
