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
import { useShallow } from 'zustand/shallow'
import { selectionData } from '@/data/data'
import { MobilityData, SelectableItem } from '@/store/store.types'
import Expandable from '@/components/ui/expandable'
import Link from 'next/link'
import { removeParenthesesContent } from '@/lib/utils'

const SummaryMobile = () => {
	const {
		storeData,
		storeLanguages,
		storeGeographies,
		getTotalPrice,
		getModalSinglePrice,
		addSingleGeography,
		removeSingleGeography,
	} = useStore(
		useShallow((state) => ({
			storeData: state.data,
			storeLanguages: state.languages,
			storeGeographies: state.geographies,
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

	return (
		<div className="w-full lg:hidden sticky bottom-0 font-jose text-white">
			<Drawer>
				<DrawerTrigger className="w-full flex flex-row justify-between items-center p-2 bg-primary-light">
					<div className="flex-1 flex items-center justify-center">
						<div className="flex items-center bg-primary px-2 shadow-md">
							<span className="block mt-1">SUMMARY</span>
						</div>
					</div>
					<div className="h-full bg-primary-light flex-1">
						TOTAL € {getTotalPrice()}
					</div>
				</DrawerTrigger>
				<DrawerContent className="bg-primary-light text-white">
					<div className="w-1/3 -mt-4 mx-auto h-[4px] rounded-full bg-white/50"></div>
					<DrawerHeader>
						<DrawerTitle className="text-xl text-center">
							Order Summary
						</DrawerTitle>
					</DrawerHeader>
					<div className="w-5/6 mt-4 mx-auto overflow-y-scroll max-h-[calc(100dvh-230px)] scrollbar-thin scrollbar-webkit">
						{Object.keys(storeData.eMobility).map((key, index) => {
							if (
								key !== 'typeOfVehicleContract' &&
								key !== 'chargingStationsContract' &&
								key !== 'pif' &&
								key !== 'deployment' &&
								key !== 'project'
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
															title={removeParenthesesContent(
																item.label
															)}
															price={getModalSinglePrice(
																key as keyof MobilityData,
																item
															).toString()}
														>
															<ul className="space-y-1 pl-6">
																{storeGeographies.map(
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
							} else if (key === 'pif') {
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
											<ul className="pl-1 pr-3 w-full">
												{storeData.eMobility[
													key as keyof MobilityData
												].map((item, index) => (
													<li
														key={index}
														className="w-full py-2"
													>
														<Expandable
															title={removeParenthesesContent(
																item.label
															)}
															price={getModalSinglePrice(
																key as keyof MobilityData,
																item
															).toString()}
														>
															<ul className="space-y-1 pl-6">
																{storeGeographies.map(
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
							} else if (
								key === 'deployment' ||
								key === 'project'
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
												{key == 'deployment'
													? 'Grants Deployment'
													: 'Grants Innovative Projects'}
											</span>
											<ul className="pl-1 pr-3">
												{storeData.eMobility[
													key as keyof MobilityData
												].map((item, index) => (
													<li key={index}>
														<Expandable
															title={removeParenthesesContent(
																item.label
															)}
															price={getModalSinglePrice(
																key as keyof MobilityData,
																item
															).toString()}
														>
															<ul className="space-y-1 pl-6">
																{storeGeographies.map(
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
						{storeLanguages.length > 0 && (
							<div className="mt-2">
								<span className="text-lg">Languages</span>
								<div className="flex w-full items-end justify-between gap-4 pl-1 pr-3">
									<span className="text-white text-wrap">
										{storeLanguages
											.map((lang) => lang.label)
											.join(', ')}
									</span>
									<span className="text-white text-nowrap">
										x {storeLanguages.length * 0.25 + 1}
									</span>
								</div>
							</div>
						)}
						{/* <span className="w-full h-[2px] mt-4 bg-white/50  block"></span> */}
					</div>

					<DrawerFooter className="w-5/6 my-6 mx-auto text-xl p-0">
						<div className=" flex flex-row items-center justify-between ">
							<span>TOTAL</span>
							<span>€ {getTotalPrice()} / year</span>
						</div>
						<div className="w-full mt-3 grid grid-cols-2 items-center gap-3 mx-auto  font-bold text-sm xl:text-lg text-center text-primary">
							<button className="bg-white h-9 shadow-md hover:shadow-xl">
								Send offer by email
							</button>
							<Link href="/create-account">
								<button className="bg-white h-9 shadow-md hover:shadow-xl w-full">
									Continue
								</button>
							</Link>
						</div>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	)
}

export default SummaryMobile
