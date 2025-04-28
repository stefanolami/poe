import { getTender } from '@/actions/tenders'
import React from 'react'

const TenderSingle = async ({ id }: { id: string }) => {
	const tender = await getTender(Number(id))

	if (!tender) {
		return <div>Tender not found</div>
	}

	console.log(tender)

	return <div className="text-white">{tender.title}</div>
}

export default TenderSingle
