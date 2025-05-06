'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { authenticate, getUserRole } from '@/actions/auth'
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
import { LoginType } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
})

export default function AuthComponent() {
	const form = useForm<LoginType>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const [isAuthenticating, setIsAuthenticating] = useState(false)

	const router = useRouter()

	const onSubmit = async ({ email, password }: LoginType) => {
		setIsAuthenticating(true)

		try {
			await authenticate(email, password)
			const userRole = await getUserRole()
			if (userRole === 'client') {
				router.push('/')
			}
			if (userRole === 'admin') {
				router.push('/admin/dashboard')
			}
		} catch (error) {
		} finally {
			setIsAuthenticating(false)
		}
	}

	return (
		<div className="flex items-center justify-center">
			<div className="mx-auto grid w-[350px] gap-6">
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
											className="text-black"
											{...field}
											disabled={isAuthenticating}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<div className="flex items-center">
										<FormLabel htmlFor="password">
											Password
										</FormLabel>
									</div>
									<FormControl>
										<Input
											disabled={isAuthenticating}
											id="password"
											type="password"
											{...field}
											className="text-black"
										/>
									</FormControl>{' '}
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={isAuthenticating}
							type="submit"
							className="bg-primary text-white border-2 border-white font-bold text-lg px-10 py-5 mx-auto flex shadow-lg hover:shadow-xl w-full"
						>
							Login
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
