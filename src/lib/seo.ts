import type { Metadata } from 'next'

const siteName = 'POE'
const siteUrl = 'https://www.consultingontap.com'

export const defaultOpenGraph: Metadata['openGraph'] = {
	type: 'website',
	siteName,
	url: siteUrl,
}

export const defaultTwitter: Metadata['twitter'] = {
	card: 'summary_large_image',
}

export function buildMetadata({
	title,
	description = '',
}: {
	title: string
	description?: string
}): Metadata {
	const fullTitle = title.includes('POE') ? title : `${title} | ${siteName}`
	return {
		title: fullTitle,
		description,
		openGraph: {
			...defaultOpenGraph,
			title: fullTitle,
			description,
		},
		twitter: {
			...defaultTwitter,
			title: fullTitle,
			description,
		},
	}
}
