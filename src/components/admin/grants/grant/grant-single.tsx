'use client'

import {
	addGrantsTailoredAssessments,
	filterGrantClients,
	sendGrantAlert,
} from '@/actions/grants'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import {
	CreateGrantsTailoredAssessmentType,
	FormattedGrantType,
	GrantWithConsultantType,
} from '@/lib/types'
import { formatDeadline, formatGeography } from '@/lib/utils'
import { createGrantsTailoredAssessmentSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaTrashAlt } from 'react-icons/fa'
import DocViewerComponent from '../../doc-viewer'
import ButtonWithAlert from '@/components/button-alert'
import LoadingOverlay from '@/components/loading-overlay'
import EmailPreviewButton from '@/components/emails/email-preview-button'

const GrantSingle = ({
	grant,
	clients,
}: {
	grant: GrantWithConsultantType
	clients?: { id: string; name: string; email: string; family_name: string }[]
}) => {
	const [isLoading, setIsLoading] = useState(false)

	const {
		geography,
		sector,
		value,
		call_title,
		grant_programme,
		alert_purpose,
		programme_purpose,
		instrument_type,
		awarding_authority,
		reference_number,
		consultant,
		id,
		in_brief,
		deadline,
		further_details,
		files,
		tailored_assessment,
		deployment,
		project,
	} = grant

	const router = useRouter()

	const form = useForm<CreateGrantsTailoredAssessmentType>({
		resolver: zodResolver(createGrantsTailoredAssessmentSchema),
		defaultValues: {},
	})

	const isSubmitting = form.formState.isSubmitting

	const formattedGrant: FormattedGrantType = {
		...grant,
		consultant: grant.consultant?.id ?? undefined,
	}

	const submitHandler: SubmitHandler<
		CreateGrantsTailoredAssessmentType
	> = async (data) => {
		console.log('DATA', data)
		try {
			const response = await addGrantsTailoredAssessments(
				id,
				data.tailored_assessment ?? []
			)

			if (response) {
				toast({
					title: 'Success!',
					description: 'Tailored Assessment/s created successfully',
					variant: 'default',
				})
				setTimeout(() => {
					form.reset()
					router.refresh()
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

	const handleSend = async () => {
		try {
			setIsLoading(true)
			const response = await sendGrantAlert(id)
			setIsLoading(false)

			if (response) {
				toast({
					title: 'Success!',
					description: 'Grant alert sent successfully',
					variant: 'default',
				})
				setTimeout(() => {
					router.push(`/admin/grants/`)
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

	const handleFilterClients = async () => {
		try {
			setIsLoading(true)
			const response = await filterGrantClients(id)

			if (!response) {
				toast({
					title: 'Success!',
					description: 'Clients filtered successfully',
					variant: 'default',
				})
				router.refresh()
			} else {
				toast({
					title: 'Error',
					description:
						'An unexpected error occurred, please try again',
					variant: 'destructive',
				})
			}
			setIsLoading(false)
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

	return (
		<div className="font-jose mb-20">
			<div className="flex flex-row items-center justify-between w-full">
				<h1 className="text-white font-jose text-2xl">
					Grant -{' '}
					{grant.call_title
						? grant.call_title
						: grant.grant_programme}
				</h1>
				<button
					disabled={isLoading || isSubmitting}
					className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-primary-light hover:bg-primary-light/90 text-white w-40 py-2"
					onClick={() => router.replace(`/admin/grants/${id}/edit`)}
				>
					Edit
				</button>
			</div>
			<div className="text-white font-jose text-sm grid grid-cols-2 gap-4 mt-12 space-y-2 max-w-[800px]">
				<div className="flex flex-col gap-2 col-span-2">
					<span className="block text-xl">Geography</span>
					<span className="block text-base">
						{formatGeography(geography)}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Sector</span>
					<span className="block text-base">{sector}</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Value</span>
					<span className="block text-base">{value}</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Call Title</span>
					<span className="block text-base">
						{call_title ? call_title : '-'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Grant Programme</span>
					<span className="block text-base">
						{grant_programme ? grant_programme : '-'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Alert Purpose</span>
					<span className="block text-base">
						{alert_purpose ? alert_purpose : '-'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Programme Purpose</span>
					<span className="block text-base">
						{programme_purpose ? programme_purpose : '-'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Instrument Type</span>
					<span className="block text-base">
						{instrument_type ? instrument_type : '-'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Awarding Authority</span>
					<span className="block text-base">
						{awarding_authority ? awarding_authority : '-'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Reference Number</span>
					<span className="block text-base">
						{reference_number ? reference_number : '-'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Consultant</span>
					<span className="block text-base">
						{consultant
							? `${consultant.name} ${consultant.family_name}`
							: '-'}
					</span>
				</div>
				{/* <Divider /> */}
				<div className="flex flex-col gap-2 col-span-2">
					<span className="block text-xl">In Brief</span>
					<span className="block text-base">
						{in_brief ? in_brief : '-'}
					</span>
				</div>
				<div className="flex flex-col gap-2 col-span-2">
					<span className="block text-xl">Deadline</span>
					{deadline.map((d, index) => (
						<span
							key={index}
							className="block text-base"
						>
							{formatDeadline(d)}
						</span>
					))}
				</div>
				<div className="flex flex-col gap-2 col-span-2">
					<span className="block text-xl">Further Details</span>
					{further_details && further_details.length > 0 ? (
						further_details.map((details, index) => {
							const detail = details.split('///')
							return (
								<span
									key={index}
									className="block text-base"
								>
									{new Date(detail[0]).toLocaleDateString(
										'en-GB',
										{
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
										}
									)}
									{' - '}
									<Link href={detail[1]}>{detail[1]}</Link>
									{' - '}
									{detail[2]}
								</span>
							)
						})
					) : (
						<span className="block text-base">-</span>
					)}
				</div>
				<div className="col-span-2">
					<span className="block text-xl mb-2">Documents</span>
					{files && files.length > 0 ? (
						<ul className="list-disc pl-5 space-y-2">
							{files.map((file, index) => (
								<li key={index}>
									<DocViewerComponent
										docName={file.slice(8)}
										doc={[
											{
												uri: `https://wgbitmetlwsyukgoortd.supabase.co/storage/v1/object/public/documents${file}`,
											},
										]}
									/>
									{/* <a
										href={`https://wgbitmetlwsyukgoortd.supabase.co/storage/v1/object/public/documents${file}`}
										target="_blank"
										className="underline text-base"
									>
										{file.slice(8)}
									</a> */}
								</li>
							))}
						</ul>
					) : (
						<span className="block text-base">-</span>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Grants Deployment</span>
					<span className="block text-base">
						{deployment && deployment.length > 0
							? deployment.join(', ')
							: '-'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">
						Grants Innovative Project
					</span>
					<span className="block text-base">
						{project && project.length > 0
							? project.join(', ')
							: '-'}
					</span>
				</div>
				<div className="flex flex-col gap-2 col-span-2">
					<span className="block text-xl">Tailored Assessment</span>
					{tailored_assessment && tailored_assessment.length > 0 ? (
						tailored_assessment.map((assessment, index) => {
							const a = assessment as {
								client: string
								relevance: string
								next_steps: string
							}
							console.log('assessment', assessment)
							return (
								<div
									key={index}
									className="text-base"
								>
									<span className="block text-base">
										<strong className="text-lg">
											Client
										</strong>{' '}
										- {a.client}
									</span>
									<span className="block text-base">
										<strong className="text-lg">
											Relevance
										</strong>{' '}
										- {a.relevance}
									</span>
									<span className="block text-base">
										<strong className="text-lg">
											Next Steps
										</strong>{' '}
										- {a.next_steps}
									</span>
								</div>
							)
						})
					) : (
						<span className="block text-base">-</span>
					)}
				</div>
				<div className="col-span-2">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(submitHandler, (e) =>
								console.log(e)
							)}
							className=""
						>
							<FormField
								control={form.control}
								name="tailored_assessment"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormControl>
											<div className="space-y-4">
												{(
													(field.value ?? []) as [
														string,
														string,
														string,
													][]
												).map((detail, index) => (
													<div
														className="flex flex-row justify-start items-start gap-6 my-8"
														key={index}
													>
														<div className="flex flex-col w-full gap-4 items-start">
															<Select
																disabled={
																	isSubmitting ||
																	isLoading
																}
																value={
																	detail[0] ??
																	''
																}
																onValueChange={(
																	val
																) => {
																	const updated =
																		[
																			...(field.value ??
																				[]),
																		]
																	updated[
																		index
																	] = [
																		val,
																		detail[1] ??
																			'',
																		detail[2] ??
																			'',
																	]
																	field.onChange(
																		updated
																	)
																}}
															>
																<FormControl>
																	<SelectTrigger className="bg-white text-primary">
																		<SelectValue placeholder="Select a client" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent className="bg-white text-primary font-jose">
																	{clients?.map(
																		(
																			client
																		) => (
																			<SelectItem
																				key={
																					client.id
																				}
																				value={
																					client.email
																				}
																			>
																				{`${client.name} ${client.family_name} - (${client.email})`}
																			</SelectItem>
																		)
																	)}
																</SelectContent>
															</Select>
															<Textarea
																disabled={
																	isSubmitting ||
																	isLoading
																}
																placeholder="Relevance"
																value={
																	detail[1] ||
																	''
																}
																onChange={(
																	e
																) => {
																	const updated =
																		[
																			...(field.value ??
																				[]),
																		]
																	updated[
																		index
																	][1] =
																		e.target.value
																	field.onChange(
																		updated
																	)
																}}
																className="bg-white text-primary min-h-[150px]"
															/>
															<Textarea
																disabled={
																	isSubmitting ||
																	isLoading
																}
																placeholder="Next Steps"
																value={
																	detail[2] ||
																	''
																}
																onChange={(
																	e
																) => {
																	const updated =
																		[
																			...(field.value ??
																				[]),
																		]
																	updated[
																		index
																	][2] =
																		e.target.value
																	field.onChange(
																		updated
																	)
																}}
																className="bg-white text-primary min-h-[150px]"
															/>
															{/* <input
																				type="file"
																				multiple
																				onChange={(
																					e
																				) => {
																					const updated =
																						[
																							...(field.value ??
																								[]),
																						]
																					updated[
																						index
																					][3] = e
																						.target
																						.files
																						? Array.from(
																								e
																									.target
																									.files
																							)
																						: []
																					field.onChange(
																						updated
																					)
																				}}
																				className="bg-white text-primary"
																			/> */}
														</div>
														<Button
															variant="destructive"
															type="button"
															onClick={() => {
																const updated =
																	(
																		field.value ??
																		[]
																	).filter(
																		(
																			//eslint-disable-next-line
																			_: any,
																			i: number
																		) =>
																			i !==
																			index
																	)
																field.onChange(
																	updated
																)
															}}
															className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
														>
															<FaTrashAlt className="h-4 w-4" />
														</Button>
													</div>
												))}
												<div className="space-x-4">
													<Button
														disabled={
															isLoading ||
															isSubmitting
														}
														variant="default"
														type="button"
														onClick={() =>
															field.onChange([
																...(field.value ??
																	[]),
																['', '', ''], // default empty row
															])
														}
														className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
													>
														Add Tailored Assessment
													</Button>
													{Array.isArray(
														field.value
													) &&
														field.value.length >
															0 && (
															<Button
																disabled={
																	isLoading ||
																	isSubmitting
																}
																variant="default"
																type="submit"
																className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5 px-8"
															>
																Save
															</Button>
														)}
												</div>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</div>
				<div className="grid grid-cols-4 col-span-2 gap-4">
					<ButtonWithAlert
						buttonText="Send"
						dialogText="Are you sure you want to send this Grant alert?"
						confirmText="Send"
						action={handleSend}
						disabled={isLoading || isSubmitting}
						buttonClass="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
					>
						<EmailPreviewButton
							emailData={formattedGrant}
							disabled={isLoading || isSubmitting}
						/>
					</ButtonWithAlert>
					<Button
						disabled={isLoading || isSubmitting}
						variant="default"
						type="button"
						className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
						onClick={handleFilterClients}
					>
						Filter Clients
					</Button>
					<EmailPreviewButton
						emailData={formattedGrant}
						disabled={isLoading || isSubmitting}
					/>
				</div>
			</div>
			{isLoading && <LoadingOverlay />}
		</div>
	)
}

export default GrantSingle

/* const Divider = () => (
	<div className="border-t border-white my-4 w-4/5 col-span-2" />
) */
