'use client'

import { useToast } from '@/hooks/use-toast'
import { CreateAccountType } from '@/lib/types'
import { createAccountSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { LuEyeClosed, LuEye } from 'react-icons/lu'
import { useStore } from '@/store/store'
import { useShallow } from 'zustand/shallow'
import { signUpClient } from '@/actions/auth'

const CreateAccountForm = () => {
	const [isView, setIsView] = useState(false)
	const [isViewConfirm, setIsViewConfirm] = useState(false)

	const { toast } = useToast()

	const router = useRouter()

	const { storeSector, storeData, storeGeographies } = useStore(
		useShallow((state) => ({
			storeSector: state.sector,
			storeData: state.data,
			storeGeographies: state.geographies,
		}))
	)

	const form = useForm<CreateAccountType>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: {
			name: '',
			familyName: '',
			orgName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting

	const submitHandler: SubmitHandler<CreateAccountType> = async (
		data: CreateAccountType
	) => {
		const fullData = {
			...data,
			sector: storeSector.value,
			geography: storeGeographies.map((item) => item.value),
			vehicles_type: storeData.eMobility.typeOfVehicle?.map(
				(item) => item.value
			),
			vehicles_contract: storeData.eMobility.typeOfVehicleContract?.map(
				(item) => item.value
			),
			charging_stations_type: storeData.eMobility.chargingStations?.map(
				(item) => item.value
			),
			charging_stations_contract:
				storeData.eMobility.chargingStationsContract?.map(
					(item) => item.value
				),
		}

		try {
			const response = await signUpClient(fullData)

			if (response) {
				toast({
					title: 'Thank You!',
					description: 'Account created successfully',
					variant: 'default',
				})
				setTimeout(() => {
					router.push('/')
				}, 1000)
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
			<h2 className="text-lg md:text-xl mb-3">Create Account</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(submitHandler, (e) => {
						console.log(e)
					})}
					className=""
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm md:text-base">
									Name
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
						name="familyName"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm md:text-base">
									Family Name
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
								<FormLabel className="text-sm md:text-base">
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
								<FormLabel className="text-sm md:text-base">
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
								<FormLabel className="text-sm md:text-base">
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
										className="absolute right-2 top-8 z-10 cursor-pointer text-gray-500"
										onClick={() => {
											setIsView(!isView)
										}}
									/>
								) : (
									<LuEyeClosed
										className="absolute right-2 top-8 z-10 cursor-pointer text-gray-500"
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
								<FormLabel className="text-sm md:text-base">
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
										className="absolute right-2 top-8 z-10 cursor-pointer text-gray-500"
										onClick={() => {
											setIsViewConfirm(!isViewConfirm)
										}}
									/>
								) : (
									<LuEyeClosed
										className="absolute right-2 top-8 z-10 cursor-pointer text-gray-500"
										onClick={() =>
											setIsViewConfirm(!isViewConfirm)
										}
									/>
								)}
								<FormMessage className="text-red-500 text-sm md:text-base" />
							</FormItem>
						)}
					/>

					<Button
						disabled={false}
						type="submit"
						variant="default"
						className="text-sm md:text-base lg:text-lg bg-primary-light text-white hover:bg-primary-light shadow-md hover:shadow-xl hover:scale-[1.02] mt-8 px-12 py-2"
					>
						Sign Up
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default CreateAccountForm
