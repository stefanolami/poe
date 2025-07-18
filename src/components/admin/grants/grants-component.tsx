import Link from 'next/link'
import { columns } from './grants-columns'
import { GrantsTable } from './grants-table'
import { getGrants } from '@/actions/grants'

/* import { TendersForm } from './tender-form'
import { sendEmail } from '@/actions/email'
import { notify } from '@/actions/notification' */

const GrantsComponent = async () => {
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

	const data = await getGrants()

	return (
		<div className="min-h-[calc(100vh-80px)] bg-primary">
			<div className="flex flex-row items-center justify-between gap-16 mb-8">
				<h1 className="text-white font-jose text-2xl">Grants</h1>
				<Link href={'/admin/grants/create'}>
					<button className="bg-primary-light hover:bg-primary-light/90 text-white font-jose text-base w-40 py-2 shadow-md hover:scale-[1.02] hover:shadow-xl">
						Create New
					</button>
				</Link>
			</div>

			<GrantsTable
				columns={columns}
				data={data}
			/>
		</div>
	)
}

export default GrantsComponent
