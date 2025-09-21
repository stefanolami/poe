import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
	title: 'Home',
	description:
		'POE e-mobility platform connecting clients, consultants, grants, and tenders.',
})
