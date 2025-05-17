import { Home, Inbox, Search, Settings } from 'lucide-react'

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
		title: 'Dasboard',
		url: '/admin/dashboard',
		icon: Home,
	},
	{
		title: 'Grants',
		url: '/admin/grants',
		icon: Inbox,
	},
	{
		title: 'Investment Financing',
		url: '/admin/investment-financing',
		icon: Inbox,
	},
	{
		title: 'Procurement Tenders',
		url: '/admin/tenders',
		icon: Inbox,
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

export function AppSidebar() {
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
								<SidebarMenuItem key={item.title}>
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
