'use client'

import React, { useState } from 'react'
import { ClientDataType, UpdateAccountType } from '@/lib/types'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { SubmitHandler, useForm } from 'react-hook-form'
import { updateAccountSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientUpdate } from '@/actions/clients'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { FaTrashAlt } from 'react-icons/fa'
import { ImSpinner6 } from 'react-icons/im'
import { useRouter } from 'next/navigation'

const EditAccountComponent = ({
	clientData,
}: {
	clientData: ClientDataType
}) => {
	const [open, setOpen] = useState(false)
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
				setOpen(false)
				router.refresh()
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
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button className="text-xs md:text-sm bg-primary-light text-white hover:bg-primary-light/90 shadow-sm hover:shadow transition-transform hover:scale-[1.02] mt-6 px-6 py-2 w-full">
					Edit Details
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-white text-primary font-jose">
				<DialogHeader>
					<DialogTitle className="text-lg md:text-xl lg:text-2xl font-semibold mb-4">
						Edit Account
					</DialogTitle>
				</DialogHeader>
				<div className="mt-10 lg:mt-0 text-primary font-jose">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(submitHandler, (e) => {
								console.log(e)
							})}
						>
							<div className="lg:grid lg:grid-cols-2 gap-4">
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
																	disabled={
																		isSubmitting
																	}
																	placeholder=""
																	value={
																		email ||
																		''
																	}
																	onChange={(
																		e
																	) => {
																		const updated =
																			[
																				...(field.value ??
																					[]),
																			]
																		updated[
																			index
																		] =
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
																	disabled={
																		isSubmitting
																	}
																	onClick={() => {
																		const updated =
																			(
																				field.value ??
																				[]
																			).filter(
																				(
																					_,
																					i
																				) =>
																					i !==
																					index
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
																...(field.value ??
																	[]),
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
							</div>
							<DialogFooter>
								<div className="w-2/5 grid grid-cols-2 gap-2 mt-4 ml-auto">
									<DialogClose asChild>
										<Button
											variant="default"
											className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5 font-jose text-base py-2"
										>
											Cancel
										</Button>
									</DialogClose>
									<Button
										className="bg-primary-light hover:bg-primary-light/90 text-white font-jose text-base py-2 shadow-md hover:scale-[1.02] hover:shadow-xl"
										type="submit"
									>
										{isSubmitting ? (
											<ImSpinner6
												className="animate-spin text-white"
												size={20}
											/>
										) : (
											'Save'
										)}
									</Button>
								</div>
							</DialogFooter>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default EditAccountComponent
