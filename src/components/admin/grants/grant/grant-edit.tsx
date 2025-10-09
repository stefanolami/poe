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
import { CreateGrantType, GrantType, UpdateGrantType } from '@/lib/types'
import { createGrantSchema } from '@/lib/zod-schemas'
import { geographiesArray } from '@/data/data'
import { Textarea } from '@/components/ui/textarea'
import GrantsDeadline from '../form-fields/grants-deadline'
import GrantsFurtherDetails from '../form-fields/grants-further-details'
import GrantsConsultant from '../form-fields/grants-consultant'
import { updateGrant } from '@/actions/grants'
import GrantsFormEmobility from '../grants-form-emobility'
import { FaFolderOpen, FaTrashAlt } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

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

export const GrantEdit = ({
	grant,
	consultants,
}: {
	grant: GrantType
	consultants: {
		id: string
		name: string
	}[]
}) => {
	const {
		id,
		geography,
		consultant,
		sector,
		value,
		call_title,
		programme_title,
		alert_purpose,
		programme_purpose,
		instrument_type,
		awarding_authority,
		reference_number,
		in_brief,
		deadline,
		further_details,
		files,
		tailored_assessment,
		geography_details,
		internal_deadline,
		intro,
		subject_matter,
		pre_launch,
		deployment,
		project,
	} = grant

	const [filesArray, setFilesArray] = useState(files || [])

	// avoid unused variable warnings if not used below
	void programme_purpose
	void instrument_type
	void awarding_authority
	void reference_number

	const formattedDeadline = deadline.map((d) => d.split('///'))
	const formattedFurtherDetails = further_details?.map((d) => d.split('///'))
	const formattedTailoredAssessment = tailored_assessment?.map((t) => [
		t.client,
		t.relevance,
		t.next_steps,
	])

	const { toast } = useToast()

	const router = useRouter()

	const form = useForm<CreateGrantType>({
		resolver: zodResolver(createGrantSchema),
		defaultValues: {
			geography: geography || [],
			//@ts-expect-error id is a string in the form, but consultant is an object in the grant
			consultant: consultant ? consultant.id : '',
			sector: sector || '',
			call_title: call_title || '',
			programme_title: programme_title || '',
			value: value || '',
			alert_purpose: alert_purpose || '',
			geography_details: geography_details || '',
			internal_deadline: internal_deadline || '',
			intro: intro || '',
			subject_matter: subject_matter || '',
			pre_launch: pre_launch || false,
			deadline: formattedDeadline || [['', '', '']],
			in_brief: in_brief || '',
			further_details: formattedFurtherDetails || [],
			tailored_assessment: formattedTailoredAssessment || [],
			reference_number: reference_number || '',
			deployment: deployment || [],
			project: project || [],
			programme_purpose: programme_purpose || '',
			instrument_type: instrument_type || '',
			awarding_authority: awarding_authority || '',
		},
	})

	//const preLaunch = form.watch('pre_launch')

	const isSubmitting = form.formState.isSubmitting

	const handleFileDelete = (file: string) => {
		setFilesArray((prevFiles) => prevFiles.filter((f) => f !== file))
	}

	const submitHandler: SubmitHandler<CreateGrantType> = async (data) => {
		console.log('Form data:', data)
		const formattedData: UpdateGrantType = {
			...data,
			oldFiles: filesArray,
		}
		try {
			const response = await updateGrant(id, formattedData)

			if (response) {
				toast({
					title: 'Success!',
					description: 'Grant updated successfully',
					variant: 'default',
				})
				setTimeout(() => {
					router.push(`/admin/grants/${id}`)
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
		<div className="form w-full mb-16">
			<div className="grid grid-cols-2 items-start gap-4 text-white font-jose text-2xl mb-24">
				<h1 className="">Edit Grant</h1>
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
						<div className="relative grid grid-cols-2 items-center text-white font-jose gap-x-3 gap-y-2">
							<FormField
								control={form.control}
								name="pre_launch"
								render={({ field }) => (
									<FormItem className="absolute -top-14 left-0">
										<FormControl>
											<label className="inline-flex items-center gap-3 cursor-pointer select-none">
												<input
													type="checkbox"
													className=" custom-checkbox cursor-pointer"
													checked={field.value}
													onChange={(e) =>
														field.onChange(
															e.target.checked
														)
													}
													disabled={isSubmitting}
												/>
												<span className="text-base">
													Pre Launch
												</span>
											</label>
										</FormControl>
										<FormMessage className="text-red-500 text-sm" />
									</FormItem>
								)}
							/>
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
												defaultValue={field.value}
											/>
										</FormControl>
										<FormMessage className="text-red-500 text-sm" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="geography_details"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormLabel>Geography Details</FormLabel>
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
								name="programme_title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Programme Title</FormLabel>
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
								name="subject_matter"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Subject Matter</FormLabel>
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
								name="internal_deadline"
								render={({ field }) => (
									<FormItem className="flex flex-col justify-start">
										<FormLabel className="my-1">
											Internal Deadline
										</FormLabel>
										<FormControl>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant={'outline'}
														className="pl-3 text-left font-normal bg-white hover:bg-white text-primary hover:text-primary"
														disabled={isSubmitting}
													>
														{field.value ? (
															new Date(
																field.value
															).toLocaleDateString(
																'it-IT'
															)
														) : (
															<span>Date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</PopoverTrigger>
												<PopoverContent
													className="w-auto p-0"
													align="start"
												>
													<Calendar
														className="bg-white text-primary"
														mode="single"
														selected={
															field.value
																? new Date(
																		field.value
																	)
																: undefined
														}
														onSelect={(d) => {
															if (!d)
																return field.onChange(
																	''
																)
															const nd = new Date(
																d.getFullYear(),
																d.getMonth(),
																d.getDate(),
																12,
																0,
																0,
																0
															)
															field.onChange(
																nd.toISOString()
															)
														}}
														disabled={(date) =>
															date < new Date()
														}
													/>
												</PopoverContent>
											</Popover>
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
								name="intro"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormLabel>Intro</FormLabel>
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

							{filesArray && filesArray.length > 0 ? (
								<div className="col-span-2 mb-4">
									<span className="block mb-2">
										Documents
									</span>
									<ul className="list-disc pl-5 space-y-2">
										{filesArray.map((file, index) => (
											<li key={index}>
												<div className="flex items-center justify-start gap-10">
													<a
														href={`https://wgbitmetlwsyukgoortd.supabase.co/storage/v1/object/public/documents${file}`}
														target="_blank"
														className="underline"
													>
														{file.slice(8)}
													</a>
													<button
														type="button"
														onClick={() =>
															handleFileDelete(
																file
															)
														}
														className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5 px-2 py-2"
													>
														<FaTrashAlt className="h-3 w-3" />
													</button>
												</div>
											</li>
										))}
									</ul>
								</div>
							) : null}

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
													<span className="bg-white/5 hover:bg-white/5 px-2 py-2 shadow-md hover:shadow-xl hover:scale-[1.02] text-white flex items-center justify-center transition-colors duration-150">
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
