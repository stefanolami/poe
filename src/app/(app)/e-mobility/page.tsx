import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'E-Mobility | POE',
	description: 'Explore e-mobility grants, tenders, and insights.',
}

import EmobilityComponent from '@/components/e-mobility/e-mobility'
import React from 'react'

const EmobilityPage = () => {
	return <EmobilityComponent />
}

export default EmobilityPage
