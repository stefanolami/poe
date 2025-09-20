import Link from 'next/link'
import { columns } from './tenders-columns'
import { TendersTable } from './tenders-table'
import { getTenders } from '@/actions/tenders'

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

	return (
		<div className="min-h-[calc(100vh-80px)] bg-primary">
			<div className="flex flex-row items-center justify-between gap-16 mb-8">
				<h1 className="text-white font-jose text-2xl">Tenders</h1>
				<Link href={'/admin/tenders/create'}>
					<button className="bg-primary-light hover:bg-primary-light/90 text-white font-jose text-base w-40 py-2 shadow-md hover:scale-[1.02] hover:shadow-xl">
						Create New
					</button>
				</Link>
			</div>

			<TendersTable
				columns={columns}
				data={data}
			/>
		</div>
	)
}

export default TendersComponent
