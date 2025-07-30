'use client'

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
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { useShallow } from 'zustand/shallow'
import { Skeleton } from '../ui/skeleton'

const ITEMS = [
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
		title: 'Alerts',
		url: '/admin/alerts',
		icon: Megaphone,
	},
	{
		title: 'Clients',
		url: '/admin/clients',
		icon: Users,
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
	const { userRole, authInitialized } = useAuthStore(
		useShallow((state) => ({
			userRole: state.userRole,
			authInitialized: state.authInitialized,
		}))
	)

	if (!authInitialized) {
		return (
			<Sidebar
				collapsible="icon"
				className="bg-primary text-white min-w-[210px] max-w-[320px]"
			>
				<SidebarContent>
					<SidebarMenu>
						<SidebarMenuItem className="mt-4 mb-6">
							<SidebarMenuButton
								asChild
								className="[&>img]:size-8 group-data-[collapsible=icon]:[&>img]:size-6 group-data-[collapsible=icon]:!pr-0"
							>
								<Link
									href="/"
									className="group-data-[collapsible=icon]:!p-0 w-[200px]"
								>
									{/* eslint-disable-next-line */}
									<img
										src={'/logos/icon1.png'}
										alt="Logo"
										className="transition-all duration-200"
									/>
									<span>
										{/* eslint-disable-next-line */}
										<img
											src={'/logos/poe-white.png'}
											alt="Logo"
										/>
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<div className="flex flex-col space-y-2 px-2">
							{[...Array(6)].map((_, i) => (
								<SidebarMenuItem key={i}>
									<SidebarMenuButton className="flex items-center space-x-3">
										<Skeleton className="h-6 w-6 rounded-full bg-white/20" />
										<Skeleton className="h-4 flex-1 rounded-full bg-white/20" />
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</div>
					</SidebarMenu>
				</SidebarContent>
			</Sidebar>
		)
	}

	const filteredItems = ITEMS.filter((item) => {
		if (item.title === 'Users') {
			return userRole === 'super-admin' || userRole === 'admin'
		}
		return true
	})

	return (
		<Sidebar
			collapsible="icon"
			className="bg-primary text-white min-w-[210px] max-w-[320px]"
		>
			<SidebarContent>
				<SidebarMenu>
					<SidebarMenuItem className="mt-4 mb-6">
						<SidebarMenuButton
							asChild
							className="[&>img]:size-8 group-data-[collapsible=icon]:[&>img]:size-6 group-data-[collapsible=icon]:!pr-0"
						>
							<Link
								href="/"
								className="group-data-[collapsible=icon]:!p-0 w-[200px]"
							>
								{/* eslint-disable-next-line */}
								<img
									src={'/logos/icon1.png'}
									alt="Logo"
									className="transition-all duration-200"
								/>
								<span>
									{/* eslint-disable-next-line */}
									<img
										src={'/logos/poe-white.png'}
										alt="Logo"
									/>
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					{filteredItems.map((item) => (
						<SidebarMenuItem
							key={item.title}
							className="hover:translate-x-1 transition-all duration-200"
						>
							<SidebarMenuButton
								asChild
								className="[&>svg]:size-6"
							>
								<Link href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	)
}
