import type { Metadata } from 'next'
import HomeComponent from '@/components/home/home'

export const metadata: Metadata = {
	title: 'POE',
	description: 'POE - Public Opportunities Essentials',
}

export default function HomePage() {
	return <HomeComponent />
}
