'use client'

import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { useStore } from '@/store/store'
import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'
import { selectionData } from '@/data/data'
import { MobilityData, SelectableItem } from '@/store/store.types'
import Expandable from '../ui/expandable'

const SummaryMobile = () => {
	const {
		storeData,
		storeLanguages,
		geographies,
		getTotalPrice,
		getModalSinglePrice,
		addSingleGeography,
		removeSingleGeography,
	} = useStore(
		useShallow((state) => ({
			storeData: state.data,
			storeLanguages: state.languages,
			geographies: state.geographies,
			getTotalPrice: state.getTotalPrice,
			getModalSinglePrice: state.getModalSinglePrice,
			addSingleGeography: state.addSingleGeography,
			removeSingleGeography: state.removeSingleGeography,
		}))
	)

	const handleGeography = (
		e: React.ChangeEvent<HTMLInputElement>,
		geography: SelectableItem,
		category: keyof MobilityData,
		item: SelectableItem
	) => {
		if (e.target.checked) {
			addSingleGeography(geography, category, item)
		} else {
			removeSingleGeography(geography, category, item)
			console.log('handling')
		}
	}

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
				<DrawerContent className="bg-primary-light min-h-96 text-white">
					<div className="w-1/3 -mt-4 mx-auto h-[4px] rounded-full bg-white/50"></div>
					<DrawerHeader>
						<DrawerTitle className="text-xl">
							Order Summary
						</DrawerTitle>
					</DrawerHeader>
					<div className="w-5/6 mt-4 mx-auto overflow-y-scroll h-[calc(100vh-200px)] scrollbar-thin scrollbar-webkit">
						{Object.keys(storeData.eMobility).map((key, index) => {
							if (
								key !== 'typeOfVehicleContract' &&
								key !== 'chargingStationsContract' &&
								key !== 'eVehiclesMaintenance' &&
								key !== 'report'
							) {
								const category =
									selectionData.eMobility[
										key as keyof typeof selectionData.eMobility
									]
								if (
									storeData.eMobility[
										key as keyof MobilityData
									].length > 0
								) {
									return (
										<div
											className="mt-2"
											key={index}
										>
											<span className="text-lg">
												{category.label}
											</span>
											<ul className="pl-1 pr-3">
												{storeData.eMobility[
													key as keyof MobilityData
												].map((item, index) => (
													<li key={index}>
														<Expandable
															title={item.label}
															price={getModalSinglePrice(
																key as keyof MobilityData,
																item
															).toString()}
														>
															<ul className="space-y-1 pl-6">
																{geographies.map(
																	(
																		geo,
																		index
																	) => (
																		<li
																			key={
																				index
																			}
																			className="flex flex-row justify-between w-full"
																		>
																			<div className="flex flex-row justify-start items-center gap-1 text-white text-sm">
																				<input
																					type="checkbox"
																					id={`checkbox-${category}-${item.value}-${geo.value}`}
																					value={
																						geo.value
																					}
																					onChange={(
																						e
																					) =>
																						handleGeography(
																							e,
																							geo,
																							key as keyof MobilityData,
																							item
																						)
																					}
																					checked={
																						storeData.eMobility[
																							key as keyof MobilityData
																						]
																							?.find(
																								(
																									el
																								) =>
																									el.value ==
																									item.value
																							)
																							?.geographies?.find(
																								(
																									element
																								) =>
																									element.value ===
																									geo.value
																							)
																							? true
																							: false
																					}
																					className="custom-checkbox modal-checkbox scale-[.8] peer"
																				/>
																				<label
																					className=""
																					htmlFor={`checkbox-${category}-${item.value}-${geo.value}`}
																				>
																					{
																						geo.label
																					}
																				</label>
																			</div>
																			<span className="text-white text-sm">
																				€{' '}
																				{
																					category.fields.find(
																						(
																							x: SelectableItem
																						) =>
																							x.value ===
																							item.value
																					)
																						?.price[
																						geo.value as keyof SelectableItem['price']
																					]
																				}
																			</span>
																		</li>
																	)
																)}
															</ul>
														</Expandable>
													</li>
												))}
											</ul>
										</div>
									)
								}
							}
						})}
						{/* <span className="w-full h-[2px] mt-4 bg-white/50  block"></span> */}
					</div>

					<DrawerFooter className="w-5/6 my-6 mx-auto flex flex-row items-center justify-between text-xl p-0">
						<span>TOTAL</span>
						<span>€ {getTotalPrice()}</span>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	)
}

export default SummaryMobile
