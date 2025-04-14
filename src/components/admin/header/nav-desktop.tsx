'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
	{
		name: 'YOUR ACCESS',
		url: '/your-access',
	},
	{
		name: 'WHO WE ARE',
		url: '/who-we-are',
		sublinks: [
			{
				name: 'ABOUT US',
				url: '/about-us',
			},
			{
				name: 'OUR TEAM',
				url: '/our-team',
			},
		],
	},
	{
		name: 'SERVICES',
		url: '/services',
	},
	{
		name: 'WHY US',
		url: '/why-us',
		sublinks: [
			{
				name: 'OVERVIEW',
				url: '/overview',
			},

			{
				name: 'CLIENT CODEX',
				url: '/client-codex',
			},
		],
	},
	{
		name: 'CONTACT',
		url: '/contact',
	},
]

export default function Navbar() {
	const path = usePathname()
	return (
		<div
			id="desktop-nav"
			className="hidden md:flex flex-row justify-between items-center gap-12 h-full font-unna font-bold"
		>
			{/* CHANGE TO GRID-COLS-6 */}
			<nav
				id="desktop-nav"
				className="grid grid-cols-6 text-center uppercase h-full *:px-4 text-base"
			>
				<Link
					className={`relative hover:bg-primary-light
						${path == '/' ? 'active-link' : ''}`}
					href="/poe"
				>
					POE
				</Link>
				{LINKS.map((link) => {
					if (link.sublinks) {
						return (
							<div
								key={link.url}
								className="group relative flex items-center justify-center cursor-pointer"
							>
								<span
									className={`block
							${path.includes('us') ? 'active-link-nested' : ''}
							`}
								>
									{link.name}
								</span>
								<div className="hidden group-hover:flex flex-col items-center justify-center gap-1 w-full absolute top-full">
									{link.sublinks.map((sublink) => (
										<Link
											href={`https://funding-kohl.vercel.app/en${sublink.url}`}
											className="desktop-nav-li w-full h-full bg-primary py-3 hover:scale-110 hover:shadow-xl mt-1 hover:bg-primary-light"
											key={sublink.url}
										>
											{sublink.name}
										</Link>
									))}
								</div>
							</div>
						)
					} else {
						return (
							<Link
								key={link.url}
								className={`relative hover:bg-primary-light
						${path == '/contact' ? 'active-link' : ''}
						`}
								href={`https://funding-kohl.vercel.app/en${link.url}`}
							>
								{link.name}
							</Link>
						)
					}
				})}
			</nav>
			{/* <DesktopLocaleSwitcher /> */}
		</div>
	)
}
