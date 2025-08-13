'use client'

import { selectionData } from '@/data/data'
import { ClientDataJsonType, ClientSelectionType } from '@/lib/types'
import {
	getSelectionItemContractLabel,
	getSelectionItemLabel,
} from '@/lib/utils'
import { useStore } from '@/store/store'
import { MobilityData } from '@/store/store.types'
import React from 'react'
import { useShallow } from 'zustand/shallow'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../../ui/accordion'

const AccountSummaryFromDB = ({
	clientSelection,
}: {
	clientSelection: ClientSelectionType
}) => {
	const { getTotalPriceFromDB, getSinglePrice } = useStore(
		useShallow((state) => ({
			storeData: state.data,
			getTotalPriceFromDB: state.getTotalPriceFromDB,
			getSinglePrice: state.getSinglePriceFromDB,
			addSingleGeography: state.addSingleGeography,
			removeSingleGeography: state.removeSingleGeography,
		}))
	)

	console.log('clientSelection', clientSelection)

	return (
		<div className="">
			<h2 className="text-lg md:text-xl lg:text-3xl mb-4 lg:mb-10">
				Your Plan
			</h2>
			<div className="my-4">
				{Object.keys(clientSelection).map((key, index) => {
					if (
						key !== 'typeOfVehicleContract' &&
						key !== 'chargingStationsContract'
					) {
						console.log(
							'key data',
							key,
							clientSelection[key as keyof MobilityData]
						)
						const category =
							selectionData.eMobility[
								key as keyof typeof selectionData.eMobility
							]
						if (
							(
								clientSelection[
									key as keyof MobilityData
								] as ClientDataJsonType[]
							).length > 0
						) {
							return (
								<div
									className="mt-2 space-y-2"
									key={index}
								>
									<span className="text-base md:text-lg lg:text-xl">
										{key == 'deployment'
											? 'Grants Deployment'
											: key == 'project'
												? 'Grants Innovative Projects'
												: category.label}
									</span>
									<ul className="text-sm md:text-base space-y-1 list-inside pl-1">
										{(
											clientSelection[
												key as keyof MobilityData
											] as ClientDataJsonType[]
										).map((item, index) => (
											<li key={index}>
												<Accordion
													type="single"
													collapsible
												>
													<AccordionItem value="item-1">
														<AccordionTrigger>
															<div className="flex flex-row items-center justify-between w-full">
																<div className="list-item">
																	{getSelectionItemLabel(
																		item.value,
																		key
																	)}
																</div>
																<div>
																	€{' '}
																	{getSinglePrice(
																		key as keyof MobilityData,
																		item
																	)}{' '}
																	/ year
																</div>
															</div>
														</AccordionTrigger>
														<AccordionContent>
															<ul className="list-disc list-inside pl-6">
																{item.geographies?.map(
																	(
																		geoItem,
																		geoIndex
																	) => (
																		<li
																			key={
																				geoIndex
																			}
																		>
																			{
																				geoItem.label
																			}
																		</li>
																	)
																)}
															</ul>
														</AccordionContent>
													</AccordionItem>
												</Accordion>
											</li>
										))}
									</ul>
								</div>
							)
						}
					} /* else if (key === 'report') {
                        const category =
                            clientSelection[key as keyof MobilityData]

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
                    } */ else if (
						key === 'typeOfVehicleContract' ||
						key === 'chargingStationsContract'
					) {
						if (
							clientSelection[key as keyof MobilityData].length >
							0
						) {
							return (
								<div
									className="mt-2 space-y-2 mb-4"
									key={index}
								>
									<span className="w-1/3 bg-primary h-[1px] block"></span>
									<ul className="text-sm md:text-base space-y-1 list-disc list-inside pl-1">
										{clientSelection[
											key as keyof MobilityData
										].map((item, index) => (
											<li key={index}>
												{getSelectionItemContractLabel(
													item as string,
													key
												)}
											</li>
										))}
									</ul>
								</div>
							)
						}
					}
				})}
			</div>

			<div className="mb-3 mt-6 text-base md:text-lg lg:text-xl">
				<div className="flex flex-row items-center justify-between ">
					<span>TOTAL</span>
					<span>€ {getTotalPriceFromDB(clientSelection)} / year</span>
				</div>
			</div>
			{/* <span className="w-full bg-primary h-[1px] my-8 block lg:hidden"></span> */}
		</div>
	)
}

export default AccountSummaryFromDB
