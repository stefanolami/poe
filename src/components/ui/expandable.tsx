import React, { JSX, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { motion } from 'framer-motion'
import useMeasure from 'react-use-measure'

const Expandable = ({
	title,
	children,
	price,
	defaultOpen = false,
	text = 'white',
}: {
	title: string
	children: JSX.Element
	price: string
	defaultOpen?: boolean
	text?: string
}) => {
	const [ref, { height }] = useMeasure()
	const [open, setOpen] = useState(defaultOpen)

	return (
		<motion.div
			animate={open ? 'open' : 'closed'}
			className={`text-${text}`}
		>
			<button
				onClick={() => setOpen((pv) => !pv)}
				className="flex w-full items-center justify-between gap-4 py-2"
			>
				<div className="flex flex-row items-center justify-start">
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
						<FiChevronDown className={`text-lg text-${text}`} />
					</motion.span>
					<span className={`text-${text}`}>{title}</span>
				</div>
				<span className={`text-${text}`}>€ {price}</span>
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

export default Expandable
