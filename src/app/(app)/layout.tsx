import Footer from '@/components/footer'
import Header from '@/components/header/header'
import '../globals.css'

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<div className="h-16 lg:h-24"></div>
			<main className="font-jose min-h-[calc(100dvh-160px)] lg:min-h-screen-[calc(100vh-256px)] pt-10 md:pt-16 lg:py-20 xl:py-24">
				{children}
			</main>
			<Footer />
		</>
	)
}
