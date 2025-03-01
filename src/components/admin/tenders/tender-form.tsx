'use client'

import { SubmitHandler } from 'react-hook-form'

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
import { CreateTenderSchema } from '@/lib/tenders.schema'

export const TendersForm = ({
	form,
	onSubmit,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: any
	onSubmit: SubmitHandler<CreateTenderSchema>
	defaultValues: CreateTenderSchema | null
}) => {
	const isSubmitting = form.formState.isSubmitting

	/* useEffect(() => {
		if (defaultValues) {
			form.reset(defaultValues)
		} else {
			form.reset()
		}
	}, [defaultValues, form]) */

	return (
		<>
			<h1 className="mb-6 text-white">Create Tender</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
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
						className="bg-transparent text-white"
					>
						Submit
					</Button>
				</form>
			</Form>
		</>
	)
}
