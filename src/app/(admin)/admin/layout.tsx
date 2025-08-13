import '../../globals.css'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Suspense } from 'react'
import LoadingAdmin from '@/components/loading-admin'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<AdminSidebar />
			<Suspense fallback={<LoadingAdmin />}>
				<main className="w-full bg-primary min-h-screen">
					<SidebarTrigger className="text-white" />
					<div className="w-full pt-8 px-8">{children}</div>
				</main>
			</Suspense>
		</SidebarProvider>
	)
}
