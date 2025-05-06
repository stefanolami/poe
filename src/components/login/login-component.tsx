'use client'

import { LoginType } from '@/lib/types'
import { loginSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { LuEye } from 'react-icons/lu'
import { LucideEyeClosed } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authenticate } from '@/actions/auth'

const LoginComponent = () => {
	const [isView, setIsView] = useState(false)

	const router = useRouter()

	const form = useForm<LoginType>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting

	const submitHandler: SubmitHandler<LoginType> = async (data: LoginType) => {
		try {
			await authenticate(data)

			if (response) {
				setTimeout(() => {
					router.push('/')
				}, 1000)
			}

			console.log('response', response)

			return response
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
			} else {
				console.error(error)
			}
		}
	}

	return (
		<div className="w-full">
			<div className="mx-auto w-fit">
				<h2 className="font-jose text-xl font-bold">Login</h2>
				<div>
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
										<FormLabel>Name</FormLabel>
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
								name="familyName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Family Name</FormLabel>
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
								name="orgName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Organization Name</FormLabel>
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
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
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
								name="password"
								render={({ field }) => (
									<FormItem className="relative">
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												placeholder=""
												type={
													isView ? 'text' : 'password'
												}
												{...field}
												className="bg-white text-primary"
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
											<LucideEyeClosed
												className="absolute right-2 top-8 z-10 cursor-pointer text-gray-500"
												onClick={() =>
													setIsView(!isView)
												}
											/>
										)}
										<FormMessage className="text-red-500 text-sm" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem className="relative">
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												placeholder=""
												type={
													isViewConfirm
														? 'text'
														: 'password'
												}
												{...field}
												className="bg-white text-primary"
											/>
										</FormControl>
										{isViewConfirm ? (
											<LuEye
												className="absolute right-2 top-8 z-10 cursor-pointer text-gray-500"
												onClick={() => {
													setIsViewConfirm(
														!isViewConfirm
													)
												}}
											/>
										) : (
											<LuEyeClosed
												className="absolute right-2 top-8 z-10 cursor-pointer text-gray-500"
												onClick={() =>
													setIsViewConfirm(
														!isViewConfirm
													)
												}
											/>
										)}
										<FormMessage className="text-red-500 text-sm" />
									</FormItem>
								)}
							/>

							<Button
								disabled={false}
								type="submit"
								variant="default"
								className="bg-primary-light text-white hover:bg-primary-light shadow-md hover:shadow-xl hover:scale-[1.02] mt-8 px-12 py-2"
							>
								Save
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	)
}

export default LoginComponent
