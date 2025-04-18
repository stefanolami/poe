import Link from 'next/link'

/* import { TendersForm } from './tender-form'
import { sendEmail } from '@/actions/email'
import { notify } from '@/actions/notification' */

const TendersComponent = () => {
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

	return (
		<div>
			<h1 className="text-white font-jose text-2xl mb-10">Tenders</h1>
			<Link href={'/admin/tenders/create'}>
				<button className="bg-primary-light text-white font-jose text-base px-4 py-2 shadow-md hover:scale-[1.02] hover:shadow-xl">
					Create New
				</button>
			</Link>
		</div>
	)
}

export default TendersComponent
