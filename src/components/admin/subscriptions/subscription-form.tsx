'use client'

import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSubscription, updateSubscription } from '@/actions/subscriptions'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
	createSubscriptionSchema,
	updateSubscriptionSchema,
} from '@/lib/zod-schemas'

interface FormClientRef {
	id: string
	name: string
	email: string
}
interface BaseValues {
	clientId?: string
	periodStart: string
	periodEnd: string
	status: 'active' | 'expired' | 'frozen'
}
interface SubscriptionFormProps {
	mode: 'create' | 'edit'
	subscriptionId?: string
	defaultValues?: BaseValues
	clients?: FormClientRef[]
}

export default function SubscriptionForm({
	mode,
	subscriptionId,
	defaultValues,
	clients = [],
}: SubscriptionFormProps) {
	const isEdit = mode === 'edit'
	const router = useRouter()

	const schema = isEdit
		? updateSubscriptionSchema
				.pick({ period_start: true, period_end: true, status: true })
				.transform((val) => ({
					periodStart: val.period_start || '',
					periodEnd: val.period_end || '',
					status: (val.status as BaseValues['status']) || 'active',
				}))
		: createSubscriptionSchema
				.pick({
					clientId: true,
					periodStart: true,
					periodEnd: true,
					status: true,
				})
				.refine(
					(data) =>
						!data.periodEnd || data.periodStart <= data.periodEnd,
					{
						message: 'End date must be after start date',
						path: ['periodEnd'],
					}
				)
				.transform((val) => val)

	type FormValues = z.infer<typeof schema>

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues || {
			clientId: '',
			periodStart: '',
			periodEnd: '',
			status: 'active',
		},
	})

	const submitting = form.formState.isSubmitting

	const periodStartWatch = form.watch('periodStart')
	useEffect(() => {
		if (!periodStartWatch) {
			form.setValue('periodEnd', '')
			return
		}
		const start = new Date(periodStartWatch)
		if (isNaN(start.getTime())) return
		const end = new Date(start)
		end.setFullYear(end.getFullYear() + 1)
		end.setDate(end.getDate() - 1)
		const y = end.getFullYear()
		const m = String(end.getMonth() + 1).padStart(2, '0')
		const d = String(end.getDate()).padStart(2, '0')
		const endStr = `${y}-${m}-${d}`
		if (form.getValues('periodEnd') !== endStr)
			form.setValue('periodEnd', endStr, { shouldValidate: true })
	}, [periodStartWatch, form])

	async function onSubmit(values: FormValues) {
		try {
			if (isEdit && subscriptionId) {
				await updateSubscription(subscriptionId, {
					period_start: values.periodStart || undefined,
					period_end: values.periodEnd || undefined,
					status: values.status,
				})
			} else if (!isEdit) {
				const createVals = values as FormValues & { clientId: string }
				await createSubscription({
					clientId: createVals.clientId,
					periodStart: createVals.periodStart,
					periodEnd: createVals.periodEnd,
					status: createVals.status,
				})
			}
			router.push('/admin/subscriptions')
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<div className="w-1/2 mb-16">
			<h1 className="text-white font-jose text-2xl mb-16">
				{isEdit ? 'Edit Subscription' : 'Create New Subscription'}
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="text-white font-jose"
				>
					<div className="grid grid-cols-2 gap-4 mb-4">
						{!isEdit && (
							<FormField
								name="clientId"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Client</FormLabel>
										<FormControl>
											<Select
												value={field.value}
												onValueChange={field.onChange}
												disabled={submitting}
											>
												<SelectTrigger className="bg-white text-primary">
													<SelectValue placeholder="Select client" />
												</SelectTrigger>
												<SelectContent className="bg-white text-primary">
													{clients.map((c) => (
														<SelectItem
															key={c.id}
															value={c.id}
														>{`${c.name} (${c.email})`}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<FormField
							name="status"
							control={form.control}
							render={({ field }) => (
								<FormItem className="">
									<FormLabel>Status</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={submitting}
										>
											<SelectTrigger className="bg-white text-primary">
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent className="bg-white text-primary">
												{[
													'active',
													'expired',
													'frozen',
												].map((s) => (
													<SelectItem
														key={s}
														value={s}
													>
														{s}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<FormField
							name="periodStart"
							control={form.control}
							render={({ field }) => {
								const date = field.value
									? new Date(field.value)
									: null
								return (
									<FormItem className="flex flex-col gap-2">
										<FormLabel>Period Start</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="pl-3 text-left font-normal bg-white text-primary hover:bg-white hover:text-primary"
													disabled={submitting}
												>
													{date
														? date.toLocaleDateString(
																'en-GB'
															)
														: 'Select date'}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent
												align="start"
												className="w-auto p-0"
											>
												<Calendar
													className="bg-white text-primary"
													mode="single"
													selected={date || undefined}
													onSelect={(d) => {
														if (!d)
															return field.onChange(
																''
															)
														const year =
															d.getFullYear()
														const month = String(
															d.getMonth() + 1
														).padStart(2, '0')
														const day = String(
															d.getDate()
														).padStart(2, '0')
														field.onChange(
															`${year}-${month}-${day}`
														)
													}}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)
							}}
						/>
						{/* <div className="flex flex-col gap-2">
							<FormLabel>Period End (auto)</FormLabel>
							<div className="pl-3 pr-3 py-2 bg-white text-primary rounded border border-primary/20 text-sm min-h-[40px] flex items-center">
								{form.watch('periodEnd')
									? new Date(
											form.watch('periodEnd')
										).toLocaleDateString('en-GB')
									: '--'}
							</div>
							<p className="text-xs text-white/70">
								Automatically set to one year minus one day
								after the start date.
							</p>
						</div> */}
					</div>
					<Button
						type="submit"
						disabled={submitting}
						className="bg-primary-light hover:bg-primary-light/90 text-white shadow-md hover:shadow-xl hover:scale-[1.02] mt-8 px-12 py-2"
					>
						{isEdit ? 'Save' : 'Create'}
					</Button>
				</form>
			</Form>
		</div>
	)
}
