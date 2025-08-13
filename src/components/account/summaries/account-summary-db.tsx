'use client'

import { selectionData } from '@/data/data'
import { ClientDataJsonType, ClientSelectionType } from '@/lib/types'
import {
	getSelectionItemContractLabel,
	getSelectionItemLabel,
} from '@/lib/utils'
import { useStore } from '@/store/store'
import { MobilityData } from '@/store/store.types'
import React, { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import Loading from '@/components/loading'

const AccountSummaryFromDB = ({
	clientSelection,
}: {
	clientSelection: ClientSelectionType
}) => {
	const [mounted, setMounted] = useState(false)

	// Ensure component is mounted (hydration complete)
	useEffect(() => {
		setMounted(true)
	}, [])
	const { getTotalPriceFromDB, getSinglePrice } = useStore(
		useShallow((state) => ({
			getTotalPriceFromDB: state.getTotalPriceFromDB,
			getSinglePrice: state.getSinglePriceFromDB,
		}))
	)

	if (!mounted) {
		return (
			<div className="">
				<h2 className="text-lg md:text-xl lg:text-3xl mb-4 lg:mb-10">
					Your Plan
				</h2>
				<Loading />
			</div>
		)
	}

	// Debug logs to identify the issue
	console.log('selectionData:', selectionData)
	console.log('selectionData.eMobility:', selectionData?.eMobility)
	console.log('clientSelection:', clientSelection)

	return (
		<div className="">
			<h2 className="text-lg md:text-xl lg:text-3xl mb-4 lg:mb-10">
				Your Plan
			</h2>
			<div className="my-4">
				{Object.keys(clientSelection).map((key, index) => {
					// Skip contract types initially
					if (
						key !== 'typeOfVehicleContract' &&
						key !== 'chargingStationsContract'
					) {
						console.log('Processing key:', key)

						// Safe access to category with fallback
						const category =
							selectionData?.eMobility?.[
								key as keyof typeof selectionData.eMobility
							]

						console.log('Category for key', key, ':', category)

						const dataArray = clientSelection[
							key as keyof MobilityData
						] as ClientDataJsonType[]

						if (dataArray && dataArray.length > 0) {
							return (
								<div
									className="mt-2 space-y-2"
									key={index}
								>
									<span className="text-base md:text-lg lg:text-xl">
										{key === 'deployment'
											? 'Grants Deployment'
											: key === 'project'
												? 'Grants Innovative Projects'
												: category?.label || key}{' '}
										{/* Safe access with fallback */}
									</span>
									<ul className="text-sm md:text-base space-y-1 list-inside pl-1">
										{dataArray.map((item, itemIndex) => {
											let price = 0
											try {
												price = getSinglePrice(
													key as keyof MobilityData,
													item
												) as number
											} catch (e) {
												console.error(
													'Price calculation error:',
													e
												)
											}

											return (
												<li key={itemIndex}>
													<Accordion
														type="single"
														collapsible
													>
														<AccordionItem
															value={`item-${index}-${itemIndex}`}
														>
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
																		{price}{' '}
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
											)
										})}
									</ul>
								</div>
							)
						}
					} else if (
						key === 'typeOfVehicleContract' ||
						key === 'chargingStationsContract'
					) {
						const contractArray = clientSelection[
							key as keyof MobilityData
						] as string[]

						if (contractArray && contractArray.length > 0) {
							return (
								<div
									className="mt-2 space-y-2 mb-4"
									key={index}
								>
									<span className="w-1/3 bg-primary h-[1px] block"></span>
									<ul className="text-sm md:text-base space-y-1 list-disc list-inside pl-1">
										{contractArray.map(
											(item, contractIndex) => (
												<li key={contractIndex}>
													{getSelectionItemContractLabel(
														item,
														key
													)}
												</li>
											)
										)}
									</ul>
								</div>
							)
						}
					}

					return null // Make sure to return null for non-matching cases
				})}
			</div>

			<div className="mb-3 mt-6 text-base md:text-lg lg:text-xl">
				<div className="flex flex-row items-center justify-between">
					<span>TOTAL</span>
					<span>
						€{' '}
						{(() => {
							try {
								return getTotalPriceFromDB(clientSelection)
							} catch (e) {
								console.error(
									'Total price calculation error:',
									e
								)
								return 0
							}
						})()}{' '}
						/ year
					</span>
				</div>
			</div>
		</div>
	)
}

export default AccountSummaryFromDB
