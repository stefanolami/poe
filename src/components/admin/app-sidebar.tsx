import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react'

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

// Menu items.
const items = [
	{
		title: 'Dasboard',
		url: '/admin/dashboard',
		icon: Home,
	},
	{
		title: 'Tenders',
		url: '/admin/tenders',
		icon: Inbox,
	},
	{
		title: 'Calendar',
		url: '#',
		icon: Calendar,
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
					<SidebarGroupLabel className="w-1/2 aspect-[695/184] relative mb-8">
						<Image
							src={'/logos/funding-white.png'}
							alt="Logo"
							fill
							className=""
						/>
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
