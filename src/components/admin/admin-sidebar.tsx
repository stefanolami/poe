import {
	BarChart3,
	Search,
	Settings,
	Megaphone,
	ShieldUser,
	Users,
	Landmark,
	Gavel,
	Banknote,
} from 'lucide-react'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import Image from 'next/image'
import Link from 'next/link'

// Menu items.
const items = [
	{
		title: 'Dashboard',
		url: '/admin/dashboard',
		icon: BarChart3,
	},
	{
		title: 'Grants',
		url: '/admin/grants',
		icon: Landmark,
	},
	{
		title: 'Procurement Tenders',
		url: '/admin/tenders',
		icon: Gavel,
	},
	{
		title: 'Investment Financing',
		url: '/admin/investment-financing',
		icon: Banknote,
	},
	{
		title: 'Clients',
		url: '/admin/clients',
		icon: Users,
	},
	{
		title: 'Alerts',
		url: '/admin/alerts',
		icon: Megaphone,
	},
	{
		title: 'Users',
		url: '/admin/users',
		icon: ShieldUser,
	},
	{
		title: 'Search',
		url: '#',
		icon: Search,
	},
	{
		title: 'Settings',
		url: '#',
		icon: Settings,
	},
]

export function AdminSidebar() {
	return (
		<Sidebar
			collapsible="icon"
			className="bg-primary text-white"
		>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="mb-8 mt-2">
						<Link
							href="/"
							className="w-2/3 aspect-[116/24] relative "
						>
							<Image
								src={'/logos/poe-white.png'}
								alt="Logo"
								fill
								className=""
							/>
						</Link>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem
									key={item.title}
									className="hover:translate-x-1 transition-all duration-200"
								>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
