'use client'

import { ClientDataType } from '@/lib/types'
import { useRouter } from 'next/navigation'
import React from 'react'

const AccountView = ({ clientData }: { clientData: ClientDataType }) => {
	const router = useRouter()

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
