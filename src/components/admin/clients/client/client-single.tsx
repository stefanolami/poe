'use client'

import { ClientWithConsultantType } from '@/lib/types'
import { useState, useTransition } from 'react'
import { updateClientTailored, updateClientConsultant } from '@/actions/clients'
import {
	addClientToConsultant,
	removeClientFromConsultant,
} from '@/actions/consultants'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

type SelectionItemType = {
	value: string
	geography: string[]
}

const ClientSingle = ({
	client,
	consultants,
}: {
	client: ClientWithConsultantType
	consultants?: { id: string; first_name: string; last_name: string }[]
}) => {
	const [isPending, startTransition] = useTransition()
	const [tailored, setTailored] = useState<boolean>(!!client.tailored)
	const [consultantId, setConsultantId] = useState<string | 'none' | ''>(
		(client.consultant?.id as string | undefined) || 'none'
	)
	const {
		first_name,
		last_name,
		email,
		org_name,
		created_at,
		deployment,
		project,
		referrer,
		additional_emails,
		account_status,
		vehicles_type,
		vehicles_contract,
		charging_stations_type,
		charging_stations_contract,
	} = client

	console.log('CLIENT:', client)

	return (
		<div className="font-jose mb-20">
			<div className="flex flex-row items-center justify-between w-full">
				<h1 className="text-white font-jose text-2xl">
					Client - {first_name} {last_name}{' '}
					<span className="capitalize">({org_name})</span>
				</h1>
				{/* <button className="invisible shadow-md hover:shadow-xl hover:scale-[1.02] bg-primary-light hover:bg-primary-light/90 text-white w-40 py-2">
					Edit
				</button> */}
			</div>
			<h2 className="text-white font-jose text-xl mt-12">General Info</h2>
			<div className="text-white font-jose text-sm grid grid-cols-2 gap-4 mt-6 space-y-2 max-w-[800px]">
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Name</span>
					<span className="block text-base">
						{first_name} {last_name}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Email</span>
					<span className="block text-base">{email}</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Additional Emails</span>
					{additional_emails && additional_emails.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{additional_emails.map((addr, idx) => (
								<span
									key={`${addr}-${idx}`}
									className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs md:text-sm"
								>
									{addr}
								</span>
							))}
						</div>
					) : (
						<span className="block text-base">--</span>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Organization</span>
					<span className="block text-base">{org_name ?? '--'}</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Registration Date</span>
					<span className="block text-base">
						{new Date(created_at).toLocaleDateString('en-GB', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
						})}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Referrer</span>
					<span className="block text-base">{referrer}</span>
				</div>
				{/* <div className="flex flex-col gap-2">
					<span className="block text-xl">Last Payment</span>
					<span className="block text-base">12/02/2025</span>
				</div> */}
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Account Active</span>
					<span className="block text-base">{account_status}</span>
				</div>
				<div className="flex flex-col gap-2"></div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl invisible">Tailoring</span>
					<label className="inline-flex items-center gap-3 cursor-pointer select-none">
						<input
							type="checkbox"
							checked={tailored}
							disabled={isPending}
							onChange={() => {
								const next = !tailored
								setTailored(next) // optimistic
								startTransition(async () => {
									try {
										await updateClientTailored(
											client.id,
											next
										)
										console.log('Toggled tailored to', next)
									} catch (err) {
										console.error(
											'Failed to toggle tailored',
											err
										)
										setTailored(!next) // revert
									}
								})
							}}
							className="custom-checkbox cursor-pointer"
							/* 						className="h-5 w-5 appearance-none rounded border border-white/40 bg-white/10 checked:bg-primary-light checked:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/50"
							 */
						/>
						<span className="text-base">Tailored</span>
					</label>
				</div>
				<div className="flex flex-col gap-2">
					{tailored && (
						<div className="max-w-xs">
							<span className="block text-xl mb-1">
								Followed By
							</span>
							<Select
								disabled={isPending}
								onValueChange={(val) => {
									const next =
										val === 'none' ? null : (val as string)
									const prev =
										consultantId === 'none'
											? null
											: consultantId
									setConsultantId(val as string)
									startTransition(async () => {
										try {
											// 1) Update client record
											await updateClientConsultant(
												client.id,
												next
											)
											// 2) Update consultant users' clients[]
											if (prev && prev !== next) {
												await removeClientFromConsultant(
													prev,
													client.id
												)
											}
											if (next && prev !== next) {
												await addClientToConsultant(
													next,
													client.id
												)
											}
											toast({
												title: 'Success!',
												description:
													'Consultant assigned successfully',
												variant: 'default',
											})
										} catch (err) {
											console.error(
												'Failed to update consultant links',
												err
											)
											toast({
												title: 'Error',
												description:
													'Consultant assignment failed',
												variant: 'default',
											})
										}
									})
								}}
								value={consultantId}
							>
								<SelectTrigger className="bg-white text-primary">
									<SelectValue placeholder="Select consultant" />
								</SelectTrigger>
								<SelectContent className="bg-white text-primary font-jose">
									<SelectItem value="none">
										No Consultant
									</SelectItem>
									{consultants?.map((c) => (
										<SelectItem
											key={c.id}
											value={c.id}
										>
											{c.first_name} {c.last_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</div>
			</div>
			{/* Tailored toggle */}

			<h2 className="text-white font-jose text-xl mt-12">
				Selection Info
			</h2>
			<div className="text-white font-jose text-sm grid grid-cols-2 gap-4 mt-6 space-y-2 max-w-[800px]">
				<h3 className="text-white font-jose text-xl col-span-2">
					- Grants
				</h3>
				<div className="flex flex-col gap-2 pl-3">
					<span className="block text-lg">
						Infrastructure Deployment
					</span>
					<span className="block text-base">
						{(deployment as SelectionItemType[])
							.map((d) => d.value)
							.join(', ') || '--'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-lg">
						Innovation Driven Projects
					</span>
					<span className="block text-base">
						{(project as SelectionItemType[])
							.map((d) => d.value)
							.join(', ') || '--'}
					</span>
				</div>
			</div>
			<div className="text-white font-jose text-sm grid grid-cols-2 gap-4 mt-6 space-y-2 max-w-[800px]">
				<h3 className="text-white font-jose text-xl col-span-2">
					- Procurement Tenders
				</h3>
				<div className="flex flex-col gap-2 pl-3">
					<span className="block text-lg">E-Vehicles</span>
					<span className="block text-base">
						{(vehicles_type as SelectionItemType[])
							.map((d) => d.value)
							.join(', ') || '--'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-lg">E-Vehicles Contracts</span>
					<span className="block text-base">
						{(vehicles_contract as string[]).join(', ') || '--'}
					</span>
				</div>
				<div className="flex flex-col gap-2 pl-3">
					<span className="block text-lg">Charging Stations</span>
					<span className="block text-base">
						{(charging_stations_type as SelectionItemType[])
							.map((d) => d.value)
							.join(', ') || '--'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-lg">
						Charging Stations Contracts
					</span>
					<span className="block text-base">
						{(charging_stations_contract as string[]).join(', ') ||
							'--'}
					</span>
				</div>
			</div>
		</div>
	)
}

export default ClientSingle
