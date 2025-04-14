'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'
import { logout } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import AdminTabs from '../admin-tabs'

export default function HeaderAdmin() {
	const { scrollY } = useScroll()

	const [hidden, setHidden] = useState(false)

	const router = useRouter()

	useMotionValueEvent(scrollY, 'change', (latest) => {
		const previous = scrollY.getPrevious()
		if (latest > previous! && latest > 200) {
			setHidden(true)
		} else {
			setHidden(false)
		}
	})

	const handleLogout = async () => {
		await logout()
		router.push('/auth')
		console.log('logging out...')
	}

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
						href="https://funding-kohl.vercel.app"
					>
						<Image
							src="/logos/funding-white.png"
							alt="T&P Logo"
							fill
							sizes="(max-width: 640px) 40vw, 25vw"
						/>
					</Link>
				</div>
				<AdminTabs />
				<button
					className="bg-primary-light text-white shadow-lg hover:shadow-xl hover:scale-[1.02] font-jose text-sm md:text-base lg:text-lg px-2 py-1 md:px-4 lg:px-6 lg:py-2"
					onClick={() => handleLogout()}
				>
					Logout
				</button>
			</div>
		</motion.header>
	)
}
