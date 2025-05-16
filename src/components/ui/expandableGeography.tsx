import React, { JSX, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { motion } from 'framer-motion'
import useMeasure from 'react-use-measure'

const ExpandableGeography = ({
	title,
	children,
	defaultOpen = false,
}: {
	title: string
	children: JSX.Element
	defaultOpen?: boolean
}) => {
	const [ref, { height }] = useMeasure()
	const [open, setOpen] = useState(defaultOpen)

	return (
		<motion.div
			animate={open ? 'open' : 'closed'}
			className="text-primary"
		>
			<button
				onClick={() => setOpen((pv) => !pv)}
				className="flex w-full items-center justify-between gap-4 py-2"
			>
				<div className="flex flex-row items-center justify-start gap-2">
					<motion.span
						variants={{
							open: {
								rotate: '180deg',
							},
							closed: {
								rotate: '0deg',
							},
						}}
					>
						<FiChevronDown className="text-3xl text-primary" />
					</motion.span>
					<span className="ml-[6px]">{title}</span>
				</div>
			</button>
			<motion.div
				initial={false}
				animate={{
					height: open ? height : '0px',
					marginBottom: open ? '6px' : '0px',
				}}
				className="overflow-hidden"
			>
				<div ref={ref}>{children}</div>
			</motion.div>
		</motion.div>
	)
}

export default ExpandableGeography
