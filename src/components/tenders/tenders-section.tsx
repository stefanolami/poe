'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { TendersForm } from './tender-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTenderSchema, CreateTenderSchema } from '@/lib/tenders.schema'
import { createTender } from '@/actions/tenders'

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
	return (
		<div>
			<TendersForm
				form={form}
				onSubmit={submitHandler}
				defaultValues={null}
			/>
		</div>
	)
}

export default TendersSection
