'use client'

import { selectionData } from '@/data/data'
import Link from 'next/link'
import { ClientDataJsonType, ClientSelectionType } from '@/lib/types'
import {
	getSelectionItemContractLabel,
	getSelectionItemLabel,
} from '@/lib/utils'
import { useStore } from '@/store/store'
import { MobilityData } from '@/store/store.types'
import { useShallow } from 'zustand/shallow'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

const AccountSummaryFromDB = ({
	clientSelection,
	enableEditing = true,
}: {
	clientSelection: ClientSelectionType
	enableEditing?: boolean
}) => {
	// full-page edit now; no local state needed
	const { getTotalPriceFromDB, getSinglePrice } = useStore(
		useShallow((state) => ({
			getTotalPriceFromDB: state.getTotalPriceFromDB,
			getSinglePrice: state.getSinglePriceFromDB,
		}))
	)

	return (
		<div className="">
			<h2 className="text-lg md:text-xl lg:text-3xl mb-4 lg:mb-10">
				Your Plan
			</h2>
			{enableEditing && (
				<div className="flex justify-end mb-2">
					<Link
						href="/account/selection-edit"
						className="text-xs md:text-sm bg-primary-light text-white hover:bg-primary-light/90 shadow-sm hover:shadow transition-transform hover:scale-[1.02] px-4 py-2"
					>
						Edit selection
					</Link>
				</div>
			)}
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
