'use client'

import { updatePassword } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { UpdatePasswordType } from '@/lib/types'
import { updatePasswordSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuEye, LuEyeClosed } from 'react-icons/lu'

export default function UpdatePassword() {
	const [isView, setIsView] = useState(false)
	const [isViewConfirm, setIsViewConfirm] = useState(false)

	const form = useForm<UpdatePasswordType>({
		resolver: zodResolver(updatePasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	})

	const router = useRouter()

	const isSubmitting = form.formState.isSubmitting

	const onSubmit = async ({ password }: UpdatePasswordType) => {
		try {
			const response = await updatePassword(password)

			if (response) {
				toast({
					title: 'Thank You!',
					description: 'Password updated successfully',
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
					description:
						'An error occurred while updating the password',
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
		<div className="flex items-center justify-center text-primary w-[90%] sm:w-[350px]">
			<div className="mx-auto grid w-full gap-6">
				{/* <h2 className="text-lg md:text-xl lg:text-2xl mb-4 lg:mb-6">
					Forgot Password
				</h2> */}
				{/* <span className="block text-xs text-muted-foreground -mt-2 mb-4">
					Enter your email address and we&apos;ll send you a link to
					reset your password.
				</span> */}
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid gap-4"
					>
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
												isViewConfirm
													? 'text'
													: 'password'
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
						<Button
							disabled={isSubmitting}
							type="submit"
							className="bg-primary text-white border-2 border-white font-bold text-lg px-10 py-5 mx-auto flex shadow-lg hover:shadow-xl w-full"
						>
							Update Password
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
