'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const SectorButton = ({
	text,
	handler,
}: {
	text: string
	handler?: () => void
	activeButton: string
}) => {
	const hoverVariants = {
		rest: { scale: 1 },
		hover: { scale: 1.02 },
	}

	return (
		<motion.button
			className="relative flex flex-row items-center justify-center gap-3 bg-secondary hover:brightness-95 shadow-md hover:shadow-xl overflow-hidden text-white w-40 md:w-64 xl:w-96 h-9 md:h-14 xl:h-20"
			initial="rest"
			whileHover="hover"
			onClick={() => handler && handler()}
		>
			<motion.span
				className="relative z-10 h-2/3 aspect-square"
				variants={hoverVariants}
				transition={{
					type: 'spring',
					stiffness: 300,
					damping: 20,
					duration: 0.2,
				}}
			>
				<Image
					src={
						text !== 'Aviation'
							? '/icon-e-mobility.png'
							: '/icon-aviation.png'
					}
					alt={text}
					fill
				/>
			</motion.span>
			<div className="relative h-full flex items-center w-auto">
				<motion.span
					className="relative z-10 font-unna font-bold text-base md:text-2xl xl:text-4xl"
					variants={hoverVariants}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 20,
						duration: 0.2,
					}}
				>
					{text}
				</motion.span>
			</div>
			{text === 'Aviation' && (
				<motion.span className="absolute -bottom-[2px] md:bottom-0 z-10 font-unna font-bold text-[10px] md:text-sm lg:text-sm xl:text-lg">
					Coming Soon
				</motion.span>
			)}
			{/* <motion.span
				className="absolute right-4 md:text-3xl xl:text-5xl"
				animate={controlsIcon}
				initial={{ opacity: 0, x: 10 }}
				transition={{ duration: 0.3 }}
			>
				→
			</motion.span> */}
		</motion.button>
	)
}

export default SectorButton
