'use client'

import { updateUser } from '@/actions/users'
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
import { MultiSelect } from '@/components/ui/multi-select'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { UpdateUserType, UserClientType, UserType } from '@/lib/types'
import { updateUserSchema } from '@/lib/zod-schemas'
import { useAuthStore } from '@/store/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ImSpinner6 } from 'react-icons/im'
import { useShallow } from 'zustand/shallow'

const UserEditForm = ({
	user,
	clientsData,
}: {
	user: UserType
	clientsData: UserClientType[] | null
}) => {
	const [open, setOpen] = useState(false)

	const { userRole } = useAuthStore(
		useShallow((state) => ({
			userRole: state.userRole,
		}))
	)

	const router = useRouter()

	const form = useForm<UpdateUserType>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			firstName: user.first_name,
			lastName: user.last_name,
			email: user.email,
			role: user.role,
			clients: user.clients,
		},
	})

	const isSubmitting = form.formState.isSubmitting

	const clientsArray = clientsData
		? clientsData.map((client) => {
				return {
					value: client.id,
					label: `${client.name} (${client.org})`,
				}
			})
		: []

	const submitHandler: SubmitHandler<UpdateUserType> = async (
		data: UpdateUserType
	) => {
		console.log('Form data:', data)
		try {
			const response = await updateUser(data, user.id)
			if (response) {
				form.reset({
					firstName: response.first_name,
					lastName: response.last_name,
					email: response.email,
					role: response.role,
					clients: response.clients,
				})
				toast({
					title: 'Success!',
					description: 'User updated successfully',
					variant: 'default',
				})
				setOpen(false)
				router.refresh()
			}
		} catch (error) {
			if (error instanceof Error) {
				toast({
					title: 'Error',
					description: 'An error occurred while updating the user',
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
					Edit
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
							<DialogTitle>Edit User</DialogTitle>
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
															tabIndex={0}
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
							{form.watch('role') === 'supervisor' && (
								<FormField
									control={form.control}
									name="clients"
									render={({ field }) => (
										<FormItem className="col-span-2">
											<FormLabel className="text-sm">
												Clients
											</FormLabel>
											<FormControl>
												<MultiSelect
													className="bg-white text-primary hover:bg-white"
													onValueChange={
														field.onChange
													}
													defaultValue={
														field.value || []
													}
													disabled={isSubmitting}
													variant="default"
													selectAll={false}
													searchable={true}
													maxCount={20}
													placeholder="Select clients"
													options={clientsArray}
												/>
											</FormControl>
											<FormMessage className="text-red-500 text-sm" />
										</FormItem>
									)}
								/>
							)}
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

export default UserEditForm
