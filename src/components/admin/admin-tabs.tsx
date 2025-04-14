'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const LINKS = [
	{ name: 'DASHBOARD', url: '/admin/dashboard' },
	{ name: 'TENDERS', url: '/admin/tenders' },
	{ name: 'NOTIFICATIONS', url: '/admin/notifications' },
	{ name: 'CLIENTS', url: '/admin/clients' },
	{ name: 'AGENTS', url: '/admin/agents' },
]

const AdminTabs = () => {
	const [selected, setSelected] =
		useState<SetStateAction<Record<string, string>>>()

	const pathname = usePathname()

	useEffect(() => {
		const activeLink = LINKS.find((link) => link.url === pathname)
		if (activeLink) {
			setSelected(activeLink)
		}
	}, [pathname])

	return (
		<div className="px-4 flex items-center justify-center flex-wrap gap-2">
			{LINKS.map((link, index) => (
				<Link
					href={`${link.url}`}
					key={index}
				>
					<Tab
						link={link}
						selected={selected === link}
						setSelected={setSelected}
						key={index}
					/>
				</Link>
			))}
		</div>
	)
}

const Tab = ({
	selected,
	setSelected,
	link,
}: {
	selected: boolean
	setSelected: Dispatch<SetStateAction<Record<string, string>>>
	link: { name: string; url: string }
}) => {
	return (
		<button
			onClick={() => setSelected(link)}
			className={`text-white text-sm transition-colors px-4 pt-3 pb-2 relative`}
		>
			<span className="relative z-10 font-jose font-bold">
				{link.name}
			</span>
			{selected && (
				<motion.span
					layoutId="pill-tab"
					transition={{ type: 'spring', duration: 0.5, from: 0 }}
					className={`absolute inset-0 z-0 bg-primary-light shadow-md`}
				></motion.span>
			)}
		</button>
	)
}

export default AdminTabs
