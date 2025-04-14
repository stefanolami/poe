import Footer from '@/components/footer'
import '../../globals.css'
import HeaderAdmin from '@/components/admin/header/header-admin'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<HeaderAdmin />
			<div className="h-16 xl:h-24 bg-primary"></div>
			<main className="font-jose">{children}</main>
			<Footer />
		</>
	)
}
