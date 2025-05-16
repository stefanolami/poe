'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'
import Navbar from './nav-desktop'
import NavMobile from './nav-mobile'

export default function Header() {
	const { scrollY } = useScroll()

	const [hidden, setHidden] = useState(false)

	useMotionValueEvent(scrollY, 'change', (latest) => {
		const previous = scrollY.getPrevious()
		if (latest > previous! && latest > 200) {
			setHidden(true)
		} else {
			setHidden(false)
		}
	})

	return (
		<motion.header
			variants={{
				visible: {
					y: 0,
					backgroundColor: '#004A6A',
					color: '#FFFFFF',
				},
				hidden: {
					y: '-100%',
					/* backgroundColor: '#FFFFFF00', */
					color: '#fff',
				},
			}}
			animate={hidden ? 'hidden' : 'visible'}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
			className={
				'fixed top-0 w-full bg-transparent text-white z-50 flex justify-between items-center h-16 xl:h-24 font-unna'
			}
		>
			<div className="mx-auto w-[90%] max-w-[1200px] flex flex-row items-center justify-between h-full">
				<div className="flex items-center justify-center w-auto xl:w-[270px] h-full ">
					<Link
						className="pl-6 md:pl-0 md:py-4 xl:py-7 w-[124px] xl:w-[231px] aspect-[694/186] relative xl:scale-75"
						href="/"
					>
						<Image
							src="/logos/consulting-white.png"
							alt="T&P Logo"
							fill
							sizes="(max-width: 640px) 40vw, 25vw"
						/>
					</Link>
				</div>

				<Navbar />
				<NavMobile />
			</div>
		</motion.header>
	)
}
