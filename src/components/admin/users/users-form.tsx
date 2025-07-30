'use client'

import { signUpUser } from '@/actions/users'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { CreateUserType } from '@/lib/types'
import { createUserSchema } from '@/lib/zod-schemas'
import { useAuthStore } from '@/store/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ImSpinner6 } from 'react-icons/im'
import { LuEye, LuEyeClosed } from 'react-icons/lu'
import { useShallow } from 'zustand/shallow'

const UsersForm = () => {
	const [isView, setIsView] = useState(false)
	const [isViewConfirm, setIsViewConfirm] = useState(false)
	const [open, setOpen] = useState(false)

	const { userRole } = useAuthStore(
		useShallow((state) => ({
			userRole: state.userRole,
		}))
	)

	const form = useForm<CreateUserType>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
			role: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting

	const submitHandler: SubmitHandler<CreateUserType> = async (
		data: CreateUserType
	) => {
		try {
			const response = await signUpUser(data)
			if (response) {
				toast({
					title: 'Success!',
					description: 'Account created successfully',
					variant: 'default',
				})
				setOpen(false)
				form.reset()
			}
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
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button
					variant="default"
					className="bg-primary-light hover:bg-primary-light/90 text-white font-jose text-base w-40 py-2 shadow-md hover:scale-[1.02] hover:shadow-xl"
				>
					Create New
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[600px] bg-primary text-white font-jose border-none">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(submitHandler, (e) => {
							console.log(e)
						})}
					>
						<DialogHeader className="mb-8">
							<DialogTitle>Create New User</DialogTitle>
						</DialogHeader>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm">
											First Name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												placeholder=""
												{...field}
												className="bg-white text-primary text-sm"
											/>
										</FormControl>
										<FormMessage className="text-red-500 text-sm" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm">
											Last Name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												placeholder=""
												{...field}
												className="bg-white text-primary text-sm"
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
										<FormLabel className="text-sm">
											Email
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												disabled={isSubmitting}
												placeholder=""
												{...field}
												className="bg-white text-primary text-sm"
												autoComplete="new-password"
											/>
										</FormControl>
										<FormMessage className="text-red-500 text-sm" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm">
											Role
										</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												disabled={isSubmitting}
											>
												<FormControl>
													<SelectTrigger className="bg-white text-primary">
														<SelectValue
															defaultValue={
																field.value ||
																''
															}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent className="bg-white text-primary font-jose">
													{userRole ===
														'super-admin' && (
														<>
															<SelectItem value="super-admin">
																Super-Admin
															</SelectItem>
															<SelectItem value="admin">
																Admin
															</SelectItem>
														</>
													)}

													<SelectItem value="supervisor">
														Supervisor
													</SelectItem>
													<SelectItem value="consultant">
														Consultant
													</SelectItem>
												</SelectContent>
											</Select>
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
										<FormLabel className="text-sm">
											Password
										</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												placeholder=""
												type={
													isView ? 'text' : 'password'
												}
												{...field}
												className="bg-white text-primary text-sm"
												autoComplete="new-password"
											/>
										</FormControl>
										{isView ? (
											<LuEye
												className="absolute right-2 top-[30px] lg:top-[34px] z-10 cursor-pointer text-gray-500"
												onClick={() => {
													setIsView(!isView)
												}}
											/>
										) : (
											<LuEyeClosed
												className="absolute right-2 top-[30px] lg:top-[34px] z-10 cursor-pointer text-gray-500"
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
										<FormLabel className="text-sm">
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
												className="bg-white text-primary text-sm"
											/>
										</FormControl>
										{isViewConfirm ? (
											<LuEye
												className="absolute right-2 top-[30px] lg:top-[34px] z-10 cursor-pointer text-gray-500"
												onClick={() => {
													setIsViewConfirm(
														!isViewConfirm
													)
												}}
											/>
										) : (
											<LuEyeClosed
												className="absolute right-2 top-[30px] lg:top-[34px] z-10 cursor-pointer text-gray-500"
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
						</div>
						<DialogFooter>
							<div className="w-2/5 grid grid-cols-2 gap-2 mt-4">
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
			</DialogContent>
		</Dialog>
	)
}

export default UsersForm
