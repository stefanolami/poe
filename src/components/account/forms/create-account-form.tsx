'use client'

import { useToast } from '@/hooks/use-toast'
import { CreateAccountType } from '@/lib/types'
import { createAccountSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
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
import { LuEyeClosed, LuEye } from 'react-icons/lu'
import { FaTrashAlt } from 'react-icons/fa'
import { useStore } from '@/store/store'
import { useShallow } from 'zustand/shallow'
import { signUpClient } from '@/actions/clients'
import { selectionArrayFromStoreToDB } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'

const CreateAccountForm = () => {
	const [isView, setIsView] = useState(false)
	const [isViewConfirm, setIsViewConfirm] = useState(false)

	const { setUserRole } = useAuthStore(
		useShallow((state) => ({
			setUserRole: state.setUserRole,
		}))
	)

	const { toast } = useToast()

	const router = useRouter()
	const pathname = usePathname()

	const { storeSector, storeData } = useStore(
		useShallow((state) => ({
			storeSector: state.sector,
			storeData: state.data,
		}))
	)

	const form = useForm<CreateAccountType>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			orgName: '',
			email: '',
			password: '',
			confirmPassword: '',
			additionalEmails: [],
		},
	})

	const isSubmitting = form.formState.isSubmitting

	const submitHandler: SubmitHandler<CreateAccountType> = async (
		data: CreateAccountType
	) => {
		console.log('formatting data', data)
		const fullData = {
			...data,
			additional_emails:
				data.additionalEmails && data.additionalEmails.length
					? data.additionalEmails.filter(
							(e) => e && e.trim().length > 0
						)
					: [],
			sector: storeSector.value,
			vehicles_type: selectionArrayFromStoreToDB(
				storeData.eMobility.typeOfVehicle
			),
			vehicles_contract:
				storeData.eMobility.typeOfVehicleContract?.map(
					(item) => item.value
				) || [],
			charging_stations_type: selectionArrayFromStoreToDB(
				storeData.eMobility.chargingStations
			),
			charging_stations_contract:
				storeData.eMobility.chargingStationsContract?.map(
					(item) => item.value
				) || [],
			pif: selectionArrayFromStoreToDB(storeData.eMobility.pif),
			deployment: selectionArrayFromStoreToDB(
				storeData.eMobility.deployment
			),
			project: selectionArrayFromStoreToDB(storeData.eMobility.project),
		}

		try {
			let response
			if (pathname.includes('confirm-account')) {
				// If we are on the confirm-account page, we need to pass the id
				const id = pathname.split('/').pop()
				if (!id) {
					throw new Error('No ID found in the URL')
				}
				response = await signUpClient(fullData, id)
			} else {
				// Otherwise, we just call the signUpClient without an id
				response = await signUpClient(fullData)
			}

			if (response) {
				setUserRole('client')
				toast({
					title: 'Thank You!',
					description: 'Account created successfully',
					variant: 'default',
				})
				setTimeout(() => {
					router.push('/account')
				}, 800)
			}

			console.log('response', response)

			return response
		} catch (error) {
			if (error instanceof Error) {
				toast({
					title: 'Error',
					description: 'An error occurred while creating the account',
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
				Create Account
			</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(submitHandler, (e) => {
						console.log(e)
					})}
					className=""
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
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="relative">
								<FormLabel className="text-sm md:text-base lg:text-lg">
									Password
								</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										type={isView ? 'text' : 'password'}
										{...field}
										className="bg-white text-primary text-sm md:text-base"
									/>
								</FormControl>
								{isView ? (
									<LuEye
										className="absolute right-2 top-[34px] lg:top-[38px] z-10 cursor-pointer text-gray-500"
										onClick={() => {
											setIsView(!isView)
										}}
									/>
								) : (
									<LuEyeClosed
										className="absolute right-2 top-[34px] lg:top-[38px] z-10 cursor-pointer text-gray-500"
										onClick={() => setIsView(!isView)}
									/>
								)}
								<FormMessage className="text-red-500 text-sm md:text-base" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem className="relative">
								<FormLabel className="text-sm md:text-base lg:text-lg">
									Confirm Password
								</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										type={
											isViewConfirm ? 'text' : 'password'
										}
										{...field}
										className="bg-white text-primary text-sm md:text-base"
									/>
								</FormControl>
								{isViewConfirm ? (
									<LuEye
										className="absolute right-2 top-[34px] lg:top-[38px] z-10 cursor-pointer text-gray-500"
										onClick={() => {
											setIsViewConfirm(!isViewConfirm)
										}}
									/>
								) : (
									<LuEyeClosed
										className="absolute right-2 top-[34px] lg:top-[38px] z-10 cursor-pointer text-gray-500"
										onClick={() =>
											setIsViewConfirm(!isViewConfirm)
										}
									/>
								)}
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
						className="text-sm md:text-base lg:text-lg bg-primary-light text-white hover:bg-primary-light shadow-md hover:shadow-xl hover:scale-[1.02] mt-8 px-6 py-2"
					>
						Create Account
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default CreateAccountForm
