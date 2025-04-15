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
import { createTenderSchema, CreateTenderSchema } from '@/lib/tenders.schema'
import { createTender } from '@/actions/tenders'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'

export const TendersForm = () => {
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

	const isSubmitting = form.formState.isSubmitting

	const submitHandler: SubmitHandler<CreateTenderSchema> = async (data) => {
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
		<DialogContent>
			<DialogTitle className="mb-6 text-white">Create Tender</DialogTitle>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(submitHandler)}
					className="bg-transparent grid grid-cols-2 items-center text-white font-titillium gap-2"
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
										placeholder="Title"
										{...field}
										className="bg-transparent"
									/>
								</FormControl>
								<FormMessage />
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
										placeholder="Location"
										{...field}
										className="bg-transparent"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Desc</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder="Desc"
										{...field}
										className="bg-transparent"
									/>
								</FormControl>
								<FormMessage />
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
										placeholder="value"
										{...field}
										className="bg-transparent"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="contract_type"
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
								<FormMessage />
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
								<FormMessage />
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
								<FormMessage />
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
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
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
								<FormMessage />
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
								<FormMessage />
							</FormItem>
						)}
					/>
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
		</DialogContent>
	)
}
