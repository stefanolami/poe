'use client'

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
import { loginSchema } from '@/lib/zod-schemas'
import { useAuthStore } from '@/store/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuEye, LuEyeClosed } from 'react-icons/lu'
import { useShallow } from 'zustand/shallow'

export default function AuthComponent() {
	const form = useForm<LoginType>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const [isAuthenticating, setIsAuthenticating] = useState(false)
	const [isView, setIsView] = useState(false)

	const { storeSetUserRole } = useAuthStore(
		useShallow((state) => ({
			storeSetUserRole: state.setUserRole,
		}))
	)

	const router = useRouter()

	const onSubmit = async ({ email, password }: LoginType) => {
		setIsAuthenticating(true)

		try {
			await authenticate(email, password)
			const userRole = await getUserRole()

			storeSetUserRole(
				userRole === 'client' || userRole === 'admin' ? userRole : null
			)

			if (userRole === 'client') {
				router.push('/')
			}
			if (userRole === 'admin') {
				router.push('/admin/dashboard')
			}
		} catch (error) {
			console.error('Authentication error:', error)
			form.setError('email', {
				type: 'manual',
				message: 'Invalid email or password',
			})
		} finally {
			setIsAuthenticating(false)
		}
	}

	return (
		<div className="flex items-center justify-center text-primary">
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
											className="text-primary border-primary"
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
								<FormItem className="grid gap-2 relative">
									<div className="flex items-center">
										<FormLabel htmlFor="password">
											Password
										</FormLabel>
									</div>
									<FormControl>
										<Input
											disabled={isAuthenticating}
											id="password"
											type={isView ? 'text' : 'password'}
											{...field}
											className="text-primary border-primary"
										/>
									</FormControl>
									{isView ? (
										<LuEye
											className="absolute right-2 top-[32px] lg:top-[32px] z-10 cursor-pointer text-primary"
											onClick={() => {
												setIsView(!isView)
											}}
										/>
									) : (
										<LuEyeClosed
											className="absolute right-2 top-[32px] lg:top-[32px] z-10 cursor-pointer text-primary"
											onClick={() => setIsView(!isView)}
										/>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
						<Link
							href="/forgot-password"
							className="text-primary underline text-sm -mt-4"
						>
							Forgot Password
						</Link>
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
