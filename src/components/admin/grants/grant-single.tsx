import { getGrant } from '@/actions/grants'
import React from 'react'

const GrantSingle = async ({ id }: { id: string }) => {
	const grant = await getGrant(Number(id))

	if (!grant) {
		return <div>Tender not found</div>
	}

	return (
		<div className="text-white">
			{grant.call_title ? grant.call_title : grant.grant_programme}
		</div>
	)
}

export default GrantSingle
