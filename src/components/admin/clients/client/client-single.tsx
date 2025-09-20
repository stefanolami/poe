'use client'

import { ClientType } from '@/lib/types'

type SelectionItemType = {
	value: string
	geography: string[]
}

const ClientSingle = ({ client }: { client: ClientType }) => {
	const {
		name,
		family_name,
		email,
		org_name,
		created_at,
		deployment,
		project,
		referrer,
		additional_emails,
		/* vehicles_type,
		vehicles_contract,
		charging_stations_type,
		charging_stations_contract,
		pif, */
	} = client

	console.log('CLIENT:', client)

	return (
		<div className="font-jose mb-20">
			<div className="flex flex-row items-center justify-between w-full">
				<h1 className="text-white font-jose text-2xl">
					Client - {name} {family_name}{' '}
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
						{name} {family_name}
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
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Last Payment</span>
					<span className="block text-base">12/02/2025</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Account Active</span>
					<span className="block text-base">YES</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Followed By</span>
					<span className="block text-base">Consultant name</span>
				</div>
			</div>
			<h2 className="text-white font-jose text-xl mt-12">
				Selection Info
			</h2>
			<div className="text-white font-jose text-sm grid grid-cols-2 gap-4 mt-6 space-y-2 max-w-[800px]">
				<h3 className="text-white font-jose text-xl col-span-2">
					- Grants
				</h3>
				<div className="flex flex-col gap-2 pl-3">
					<span className="block text-xl">
						Infrastructure Deployment
					</span>
					<span className="block text-base">
						{(deployment as SelectionItemType[])
							.map((d) => d.value)
							.join(', ') || '--'}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">
						Innovation Driven Projects
					</span>
					<span className="block text-base">
						{(project as SelectionItemType[])
							.map((d) => d.value)
							.join(', ') || '--'}
					</span>
				</div>
			</div>
		</div>
	)
}

export default ClientSingle
