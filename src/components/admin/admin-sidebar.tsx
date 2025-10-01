'use client'

import {
	BarChart3,
	//Search,
	//Settings,
	Megaphone,
	ShieldUser,
	Users,
	Landmark,
	Gavel,
	Banknote,
	LogOut,
	CreditCard,
} from 'lucide-react'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { useShallow } from 'zustand/shallow'
import { Skeleton } from '../ui/skeleton'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/actions/auth'

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
		url: '/admin/investments',
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
		title: 'Subscriptions',
		url: '/admin/subscriptions',
		icon: CreditCard,
	},
	{
		title: 'Users',
		url: '/admin/users',
		icon: ShieldUser,
	},
	/* {
		title: 'Search',
		url: '#',
		icon: Search,
	},
	{
		title: 'Settings',
		url: '#',
		icon: Settings,
	}, */
]

export function AdminSidebar() {
	const { userRole, authInitialized, setUserRole } = useAuthStore(
		useShallow((state) => ({
			userRole: state.userRole,
			authInitialized: state.authInitialized,
			setUserRole: state.setUserRole,
		}))
	)

	const pathname = usePathname()
	const { setOpenMobile } = useSidebar()

	const router = useRouter()

	const handleMenuItemClick = () => {
		setOpenMobile(false)
	}

	const handleLogout = async () => {
		await signOut()
		setUserRole(null)
		router.push('/')
	}

	if (!authInitialized) {
		return (
			<Sidebar
				collapsible="icon"
				className="bg-primary text-white"
			>
				<SidebarContent className="overflow-hidden">
					<SidebarMenu>
						<SidebarMenuItem className="mt-4 mb-10">
							<SidebarMenuButton
								asChild
								className="[&>img]:size-8 group-data-[collapsible=icon]:[&>img]:size-6 group-data-[collapsible=icon]:!pr-0 w-[200px]"
							>
								<Link
									href="/"
									className="group-data-[collapsible=icon]:!p-0"
								>
									{/* eslint-disable-next-line */}
									<img
										src={'/logos/consulting-logo.png'}
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
						<div className="flex flex-col space-y-3 mr-6">
							{[...Array(7)].map((_, i) => (
								<SidebarMenuItem key={i}>
									<SidebarMenuButton className="flex justify-start items-center">
										<Skeleton className="h-6 w-6 rounded-full bg-white/20" />
										<Skeleton className="h-5 flex-1 rounded-full bg-white/20" />
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</div>
					</SidebarMenu>
				</SidebarContent>
				<SidebarFooter>
					<button className="flex justify-start items-center space-x-2 mr-6 mb-2">
						<Skeleton className="h-6 w-6 rounded-full bg-white/20" />
						<Skeleton className="h-5 flex-1 rounded-full bg-white/20" />
					</button>
				</SidebarFooter>
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
			className="bg-primary text-white overflow-hidden font-jose text-base"
		>
			<SidebarContent className="overflow-hidden">
				<SidebarMenu>
					<SidebarMenuItem className="mt-4 mb-10">
						<SidebarMenuButton
							asChild
							className="[&>img]:size-8 group-data-[collapsible=icon]:[&>img]:size-6 group-data-[collapsible=icon]:!pr-0 w-[200px]"
						>
							<Link
								href="/"
								className="group-data-[collapsible=icon]:!p-0"
							>
								{/* eslint-disable-next-line */}
								<img
									src={'/logos/consulting-logo.png'}
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
							className={`${pathname.startsWith(item.url) ? 'bg-gradient-to-r from-secondary to-primary' : ''}`}
						>
							<SidebarMenuButton
								asChild
								className="[&>svg]:size-6 hover:translate-x-1 transition-all duration-200"
							>
								<Link
									href={item.url}
									onClick={handleMenuItemClick}
								>
									<item.icon />
									<span className="text-base mt-1">
										{item.title}
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<button
					onClick={handleLogout}
					className="[&>svg]:size-6 [&>svg]:shrink-0 hover:translate-x-1 transition-all duration-200 flex items-center gap-2 pb-2"
				>
					<LogOut />
					<span className="group-data-[collapsible=icon]:hidden text-base mt-1">
						Logout
					</span>
				</button>
			</SidebarFooter>
		</Sidebar>
	)
}
