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
import { MultiSelect } from '@/components/ui/multi-select'
//import { cn } from '@/lib/utils'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { CreateGrantType } from '@/lib/types'
import { createGrantSchema } from '@/lib/zod-schemas'
import { geographiesArray } from '@/data/data'
import { Textarea } from '@/components/ui/textarea'
import GrantsDeadline from './form-fields/grants-deadline'
import GrantsFurtherDetails from './form-fields/grants-further-details'
import GrantsConsultant from './form-fields/grants-consultant'
import { createGrant } from '@/actions/grants'
import GrantsFormEmobility from './grants-form-emobility'
import { FaFolderOpen } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

const SECTORS = [
	{
		value: 'e-mobility',
		label: 'E-Mobility',
	},
	{
		value: 'aviation',
		label: 'Aviation',
	},
]

export const GrantsForm = ({
	consultants,
}: {
	consultants: {
		id: string
		name: string
	}[]
}) => {
	const { toast } = useToast()

	const router = useRouter()

	const form = useForm<CreateGrantType>({
		resolver: zodResolver(createGrantSchema),
		defaultValues: {
			call_title: '',
			grant_programme: '',
			value: '',
			alert_purpose: '',
			programme_purpose: '',
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
		try {
			const response = await createGrant(data)

			if (response) {
				toast({
					title: 'Success!',
					description: 'Grant created successfully',
					variant: 'default',
				})
				setTimeout(() => {
					router.push('/admin/grants')
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
		}
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
				<h1>
					{
						SECTORS.find((s) => s.value == form.watch('sector'))
							?.label
					}
				</h1>
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
									<FormItem className="col-span-2">
										<FormLabel>Geography</FormLabel>
										<FormControl>
											<MultiSelect
												className="bg-white text-primary hover:bg-white"
												onValueChange={field.onChange}
												variant="default"
												selectAll={false}
												searchable
												maxCount={10}
												options={geographiesArray}
												disabled={isSubmitting}
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
											disabled={isSubmitting}
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
								name="programme_purpose"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Programme Purpose</FormLabel>
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
							<GrantsConsultant
								form={form}
								consultants={consultants}
								isSubmitting={isSubmitting}
							/>
							<FormField
								control={form.control}
								name="in_brief"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormLabel>In Brief</FormLabel>
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
							<GrantsDeadline
								form={form}
								isSubmitting={isSubmitting}
							/>
							<GrantsFurtherDetails
								form={form}
								isSubmitting={isSubmitting}
							/>
							<FormField
								control={form.control}
								name="files"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormLabel>Files</FormLabel>
										<FormControl>
											<div className="flex items-center gap-2">
												<span className="truncate block text-sm text-primary bg-white pl-3 pr-7 py-[7px] border-gray-200 min-w-[120px] w-full relative">
													{field.value &&
													field.value.length > 0
														? field.value
																.map(
																	(
																		file: File
																	) =>
																		file.name
																)
																.join(', ')
														: 'No files chosen'}
													{field.value &&
														field.value.length >
															0 && (
															<button
																type="button"
																onClick={() =>
																	field.onChange(
																		[]
																	)
																}
																className="text-primary scale-150 absolute top-[10px] right-2"
																title="Clear files"
															>
																<IoClose />
															</button>
														)}
												</span>

												<label className="inline-flex items-center cursor-pointer">
													<input
														disabled={isSubmitting}
														type="file"
														multiple
														className="hidden"
														onChange={(e) => {
															field.onChange(
																e.target.files
																	? Array.from(
																			e
																				.target
																				.files
																		)
																	: []
															)
														}}
													/>
													<span className="bg-white/5 hover:bg-white/5 px-2 py-2 shadow-md hover:shadow-xl text-white flex items-center justify-center transition-colors duration-150">
														<FaFolderOpen className="w-5 h-5" />
													</span>
												</label>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{form.watch('sector') === 'e-mobility' ? (
							<GrantsFormEmobility form={form} />
						) : null}
					</div>
					<Button
						disabled={isSubmitting}
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
