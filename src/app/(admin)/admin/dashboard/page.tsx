import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Admin Dashboard | POE',
	description: 'Overview of platform activity and KPIs.',
}
import DashboardComponent from '@/components/admin/dashboard/dashboard'
import React from 'react'

const DashboardPage = () => {
	return <DashboardComponent />
}

export default DashboardPage
