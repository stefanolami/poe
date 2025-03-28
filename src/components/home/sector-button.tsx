'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

const SectorButton = ({
	text,
	handler,
	activeButton,
}: {
	text: string
	handler: () => void
	activeButton: string
}) => {
	const controlsText = useAnimation()
	const controlsArrow = useAnimation()

	const handleMouseEnter = () => {
		controlsText.start({ x: -10 })
		controlsArrow.start({ opacity: 1, x: 0 })
	}

	const handleMouseLeave = () => {
		if (activeButton !== text) {
			controlsText.start({ x: 0 })
			controlsArrow.start({ opacity: 0, x: 10 })
		}
	}

	useEffect(() => {
		if (activeButton == '') {
			controlsText.start({ x: 0 })
			controlsArrow.start({ opacity: 0, x: 10 })
		}
		//eslint-disable-next-line
	}, [activeButton])

	return (
		<motion.button
			className="relative flex items-center justify-center bg-secondary hover:brightness-95 overflow-hidden text-white w-40 md:w-64 xl:w-96 h-9 md:h-14 xl:h-20"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={() => handler()}
		>
			<motion.span
				className="relative z-10 font-unna font-bold text-base md:text-2xl xl:text-4xl"
				animate={controlsText}
				initial={{ x: 0 }}
			>
				{text}
			</motion.span>
			<motion.span
				className="absolute right-4 md:text-3xl xl:text-5xl"
				animate={controlsArrow}
				initial={{ opacity: 0, x: 10 }}
				transition={{ duration: 0.3 }}
			>
				→
			</motion.span>
		</motion.button>
	)
}

export default SectorButton
