import type { Metadata } from 'next'
import HomeComponent from '@/components/home/home'

export const metadata: Metadata = {
	title: 'Home | POE',
	description:
		'POE e-mobility platform connecting clients, consultants, grants, and tenders.',
}

export default function HomePage() {
	return <HomeComponent />
}
