import type { Metadata } from 'next'
import { RenderMounted } from '@/components/render-mounted'
import { jose, unna } from '@/app/fonts'
import { Suspense } from 'react'
import Loading from '@/components/loading'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
	title: 'POE',
	description: '',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${unna.variable} ${jose.variable} antialiased relative`}
			>
				<RenderMounted>
					<Suspense fallback={<Loading />}>{children}</Suspense>
				</RenderMounted>
				<Toaster />
			</body>
		</html>
	)
}
