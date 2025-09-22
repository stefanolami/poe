'use client'

import { useToast } from '@/hooks/use-toast'
import { ClientDataType, UpdateAccountType } from '@/lib/types'
import { updateAccountSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../ui/form'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { clientUpdate } from '@/actions/clients'
import { FaTrashAlt } from 'react-icons/fa'

const EditAccountForm = ({ clientData }: { clientData: ClientDataType }) => {
	const { toast } = useToast()
	const router = useRouter()

	const form = useForm<UpdateAccountType>({
		resolver: zodResolver(updateAccountSchema),
		defaultValues: {
			firstName: clientData.first_name,
			lastName: clientData.last_name,
			orgName: clientData.org_name ?? undefined,
			email: clientData.email,
			additionalEmails: clientData.additional_emails ?? [],
		},
	})

	const isSubmitting = form.formState.isSubmitting

	const submitHandler: SubmitHandler<UpdateAccountType> = async (
		data: UpdateAccountType
	) => {
		const updateEmail = data.email !== clientData.email

		try {
			const response = await clientUpdate(
				data,
				clientData.id,
				updateEmail
			)

			if (response) {
				toast({
					title: 'Thank You!',
					description: 'Account updated successfully',
					variant: 'default',
				})
				setTimeout(() => {
					router.replace('/account')
				}, 1000)
			}

			return response
		} catch (error) {
			if (error instanceof Error) {
				toast({
					title: 'Error',
					description: 'An error occurred while updating the account',
					variant: 'destructive',
				})
				console.error(error.message)
			} else {
				toast({
					title: 'Error',
					description: 'An unexpected error occurred',
					variant: 'destructive',
				})
				console.error(error)
			}
		}
	}

	return (
		<div className="mt-10 lg:mt-0">
			<h2 className="text-lg md:text-xl lg:text-3xl mb-4 lg:mb-10">
				Edit Account
			</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(submitHandler, (e) => {
						console.log(e)
					})}
				>
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm md:text-base lg:text-lg">
									First Name
								</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary text-sm md:text-base"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm md:text-base" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm md:text-base lg:text-lg">
									Last Name
								</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary text-sm md:text-base"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm md:text-base" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="orgName"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm md:text-base lg:text-lg">
									Organization Name
								</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary text-sm md:text-base"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm md:text-base" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm md:text-base lg:text-lg">
									Email
								</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary text-sm md:text-base"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm md:text-base" />
							</FormItem>
						)}
					/>

					{/* Additional Emails (dynamic) */}
					<FormField
						control={form.control}
						name="additionalEmails"
						render={({ field }) => (
							<FormItem className="mt-6">
								<FormLabel className="text-sm md:text-base lg:text-lg">
									Additional Emails
								</FormLabel>
								<FormControl>
									<div className="space-y-3">
										{(field.value ?? []).map(
											(email, index) => (
												<div
													key={index}
													className="flex items-center gap-3"
												>
													<Input
														disabled={isSubmitting}
														placeholder=""
														value={email || ''}
														onChange={(e) => {
															const updated = [
																...(field.value ??
																	[]),
															]
															updated[index] =
																e.target.value
															field.onChange(
																updated
															)
														}}
														className="bg-white text-primary text-sm md:text-base flex-1"
													/>
													<Button
														variant="destructive"
														type="button"
														disabled={isSubmitting}
														onClick={() => {
															const updated = (
																field.value ??
																[]
															).filter(
																(_, i) =>
																	i !== index
															)
															field.onChange(
																updated
															)
														}}
														className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
													>
														<FaTrashAlt className="h-4 w-4" />
													</Button>
												</div>
											)
										)}

										<Button
											variant="default"
											type="button"
											disabled={isSubmitting}
											onClick={() =>
												field.onChange([
													...(field.value ?? []),
													'',
												])
											}
											className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
										>
											Add Emails
										</Button>
									</div>
								</FormControl>
								<FormMessage className="text-red-500 text-sm md:text-base" />
							</FormItem>
						)}
					/>

					<Button
						disabled={isSubmitting}
						type="submit"
						variant="default"
						className="text-sm md:text-base lg:text-lg bg-primary-light text-white hover:bg-primary-light shadow-md hover:shadow-xl hover:scale-[1.02] mt-8 px-12 py-2"
					>
						Save
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default EditAccountForm
