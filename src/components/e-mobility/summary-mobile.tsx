'use client'

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { useStore } from '@/store/store'
import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'

const SummaryMobile = () => {
	const { storeData, storeLanguages, getTotalPrice } = useStore(
		useShallow((state) => ({
			storeData: state.data,
			storeLanguages: state.languages,
			getTotalPrice: state.getTotalPrice,
		}))
	)
	useEffect(() => {
		console.log(getTotalPrice())
	}, [storeData, storeLanguages, getTotalPrice])
	return (
		<div className="w-full sticky bottom-0 font-jose text-white">
			<Drawer>
				<DrawerTrigger className="w-full flex flex-row justify-between items-center p-2 bg-primary-light">
					<div className="h-full bg-primary-light flex-1">OPEN</div>
					<div className="h-full bg-primary-light flex-1">
						TOTAL EUR {getTotalPrice()}
					</div>
				</DrawerTrigger>
				<DrawerContent className="bg-primary-light min-h-96">
					<div className="w-1/3 -mt-4 mx-auto h-[6px] rounded-full bg-black/40"></div>
					<DrawerHeader>
						<DrawerTitle></DrawerTitle>
						<DrawerDescription></DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						<DrawerClose></DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	)
}

export default SummaryMobile
