import '../../globals.css'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/admin/app-sidebar'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="w-full bg-primary">
				<SidebarTrigger className="text-white" />
				<div className="w-full pt-8 px-8">{children}</div>
			</main>
		</SidebarProvider>
	)
}
