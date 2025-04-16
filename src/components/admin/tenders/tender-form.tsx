'use client'

import { SubmitHandler, useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { tenderSchema, TenderSchema } from '@/lib/tenders.schema'
import { createTender } from '@/actions/tenders'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { MultiSelect } from '@/components/ui/multi-select'

export const TenderForm = () => {
	const form = useForm<TenderSchema>({
		resolver: zodResolver(tenderSchema),
		defaultValues: {
			title: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting

	const submitHandler: SubmitHandler<TenderSchema> = async (data) => {
		const response = await createTender(data)

		return response
	}

	/* useEffect(() => {
		if (defaultValues) {
			form.reset(defaultValues)
		} else {
			form.reset()
		}
	}, [defaultValues, form]) */

	return (
		<div className="w-1/2">
			<h1 className="text-white font-jose text-2xl mb-10">
				Create New Tender
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(submitHandler)}
					className="bg-transparent grid grid-cols-2 items-center text-white font-jose gap-2"
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Location</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="contracting_org_name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contracting Organization</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="contracting_org_info"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Contracting Organization Information *
								</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="col-span-2">
								<FormLabel>Desc</FormLabel>
								<FormControl>
									<Textarea
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="value"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Value</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="contract_type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contract Type</FormLabel>
								<FormControl>
									<MultiSelect
										className="bg-white text-primary hover:bg-white"
										onValueChange={field.onChange}
										variant="default"
										options={[
											{
												value: 'service',
												label: 'Service',
											},
											{
												value: 'purchase',
												label: 'Purchase',
											},
											{
												value: 'mixed',
												label: 'Mixed',
											},
										]}
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="submission_language"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Lang</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder="Lang"
										{...field}
										className="bg-transparent"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="sector"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Sector</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder="Sector"
										{...field}
										className="bg-transparent"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="agent"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Agent</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder="agent"
										{...field}
										className="bg-transparent"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm" />
							</FormItem>
						)}
					/>
					{/* <FormField
						control={form.control}
						name="type_of_vehicle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Vehicle</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder="Vehicle"
										{...field}
										className="bg-transparent"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm"/>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="type_of_contract"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contract</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder="Contract"
										{...field}
										className="bg-transparent"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm"/>
							</FormItem>
						)}
					/> */}
					<Button
						disabled={isSubmitting}
						type="submit"
						variant="outline"
						className="bg-transparent text-primary bg-white hover:bg-primary-light"
					>
						Submit
					</Button>
				</form>
			</Form>
		</div>
	)
}
