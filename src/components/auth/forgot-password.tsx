'use client'

import { forgotPassword } from '@/actions/auth'
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
import { ForgotPasswordType } from '@/lib/types'
import { forgotPasswordSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function ForgotPassword() {
	const form = useForm<ForgotPasswordType>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	})

	const [isAuthenticating, setIsAuthenticating] = useState(false)

	const router = useRouter()

	const onSubmit = async ({ email }: ForgotPasswordType) => {
		setIsAuthenticating(true)

		try {
			const response = await forgotPassword(email)

			if (response) {
				toast({
					title: 'Thank You!',
					description: 'Password reset email sent successfully',
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
					description: 'An error occurred while sending the email',
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
		} finally {
			setIsAuthenticating(false)
		}
	}

	return (
		<div className="flex items-center justify-center text-primary">
			<div className="mx-auto grid w-[350px] gap-6">
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
							name="email"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<FormLabel htmlFor="email">Email</FormLabel>
									<FormControl>
										<Input
											id="email"
											type="email"
											placeholder=""
											className="text-primary border-primary"
											{...field}
											disabled={isAuthenticating}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={isAuthenticating}
							type="submit"
							className="bg-primary text-white border-2 border-white font-bold text-lg px-10 py-5 mx-auto flex shadow-lg hover:shadow-xl w-full"
						>
							Send Reset Link
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
