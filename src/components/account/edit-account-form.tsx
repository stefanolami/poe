'use client'

import { useToast } from '@/hooks/use-toast'
import { ClientDataType, UpdateAccountType } from '@/lib/types'
import { updateAccountSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
//import { useState } from 'react'
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
//import { LuEyeClosed, LuEye } from 'react-icons/lu'
/* import { useStore } from '@/store/store'
import { useShallow } from 'zustand/shallow' */
import { clientUpdate } from '@/actions/clients'

const EditAccountForm = ({ clientData }: { clientData: ClientDataType }) => {
	//const [isView, setIsView] = useState(false)
	//const [isViewConfirm, setIsViewConfirm] = useState(false)

	const { toast } = useToast()

	const router = useRouter()

	/* const { storeSector, storeData, storeGeographies } = useStore(
		useShallow((state) => ({
			storeSector: state.sector,
			storeData: state.data,
			storeGeographies: state.geographies,
		}))
	) */

	const form = useForm<UpdateAccountType>({
		resolver: zodResolver(updateAccountSchema),
		defaultValues: {
			name: clientData.name,
			familyName: clientData.family_name,
			orgName: clientData.org_name ?? undefined,
			email: clientData.email,
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

			console.log('response', response)

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
					className=""
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm md:text-base lg:text-lg">
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
								<FormLabel className="text-sm md:text-base lg:text-lg">
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
					{/* <FormField
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
					/> */}

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
