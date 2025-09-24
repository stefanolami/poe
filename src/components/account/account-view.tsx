'use client'

import { ClientDataType } from '@/lib/types'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const AccountView = ({ clientData }: { clientData: ClientDataType }) => {
	const router = useRouter()
	const [showAllEmails, setShowAllEmails] = useState(false)

	return (
		<div>
			<h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4">
				Account Details
			</h2>
			<dl className="space-y-3 text-sm md:text-base">
				<div className="flex justify-between">
					<dt className="text-primary/70">First name</dt>
					<dd>{clientData.first_name || '-'}</dd>
				</div>
				<div className="flex justify-between">
					<dt className="text-primary/70">Last name</dt>
					<dd>{clientData.last_name || '-'}</dd>
				</div>
				<div className="flex justify-between">
					<dt className="text-primary/70">Organization</dt>
					<dd>{clientData.org_name || '-'}</dd>
				</div>
				<div className="flex justify-between">
					<dt className="text-primary/70">Email</dt>
					<dd className="break-all text-right max-w-[60%]">
						{clientData.email || '-'}
					</dd>
				</div>
				<div className="flex flex-col gap-1">
					<div className="flex items-center justify-between">
						<dt className="text-primary/70 whitespace-nowrap mr-4">
							Additional emails
						</dt>
						{clientData.additional_emails &&
						clientData.additional_emails.length > 0 ? (
							<button
								className="text-[10px] md:text-xs text-primary-light hover:underline"
								onClick={(e) => {
									e.preventDefault()
									setShowAllEmails((p) => !p)
								}}
								type="button"
							>
								{showAllEmails ? 'Show less' : 'Show all'}
							</button>
						) : null}
					</div>
					<dd>
						{clientData.additional_emails &&
						clientData.additional_emails.length > 0 ? (
							<ul className="flex flex-wrap gap-1">
								{(showAllEmails
									? clientData.additional_emails
									: clientData.additional_emails.slice(0, 3)
								).map((email) => (
									<li
										key={email}
										className="max-w-[160px] md:max-w-[200px] truncate px-2 py-1 rounded bg-primary/5 text-xs md:text-[13px] border border-primary/20 text-primary/90"
										title={email}
									>
										{email}
									</li>
								))}
								{!showAllEmails &&
									clientData.additional_emails.length > 3 && (
										<li className="px-2 py-1 text-xs md:text-[13px] text-primary/60">
											+
											{clientData.additional_emails
												.length - 3}{' '}
											more
										</li>
									)}
							</ul>
						) : (
							<span className="text-primary/40">-</span>
						)}
					</dd>
				</div>
			</dl>
			<button
				className="text-xs md:text-sm bg-primary-light text-white hover:bg-primary-light/90 shadow-sm hover:shadow transition-transform hover:scale-[1.02] mt-6 px-6 py-2 w-full"
				onClick={() => router.replace('/account/edit')}
			>
				Edit Details
			</button>
		</div>
	)
}

export default AccountView
