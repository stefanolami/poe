'use client'

import { motion, MotionConfig } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
/* import MobileLocaleSwitcher from './MobileLocaleSwitcher' */
import { FiChevronDown } from 'react-icons/fi'
import UsersLoginSection from '../users-login-section'

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

export default function NavMobile() {
	const [active, setActive] = useState(false)
	const [subMenu, setSubMenu] = useState('')

	useEffect(() => {
		if (active) {
			document.body.classList.add('overflow-y-hidden')
		} else {
			document.body.classList.remove('overflow-y-hidden')
		}
	}, [active])

	return (
		<div className="lg:hidden flex flex-row items-center justify-end font-unna text-lg">
			{/* <MobileLocaleSwitcher /> */}
			<MotionConfig
				transition={{
					duration: 0.4,
					ease: 'easeInOut',
				}}
			>
				{/* BUTTON */}
				<motion.button
					initial={false}
					onClick={() => setActive((pv) => !pv)}
					className="relative h-10 w-10 ml-3 rounded-full z-50 bg-transparent scale-90"
					animate={active ? 'open' : 'closed'}
				>
					<motion.span
						className="absolute h-1 w-6 bg-white rounded-sm"
						style={{
							left: '50%',
							top: '34%',
							x: '-50%',
							y: '-50%',
						}}
						variants={{
							open: {
								rotate: ['0deg', '0deg', '45deg'],
								top: ['34%', '50%', '50%'],
							},
							closed: {
								rotate: ['45deg', '0deg', '0deg'],
								top: ['50%', '50%', '34%'],
							},
						}}
					/>
					<motion.span
						className="absolute h-1 w-6 bg-white rounded-sm"
						style={{
							left: '50%',
							top: '50%',
							x: '-50%',
							y: '-50%',
						}}
						variants={{
							open: {
								rotate: ['0deg', '0deg', '-45deg'],
							},
							closed: {
								rotate: ['-45deg', '0deg', '0deg'],
							},
						}}
					/>
					<motion.span
						className="absolute h-1 w-6 bg-white rounded-sm"
						style={{
							left: '50%',
							bottom: '34%',
							x: '-50%',
							y: '50%',
						}}
						variants={{
							open: {
								rotate: ['0deg', '0deg', '45deg'],
								left: '50%',
								bottom: ['34%', '50%', '50%'],
							},
							closed: {
								rotate: ['45deg', '0deg', '0deg'],
								left: '50%',
								bottom: ['50%', '50%', '34%'],
							},
						}}
					/>
				</motion.button>

				{/* NAV */}
				<motion.div>
					<motion.div
						className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 backdrop-blur flex flex-col justify-start items-center"
						initial={false}
						animate={active ? 'open' : 'closed'}
						variants={{
							open: {
								x: 0,
								opacity: 1,
								pointerEvents: 'auto',
							},
							closed: {
								x: '100%',
								opacity: 0,
								pointerEvents: 'none',
							},
						}}
					>
						<nav className="flex flex-col justify-start gap-4 items-center text-white mt-24">
							{/* <Link
								onClick={() => setActive(false)}
								href="/poe"
							>
								{messages.poe}
							</Link>
							<Link
								onClick={() => setActive(false)}
								href="/your-access"
							>
								{messages.yourAccess}
							</Link> */}
							<Link
								onClick={() => setActive(false)}
								href={`/`}
							>
								POE
							</Link>
							{LINKS.map((link, index) => {
								if (link.sublinks) {
									return (
										<div
											key={index}
											className="flex flex-col justify-center items-center"
										>
											<div className="flex flex-row justify-start items-center gap-3">
												<span
													className="text-center relative block"
													onClick={() =>
														setSubMenu(() =>
															subMenu === link.url
																? ''
																: link.url
														)
													}
												>
													{link.name}
													<motion.span
														transition={{
															duration: 0.2,
														}}
														className="absolute left-full ml-2 mt-1"
														animate={
															subMenu === link.url
																? 'open'
																: 'closed'
														}
														variants={{
															open: {
																rotate: '180deg',
															},
															closed: {
																rotate: '0deg',
															},
														}}
													>
														<FiChevronDown className="text-xl text-white" />
													</motion.span>
												</span>
											</div>
											<div className="flex flex-col justify-center gap-2 items-center text-sm mt-1">
												{subMenu === link.url &&
													link.sublinks.map(
														(sublink, index) => (
															<Link
																onClick={() =>
																	setActive(
																		false
																	)
																}
																href={`${sublink.url}`}
																key={index}
															>
																{sublink.name}
															</Link>
														)
													)}
											</div>
										</div>
									)
								} else {
									return (
										<Link
											key={index}
											onClick={() => setActive(false)}
											href={`${link.url}`}
										>
											{link.name}
										</Link>
									)
								}
							})}
							{/* <div className="flex flex-row justify-start items-center gap-3">
								<span
									className="text-center relative block"
									onClick={() => setWhoWeAre((pv) => !pv)}
								>
									{messages.whoWeAre}
									<motion.span
										transition={{
											duration: 0.2,
										}}
										className="absolute left-full ml-2 mt-1"
										animate={whoWeAre ? 'open' : 'closed'}
										variants={{
											open: {
												rotate: '180deg',
											},
											closed: {
												rotate: '0deg',
											},
										}}
									>
										<FiChevronDown className="text-xl text-white" />
									</motion.span>
								</span>
							</div>
							{whoWeAre && (
								<div className="flex flex-col justify-center gap-2 items-center text-sm">
									<Link
										onClick={() => setActive(false)}
										href="/about-us"
									>
										{messages.aboutUs}
									</Link>
									<Link
										onClick={() => setActive(false)}
										href="/our-team"
									>
										{messages.ourTeam}
									</Link>
								</div>
							)}

							<Link
								onClick={() => setActive(false)}
								href="/services"
							>
								{messages.services}
							</Link>
							<div className="flex flex-row justify-start items-center gap-3">
								<span
									className="text-center relative block"
									onClick={() => setWhyUs((pv) => !pv)}
								>
									{messages.whyUs}
									<motion.span
										transition={{
											duration: 0.2,
										}}
										className="absolute left-full ml-2 mt-1"
										animate={whyUs ? 'open' : 'closed'}
										variants={{
											open: {
												rotate: '180deg',
											},
											closed: {
												rotate: '0deg',
											},
										}}
									>
										<FiChevronDown className="text-xl text-white" />
									</motion.span>
								</span>
							</div>
							{whyUs && (
								<div className="flex flex-col justify-center gap-2 items-center text-sm">
									<Link
										onClick={() => setActive(false)}
										href="/about-us"
									>
										{messages.overview}
									</Link>
									<Link
										onClick={() => setActive(false)}
										href="/our-team"
									>
										{messages.clientCodex}
									</Link>
								</div>
							)}
							<Link
								onClick={() => setActive(false)}
								href="/contact"
							>
								{messages.contact}
							</Link> */}
						</nav>
						<UsersLoginSection setActive={setActive} />
					</motion.div>
				</motion.div>
			</MotionConfig>
		</div>
	)
}
