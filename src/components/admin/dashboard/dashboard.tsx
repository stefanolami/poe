import { getDashboardData } from '@/actions/dashboard'
import { DashboardCardSection } from '@/components/ui/blocks/dashboard-cards-section'
import React from 'react'

const DashboardComponent = async () => {
	const data = await getDashboardData()
	console.log('Dashboard data:', data)
	return (
		<div className="bg-primary text-white">
			<h1 className="text-white font-jose text-2xl">Dashboard</h1>
			<DashboardCardSection data={data} />
		</div>
	)
}

export default DashboardComponent
