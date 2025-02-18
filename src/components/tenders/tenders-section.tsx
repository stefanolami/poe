'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { TendersForm } from './tender-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTenderSchema, CreateTenderSchema } from '@/lib/tenders.schema'
import { createTender } from '@/actions/tenders'
import { sendEmail } from '@/actions/email'
import { notify } from '@/actions/notification'

const TendersSection = () => {
	const form = useForm<CreateTenderSchema>({
		resolver: zodResolver(createTenderSchema),
		defaultValues: {
			title: '',
			location: '',
			description: '',
			value: '',
			contract_type: '',
			submission_language: '',
			sector: '',
			agent: '',
			type_of_vehicle: '',
			type_of_contract: '',
		},
	})

	const submitHandler: SubmitHandler<CreateTenderSchema> = async (data) => {
		const response = await createTender(data)

		return response
	}

	const submitEmail = async () => {
		const emailResponse = await sendEmail(
			['stefanolami90@gmail.com'],
			'New Tender'
		)
		console.log(emailResponse)
	}

	const filterUsers = async (tenderTitle: string) => {
		const users = await notify(tenderTitle)
		console.log(users)
	}

	return (
		<div>
			<button
				onClick={submitEmail}
				className="border-2 border-white my-12 mx-auto text-white border-md px-4 py-2 rounded-md"
			>
				Send Email
			</button>
			<button
				onClick={() => filterUsers('tender 4')}
				className="border-2 border-white my-12 mx-auto text-white border-md px-4 py-2 rounded-md"
			>
				Filter Users
			</button>
			<TendersForm
				form={form}
				onSubmit={submitHandler}
				defaultValues={null}
			/>
		</div>
	)
}

export default TendersSection
