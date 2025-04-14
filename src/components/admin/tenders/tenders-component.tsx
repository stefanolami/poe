'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { TendersForm } from './tender-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTenderSchema, CreateTenderSchema } from '@/lib/tenders.schema'
import { createTender } from '@/actions/tenders'
import { sendEmail } from '@/actions/email'
import { notify } from '@/actions/notification'

const TendersComponent = () => {
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
		<div className="space-x-2">
			<button
				onClick={submitEmail}
				className="my-12 mx-auto text-white bg-primary-light px-4 py-2 rounded-md hover:scale-[1.02] shadow-md hover:shadow-xl"
			>
				Send Email
			</button>
			<button
				onClick={() => filterUsers('tender 4')}
				className=" my-12 mx-auto text-white bg-primary-light px-4 py-2 rounded-md  hover:scale-[1.02] shadow-md hover:shadow-xl"
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

export default TendersComponent
