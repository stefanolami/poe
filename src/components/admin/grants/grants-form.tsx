'use client'

import { SubmitHandler, useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
//import { Textarea } from '@/components/ui/textarea'
import { MultiSelect } from '@/components/ui/multi-select'
//import { cn } from '@/lib/utils'
/* import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select' */
//import TenderFormEmobility from './grants-form-emobility'
//import { useToast } from '@/hooks/use-toast'
//import { useRouter } from 'next/navigation'
import { CreateGrantType } from '@/lib/types'
import { createGrantSchema } from '@/lib/zod-schemas'
import { geographiesArray } from '@/data/data'
import { Textarea } from '@/components/ui/textarea'
import GrantsDeadline from './form-fields/grants-deadline'
import GrantsFurtherDetails from './form-fields/grants-further-details'
import GrantsConsultant from './form-fields/grants-consultant'

/* const SECTORS = [
	{
		value: 'e-mobility',
		label: 'E-Mobility',
	},
	{
		value: 'aviation',
		label: 'Aviation',
	},
] */

export const GrantsForm = ({
	consultants,
}: {
	consultants: {
		id: number
		name: string
	}[]
}) => {
	//const { toast } = useToast()

	//const router = useRouter()

	const form = useForm<CreateGrantType>({
		resolver: zodResolver(createGrantSchema),
		defaultValues: {
			call_title: '',
			grant_programme: '',
			value: '',
			alert_purpose: '',
			instrument_type: '',
			awarding_authority: '',
			reference_number: '',
			deadline: [['', '', '']],
			in_brief: '',
			further_details: [],
			tailored_assessment: [],
		},
	})

	const isSubmitting = form.formState.isSubmitting

	const submitHandler: SubmitHandler<CreateGrantType> = async (data) => {
		console.log('DATA', data)
		/* try {
			const response = await createTender(data)

			if (response) {
				toast({
					title: 'Tender Created',
					description: 'Tender created successfully',
					variant: 'default',
				})
				setTimeout(() => {
					router.push('/admin/tenders')
				}, 1000)
			}

			console.log(response)

			return response
		} catch (error) {
			if (error instanceof Error) {
				toast({
					title: 'Error',
					description: error.message,
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
		} */
	}

	/* useEffect(() => {
		if (defaultValues) {
			form.reset(defaultValues)
		} else {
			form.reset()
		}
	}, [defaultValues, form]) */

	return (
		<div className="w-full mb-16">
			<div className="grid grid-cols-2 items-start gap-4 text-white font-jose text-2xl mb-16">
				<h1 className="">Create New Grant</h1>
				{/* <h1>
					{
						SECTORS.find((s) => s.value == form.watch('sector'))
							?.label
					}
				</h1> */}
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(submitHandler, (e) =>
						console.log(e)
					)}
					className=""
				>
					<div className="grid grid-cols-2 gap-4">
						<div className="grid grid-cols-2 items-center text-white font-jose gap-x-3 gap-y-2">
							<FormField
								control={form.control}
								name="geography"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Geography</FormLabel>
										<FormControl>
											<MultiSelect
												className="bg-white text-primary hover:bg-white h-9"
												onValueChange={field.onChange}
												variant="default"
												selectAll={false}
												searchable
												options={geographiesArray}
											/>
										</FormControl>
										<FormMessage className="text-red-500 text-sm" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Value</FormLabel>
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
								name="call_title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Call Title</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												placeholder=""
												{...field}
												className="bg-white text-primary"
											/>
										</FormControl>
										<FormMessage className="text-red-500 text-sm text-nowrap" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="grant_programme"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Grant Programme</FormLabel>
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
								name="alert_purpose"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Alert Purpose</FormLabel>
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
								name="instrument_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Instrument Type</FormLabel>
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
								name="awarding_authority"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Awarding Authority
										</FormLabel>
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
								name="reference_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Reference Number</FormLabel>
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
								name="in_brief"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormLabel>Desc</FormLabel>
										<FormControl>
											<Textarea
												disabled={isSubmitting}
												placeholder=""
												{...field}
												className="bg-white text-primary min-h-28"
											/>
										</FormControl>
										<FormMessage className="text-red-500 text-sm" />
									</FormItem>
								)}
							/>
							<GrantsDeadline form={form} />
							<GrantsFurtherDetails form={form} />
							<GrantsConsultant
								form={form}
								consultants={consultants}
							/>
							{/* <FormField
								control={form.control}
								name="submission_language"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Submission Language
										</FormLabel>
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
								name="sector"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Sector</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-white text-primary">
													<SelectValue placeholder="Select an option" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="bg-white text-primary font-jose">
												<SelectItem value="e-mobility">
													E-Mobility
												</SelectItem>
												<SelectItem value="aviation">
													Aviation
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="eu_funded"
								render={({ field }) => (
									<FormItem>
										<FormLabel>EU Funded</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												className="flex flex-row space-y-1"
											>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem
															value="yes"
															className="bg-white"
														/>
													</FormControl>
													<FormLabel className="font-normal">
														Yes
													</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem
															value="no"
															className="bg-white"
														/>
													</FormControl>
													<FormLabel className="font-normal">
														No
													</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage className="text-red-500 text-sm" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="eu_funded_details"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											EU Funded Details *
										</FormLabel>
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
							<div className="col-span-2 flex items-center justify-between">
								<FormField
									control={form.control}
									name="lots_divided"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Divided in Lots
											</FormLabel>
											<FormControl>
												<RadioGroup
													onValueChange={
														field.onChange
													}
													className="flex flex-row space-y-1"
												>
													<FormItem className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem
																value="yes"
																className="bg-white"
															/>
														</FormControl>
														<FormLabel className="font-normal">
															Yes
														</FormLabel>
													</FormItem>
													<FormItem className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem
																value="no"
																className="bg-white"
															/>
														</FormControl>
														<FormLabel className="font-normal">
															No
														</FormLabel>
													</FormItem>
												</RadioGroup>
											</FormControl>
											<FormMessage className="text-red-500 text-sm" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="tenders_for_all_lots"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Tenders for all Lots *
											</FormLabel>
											<FormControl>
												<RadioGroup
													onValueChange={
														field.onChange
													}
													className="flex flex-row space-y-1"
												>
													<FormItem className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem
																value="yes"
																className="bg-white"
															/>
														</FormControl>
														<FormLabel className="font-normal">
															Yes
														</FormLabel>
													</FormItem>
													<FormItem className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem
																value="no"
																className="bg-white"
															/>
														</FormControl>
														<FormLabel className="font-normal">
															No
														</FormLabel>
													</FormItem>
												</RadioGroup>
											</FormControl>
											<FormMessage className="text-red-500 text-sm" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lots_number"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Number of Lots *
											</FormLabel>
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
							</div>
							<FormField
								control={form.control}
								name="opening"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Publication Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={'outline'}
														className={cn(
															'pl-3 text-left font-normal  bg-white hover:bg-white text-primary hover:text-primary'
														)}
													>
														{field.value ? (
															field.value.toLocaleDateString(
																'it-IT'
															)
														) : (
															<span>
																Pick a date
															</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<Calendar
													className="bg-white text-primary"
													mode="single"
													selected={field.value}
													onSelect={(date) => {
														field.onChange(date)
														console.log(date)
													}}
													disabled={(date) =>
														date < new Date()
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="closing"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											Submission Deadline
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={'outline'}
														className={cn(
															'pl-3 text-left font-normal  bg-white hover:bg-white text-primary hover:text-primary'
														)}
													>
														{field.value ? (
															field.value.toLocaleDateString(
																'it-IT'
															)
														) : (
															<span>
																Pick a date
															</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-full p-0"
												align="start"
											>
												<Calendar
													className="bg-white text-primary"
													mode="single"
													selected={field.value}
													onSelect={(date) => {
														field.onChange(date)
														console.log(date)
													}}
													disabled={(date) =>
														date < new Date()
													}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="agent"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Agent</FormLabel>
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
							/> */}
						</div>
						{/* {form.watch('sector') === 'e-mobility' ? (
							<TenderFormEmobility form={form} />
						) : null} */}
					</div>
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
	)
}
