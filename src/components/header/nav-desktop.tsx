'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
	{
		name: 'WHO WE ARE',
		url: 'https://www.consultingontap.com/who-we-are',
	},
	{
		name: 'SERVICES',
		url: 'https://www.consultingontap.com/services',
	},
	{
		name: 'SECTORS',
		url: 'https://www.consultingontap.com/sectors',
	},
	{
		name: 'WHY US',
		url: 'https://www.consultingontap.com/why-us',
		sublinks: [
			{
				name: 'OVERVIEW',
				url: 'https://www.consultingontap.com/why-us',
			},
			{
				name: 'CLIENT CODEX',
				url: 'https://www.consultingontap.com/why-us#client-codex',
			},
			{
				name: 'ENDORSEMENTS',
				url: 'https://www.consultingontap.com/why-us#endorsements',
			},
		],
	},
	{
		name: 'CONTACT',
		url: 'https://www.consultingontap.com/contact',
	},
]

export default function Navbar() {
	const path = usePathname()
	return (
		<div
			id="desktop-nav"
			className="hidden lg:flex flex-row justify-between items-center gap-12 h-full font-unna font-bold"
		>
			{/* CHANGE TO GRID-COLS-6 */}
			<nav
				id="desktop-nav"
				className="grid grid-cols-6 text-center uppercase h-full *:px-4 text-base"
			>
				<Link
					className={`relative hover:bg-primary-light active-link
						${path == '/' ? 'active-link' : ''}`}
					href="/"
				>
					POE
				</Link>
				{LINKS.map((link, index) => {
					if (link.sublinks) {
						return (
							<div
								key={index}
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
									{link.sublinks.map((sublink, index) => (
										<Link
											href={`${sublink.url}`}
											className="desktop-nav-li w-full h-full bg-primary py-3 hover:scale-110 hover:shadow-xl mt-1 hover:bg-primary-light"
											key={index}
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
								key={index}
								className={`relative hover:bg-primary-light
						${path == '/contact' ? 'active-link' : ''}
						`}
								href={`${link.url}`}
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
