import type { Metadata } from 'next'
import { RenderMounted } from '@/components/render-mounted'
import { jose, unna } from '@/app/fonts'
import { Suspense } from 'react'
import Loading from '@/components/loading'
import '@/app/globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/auth/auth-provider'

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
				className={`${unna.variable} ${jose.variable} antialiased relative min-h-screen`}
			>
				<AuthProvider>
					<RenderMounted>
						<Suspense fallback={<Loading />}>{children}</Suspense>
					</RenderMounted>
				</AuthProvider>
				<Toaster />
			</body>
		</html>
	)
}
