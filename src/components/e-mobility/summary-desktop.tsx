'use client'

import { selectionData } from '@/data/data'
import { useStore } from '@/store/store'
import { useShallow } from 'zustand/shallow'
import { MobilityData, SelectableItem } from '@/store/store.types'
import Expandable from '@/components/ui/expandable'
import { removeParenthesesContent } from '@/lib/utils'
import Link from 'next/link'

const SummaryDesktop = () => {
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
		<div>
			<div className="bg-primary-light text-white px-2 py-4">
				<div>
					<span className="text-xl text-center block">
						Order Summary
					</span>
				</div>
				<div className="w-5/6 my-4 mx-auto overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-thin scrollbar-webkit">
					{Object.keys(storeData.eMobility).map((key, index) => {
						if (
							key !== 'typeOfVehicleContract' &&
							key !== 'chargingStationsContract' &&
							key !== 'eVehiclesMaintenance' &&
							key !== 'report'
						) {
							const category =
								selectionData.eMobility.ppo[
									key as keyof typeof selectionData.eMobility.ppo
								]
							if (
								storeData.eMobility[key as keyof MobilityData]
									.length > 0
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
						} else if (key === 'report') {
							const category =
								storeData.eMobility[key as keyof MobilityData]

							if (category.length > 0) {
								return (
									<div
										className="mt-2"
										key={index}
									>
										<span className="text-lg">Reports</span>
										<ul className="pl-1 pr-3">
											{category.map((item, index) => (
												<li
													key={index}
													className="flex w-full items-center justify-between gap-4 py-2"
												>
													<span className="text-white">
														{item.value == 'eu'
															? 'EU'
															: 'Non-EU'}
													</span>
													<span className="text-white">
														€ {item.price?.default}
													</span>
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

				<div className="w-5/6 mb-3 mx-auto text-xl">
					<div className="flex flex-row items-center justify-between ">
						<span>TOTAL</span>
						<span>€ {getTotalPrice()}</span>
					</div>
					{getTotalPrice() > 0 && (
						<div className="w-3/4 mx-auto mt-6 mb-3 grid grid-rows-2 items-center gap-4 font-bold text-sm xl:text-lg text-center text-primary">
							<button className="bg-white h-9 shadow-md hover:shadow-xl">
								Send offer by email
							</button>
							<Link href="/create-account">
								<button className="bg-white h-9 shadow-md hover:shadow-xl w-full">
									Continue
								</button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default SummaryDesktop
