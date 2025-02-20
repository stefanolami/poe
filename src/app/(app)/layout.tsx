import Footer from '@/components/footer'
import Header from '@/components/header/header'
import '../globals.css'

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<div className="h-16 xl:h-24"></div>
			<main className="font-jose">{children}</main>
			<Footer />
		</>
	)
}
