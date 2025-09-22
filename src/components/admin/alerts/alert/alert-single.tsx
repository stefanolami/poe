'use client'

import { AlertType } from '@/lib/types'
import Link from 'next/link'

const AlertSingle = ({
	alert,
	clients,
}: {
	alert: AlertType
	clients: {
		first_name: string
		last_name: string
		id: string
		email: string
	}[]
}) => {
	const { entity_type, entity_id, created_at, subject } = alert

	return (
		<div className="font-jose mb-20">
			<div className="flex flex-row items-center justify-between w-full">
				<h1 className="text-white font-jose text-2xl">
					Alert - {subject}{' '}
					<span className="capitalize">({entity_type})</span>
				</h1>
				<button className="invisible shadow-md hover:shadow-xl hover:scale-[1.02] bg-primary-light hover:bg-primary-light/90 text-white w-40 py-2">
					Edit
				</button>
			</div>
			<div className="text-white font-jose text-sm grid grid-cols-1 gap-4 mt-12 space-y-2 max-w-[800px]">
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Date</span>
					<span className="block text-base">{created_at}</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl capitalize">
						{entity_type}
					</span>
					<span className="block text-base underline">
						<Link href={`/admin/${entity_type}s/${entity_id}`}>
							{subject}
						</Link>
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Clients</span>
					<div className="text-base">
						{clients && clients.length > 0 ? (
							<ul className="list-disc pl-5 space-y-2">
								{clients.map((client, index) => (
									<li key={index}>
										<Link
											href={`/admin/clients/${client.id}`}
											className="underline"
										>
											<span className="capitalize">
												{client.first_name}{' '}
												{client.last_name}
											</span>{' '}
											- {client.email}
										</Link>
									</li>
								))}
							</ul>
						) : (
							<p className="text-base">No clients matched</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default AlertSingle
