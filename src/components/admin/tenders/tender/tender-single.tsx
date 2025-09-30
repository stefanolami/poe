'use client'

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
	CreateTendersTailoredAssessmentType,
	FormattedTenderType,
	TenderWithConsultantType,
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
import TenderEmailPreviewButton from '@/components/emails/tender-email-preview-button'
import { useAuthStore } from '@/store/auth-store'
import { useShallow } from 'zustand/shallow'
import { canSendAlert } from '@/lib/permissions'
import { Skeleton } from '@/components/ui/skeleton'
import {
	addTendersTailoredAssessments,
	filterTenderClients,
	sendTenderAlert,
} from '@/actions/tenders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TenderSingle = ({
	tender,
	clients,
}: {
	tender: TenderWithConsultantType
	clients?: {
		id: string
		first_name: string
		email: string
		last_name: string
	}[]
}) => {
	const [isLoading, setIsLoading] = useState(false)

	const { userRole, authInitialized } = useAuthStore(
		useShallow((state) => ({
			userRole: state.userRole,
			authInitialized: state.authInitialized,
		}))
	)

	const showSend = canSendAlert(userRole)

	const {
		geography,
		sector,
		value,
		programme_title,
		alert_purpose,
		programme_purpose,
		instrument_type,
		awarding_authority,
		consultant,
		id,
		in_brief,
		deadline,
		further_details,
		files,
		tailored_assessment,
		vehicles,
		vehicles_contracts,
		stations,
		stations_contracts,
		geography_details,
		internal_deadline,
		intro,
		subject_matter,
		pre_launch,
		call_title,
		reference_number,
	} = tender

	const router = useRouter()

	const form = useForm<CreateTendersTailoredAssessmentType>({
		resolver: zodResolver(createGrantsTailoredAssessmentSchema),
		defaultValues: {},
	})

	const isSubmitting = form.formState.isSubmitting

	const formattedTender: FormattedTenderType = {
		geography,
		value,
		alert_purpose,
		awarding_authority: awarding_authority ?? '',
		deadline,
		in_brief,
		sector,
		programme_title: tender.programme_title,
		programme_purpose,
		instrument_type,
		geography_details: tender.geography_details ?? undefined,
		internal_deadline: tender.internal_deadline,
		intro: tender.intro,
		subject_matter: tender.subject_matter,
		pre_launch: tender.pre_launch,
		further_details,
		files,
		tailored_assessment: tender.tailored_assessment ?? undefined,
		consultant: tender.consultant?.id ?? undefined,
		vehicles,
		vehicles_contracts,
		stations,
		stations_contracts,
		call_title,
		reference_number,
	}

	const submitHandler: SubmitHandler<
		CreateGrantsTailoredAssessmentType
	> = async (data) => {
		try {
			const response = await addTendersTailoredAssessments(
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
			const response = await sendTenderAlert(id)
			setIsLoading(false)

			if (response) {
				toast({
					title: 'Success!',
					description: 'Tender alert sent successfully',
					variant: 'default',
				})
				setTimeout(() => {
					router.push(`/admin/tenders/`)
				}, 1000)
			}

			return response
		} catch (error) {
			setIsLoading(false)
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
			const response = await filterTenderClients(id)

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
					Tender - {call_title ? call_title : programme_title}
				</h1>
				<button
					disabled={isLoading || isSubmitting}
					className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-primary-light hover:bg-primary-light/90 text-white w-40 py-2"
					onClick={() => router.replace(`/admin/tenders/${id}/edit`)}
				>
					Edit
				</button>
			</div>

			<div className="text-white font-jose text-sm grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-[1000px]">
				{/* Overview */}
				<Card className="bg-white/5 border-white/10 text-white">
					<CardHeader>
						<CardTitle className="text-xl">Overview</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-3">
						<div>
							<div className="text-muted-foreground">Sector</div>
							<div className="text-base">{sector}</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Pre-launch
							</div>
							<div className="text-base">
								{pre_launch ? 'Yes' : 'No'}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">Value</div>
							<div className="text-base">{value}</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Reference Number
							</div>
							<div className="text-base">
								{reference_number ? reference_number : '-'}
							</div>
						</div>
						<div className="col-span-2">
							<div className="text-muted-foreground">
								Consultant
							</div>
							<div className="text-base">
								{consultant
									? `${consultant.first_name} ${consultant.last_name}`
									: '-'}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Programme & Authority */}
				<Card className="bg-white/5 border-white/10 text-white">
					<CardHeader>
						<CardTitle className="text-xl">
							Administrative Details
						</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-3">
						<div>
							<div className="text-muted-foreground">
								Call Title
							</div>
							<div className="text-base">
								{call_title ? call_title : '-'}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Programme Title
							</div>
							<div className="text-base">
								{programme_title ? programme_title : '-'}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Programme Purpose
							</div>
							<div className="text-base">
								{programme_purpose ? programme_purpose : '-'}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Alert Purpose
							</div>
							<div className="text-base">
								{alert_purpose ? alert_purpose : '-'}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Instrument Type
							</div>
							<div className="text-base">
								{instrument_type ? instrument_type : '-'}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Awarding Authority
							</div>
							<div className="text-base">
								{awarding_authority ? awarding_authority : '-'}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Geography */}
				<Card className="bg-white/5 border-white/10 text-white">
					<CardHeader>
						<CardTitle className="text-xl">Geography</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div>
							<div className="text-muted-foreground">Regions</div>
							<div className="text-base">
								{formatGeography(geography)}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Geography Details
							</div>
							<div className="text-base">
								{geography_details ? geography_details : '-'}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Scheduling */}
				<Card className="bg-white/5 border-white/10 text-white">
					<CardHeader>
						<CardTitle className="text-xl">Scheduling</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="grid grid-cols-2 gap-3">
							<div>
								<div className="text-muted-foreground">
									Internal Deadline
								</div>
								<div className="text-base">
									{internal_deadline
										? new Date(
												internal_deadline
											).toLocaleDateString('en-GB')
										: '-'}
								</div>
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Deadlines
							</div>
							<div className="space-y-1">
								{deadline?.map((d, index) => (
									<div
										key={index}
										className="text-base"
									>
										{formatDeadline(d)}
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Narrative */}
				<Card className="bg-white/5 border-white/10 text-white md:col-span-2">
					<CardHeader>
						<CardTitle className="text-xl">Email Brief</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 gap-3">
						<div>
							<div className="text-muted-foreground">Intro</div>
							<div className="text-base">{intro || '-'}</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Subject Matter
							</div>
							<div className="text-base">
								{subject_matter || '-'}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								In Brief
							</div>
							<div className="text-base">
								{in_brief ? in_brief : '-'}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* E-Mobility */}
				<Card className="bg-white/5 border-white/10 text-white">
					<CardHeader>
						<CardTitle className="text-xl">E-Mobility</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-3">
						<div>
							<div className="text-muted-foreground">
								E-Vehicles
							</div>
							<div className="text-base">
								{vehicles && vehicles.length > 0
									? vehicles.join(', ')
									: '-'}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								E-Vehicles Contracts
							</div>
							<div className="text-base">
								{vehicles_contracts &&
								vehicles_contracts.length > 0
									? vehicles_contracts.join(', ')
									: '-'}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Charging Stations
							</div>
							<div className="text-base">
								{stations && stations.length > 0
									? stations.join(', ')
									: '-'}
							</div>
						</div>
						<div>
							<div className="text-muted-foreground">
								Charging Stations Contracts
							</div>
							<div className="text-base">
								{stations_contracts &&
								stations_contracts.length > 0
									? stations_contracts.join(', ')
									: '-'}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Further Details */}
				<Card className="bg-white/5 border-white/10 text-white md:col-span-2">
					<CardHeader>
						<CardTitle className="text-xl">
							Further Details
						</CardTitle>
					</CardHeader>
					<CardContent>
						{further_details && further_details.length > 0 ? (
							<div className="space-y-2">
								{further_details.map((details, index) => {
									const detail = details.split('///')
									return (
										<div
											key={index}
											className="text-base"
										>
											{new Date(
												detail[0]
											).toLocaleDateString('en-GB', {
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
											})}
											{' - '}
											<Link href={detail[1]}>
												{detail[1]}
											</Link>
											{' - '}
											{detail[2]}
										</div>
									)
								})}
							</div>
						) : (
							<div className="text-base">-</div>
						)}
					</CardContent>
				</Card>

				{/* Documents */}
				<Card className="bg-white/5 border-white/10 text-white md:col-span-2">
					<CardHeader>
						<CardTitle className="text-xl mb-2">
							Documents
						</CardTitle>
					</CardHeader>
					<CardContent>
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
									</li>
								))}
							</ul>
						) : (
							<div className="text-base">-</div>
						)}
					</CardContent>
				</Card>

				{/* Tailored Assessment */}
				<Card className="bg-white/5 border-white/10 text-white md:col-span-2">
					<CardHeader>
						<CardTitle className="text-xl">
							Tailored Assessment
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{tailored_assessment &&
						tailored_assessment.length > 0 ? (
							<div className="space-y-3">
								{tailored_assessment.map(
									(assessment, index) => {
										const a = assessment as {
											client: string
											relevance: string
											next_steps: string
										}
										return (
											<div
												key={index}
												className="text-base"
											>
												<div>
													<strong className="text-lg">
														Client
													</strong>{' '}
													- {a.client}
												</div>
												<div>
													<strong className="text-lg">
														Relevance
													</strong>{' '}
													- {a.relevance}
												</div>
												<div>
													<strong className="text-lg">
														Next Steps
													</strong>{' '}
													- {a.next_steps}
												</div>
											</div>
										)
									}
								)}
							</div>
						) : (
							<div className="text-base">-</div>
						)}

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(
									submitHandler,
									(e) => console.log(e)
								)}
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
																					{`${client.first_name} ${client.last_name} - (${client.email})`}
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
															</div>
															<Button
																variant="destructive"
																type="button"
																onClick={() => {
																	const updated =
																		(
																			(field.value ??
																				[]) as [
																				string,
																				string,
																				string,
																			][]
																		).filter(
																			(
																				_,
																				i
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
																	[
																		'',
																		'',
																		'',
																	],
																])
															}
															className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
														>
															Add Tailored
															Assessment
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
					</CardContent>
				</Card>

				{/* Actions */}
				<Card className="bg-white/5 border-white/10 text-white md:col-span-2">
					<CardHeader>
						<CardTitle className="text-xl">Actions</CardTitle>
					</CardHeader>
					<CardContent>
						{authInitialized ? (
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								{showSend && (
									<ButtonWithAlert
										buttonText="Send"
										dialogText="Are you sure you want to send this Grant alert?"
										confirmText="Send"
										action={handleSend}
										disabled={isLoading || isSubmitting}
										buttonClass="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
									>
										<TenderEmailPreviewButton
											emailData={formattedTender}
											disabled={isLoading || isSubmitting}
										/>
									</ButtonWithAlert>
								)}
								<Button
									disabled={isLoading || isSubmitting}
									variant="default"
									type="button"
									className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
									onClick={handleFilterClients}
								>
									Filter Clients
								</Button>
								<TenderEmailPreviewButton
									emailData={formattedTender}
									disabled={isLoading || isSubmitting}
								/>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<Skeleton className="h-9" />
								<Skeleton className="h-9" />
								<Skeleton className="h-9" />
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{isLoading && <LoadingOverlay />}
		</div>
	)
}

export default TenderSingle

/* const Divider = () => (
	<div className="border-t border-white my-4 w-4/5 col-span-2" />
) */
