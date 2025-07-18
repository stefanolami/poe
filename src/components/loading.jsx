'use client'

import { motion } from 'framer-motion'

const Loading = () => {
	return (
		<div className="grid place-content-center bg-white px-4 py-24 w-full h-screen">
			<BarLoader />
		</div>
	)
}

const variants = {
	initial: {
		scaleY: 0.5,
		opacity: 0,
	},
	animate: {
		scaleY: 1,
		opacity: 1,
		transition: {
			repeat: Infinity,
			repeatType: 'mirror',
			duration: 1,
			ease: 'circIn',
		},
	},
}

export const BarLoader = () => {
	return (
		<motion.div
			transition={{
				staggerChildren: 0.25,
			}}
			initial="initial"
			animate="animate"
			className="flex gap-1 scale-[2]"
		>
			<motion.div
				variants={variants}
				className="h-12 w-2 bg-primary-light"
			/>
			<motion.div
				variants={variants}
				className="h-12 w-2 bg-primary-light"
			/>
			<motion.div
				variants={variants}
				className="h-12 w-2 bg-primary-light"
			/>
			<motion.div
				variants={variants}
				className="h-12 w-2 bg-primary-light"
			/>
			<motion.div
				variants={variants}
				className="h-12 w-2 bg-primary-light"
			/>
		</motion.div>
	)
}

export default Loading
