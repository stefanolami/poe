import { ClientDataType } from '@/lib/types'
import Link from 'next/link'
import React from 'react'

const AccountView = ({ clientData }: { clientData: ClientDataType }) => {
	return (
		<div>
			<h2 className="text-lg md:text-xl lg:text-3xl mb-4 lg:mb-10">
				Your Account
			</h2>
			<div className="my-4 text-base md:text-lg lg:text-xl space-y-1 lg:space-y-2">
				<div>
					<span>Name:</span>
					<span className="ml-2">{clientData.name}</span>
				</div>
				<div>
					<span>Family Name:</span>
					<span className="ml-2">{clientData.family_name}</span>
				</div>
				<div>
					<span>Organization:</span>
					<span className="ml-2">{clientData.org_name}</span>
				</div>
				<div>
					<span>Email:</span>
					<span className="ml-2">{clientData.email}</span>
				</div>
			</div>
			<Link href="/account/edit">
				<button className="text-sm md:text-base lg:text-lg bg-primary-light text-white hover:bg-primary-light shadow-md hover:shadow-xl hover:scale-[1.02] mt-8 px-12 py-2">
					Edit
				</button>
			</Link>
		</div>
	)
}

export default AccountView
