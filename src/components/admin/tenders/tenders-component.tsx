import Link from 'next/link'
import { columns } from './tenders-columns'
import { TendersTable } from './tenders-table'
import { getTenders } from '@/actions/tenders'
import { getClients } from '@/actions/clients'
import { CustomAlerts } from '@/components/admin/custom-alerts'

/* import { TendersForm } from './tender-form'
import { sendEmail } from '@/actions/email'
import { notify } from '@/actions/notification' */

const TendersComponent = async () => {
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

	const data = await getTenders()
	const clients = await getClients()

	return (
		<div className="min-h-[calc(100vh-80px)] bg-primary">
			<div className="flex flex-row items-center justify-between gap-16 mb-8">
				<h1 className="text-white font-jose text-2xl">Tenders</h1>
				<div className="space-x-2">
					<CustomAlerts
						entityType="tender"
						opportunities={data.map((t) => ({
							id: t.id,
							label:
								t.call_title || t.programme_title || 'Untitled',
						}))}
						clients={clients.map((c) => ({
							id: c.id,
							label: `${c.name} (${c.email})`,
						}))}
					/>
					<Link href={'/admin/tenders/create'}>
						<button className="bg-primary-light hover:bg-primary-light/90 text-white font-jose text-base w-40 py-2 shadow-md hover:scale-[1.02] hover:shadow-xl">
							Create New
						</button>
					</Link>
				</div>
			</div>

			<TendersTable
				columns={columns}
				data={data}
			/>
		</div>
	)
}

export default TendersComponent
