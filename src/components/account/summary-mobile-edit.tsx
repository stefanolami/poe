'use client'

/**
 * Mobile edit summary drawer
 * Shows ONLY deltas (added & removed items) plus incremental annual + prorated totals.
 */

import * as React from 'react'
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
import { removeParenthesesContent } from '@/lib/utils'

interface Props {
	onRequest: () => void
	submitting?: boolean
}

export default function SummaryMobileEdit({ onRequest, submitting }: Props) {
	const {
		storeData,
		storeLanguages,
		storeGeographies,
		addSingleGeography,
		removeSingleGeography,
		getAddedItems,
		getRemovedItems,
		getAddedItemsProratedTotal,
		captureInitialPlan,
		initialPlan,
	} = useStore(
		useShallow((state) => ({
			storeData: state.data,
			storeLanguages: state.languages,
			storeGeographies: state.geographies,
			addSingleGeography: state.addSingleGeography,
			removeSingleGeography: state.removeSingleGeography,
			getAddedItems: state.getAddedItems,
			getRemovedItems: state.getRemovedItems,
			getAddedItemsProratedTotal: state.getAddedItemsProratedTotal,
			captureInitialPlan: state.captureInitialPlan,
			initialPlan: state.initialPlan,
		}))
	)

	React.useEffect(() => {
		if (!initialPlan) captureInitialPlan()
	}, [initialPlan, captureInitialPlan])

	const added = getAddedItems()
	const removed = getRemovedItems()
	const addedAnnualTotal = added.reduce((s, a) => s + a.annualPrice, 0)
	const prorated = getAddedItemsProratedTotal()
	const remainingDays = useStore((s) => s.subscriptionRemainingDays)
	const proratedUsesFallback =
		!remainingDays || remainingDays <= 0 || remainingDays > 365

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
		}
	}

	return (
		<div className="w-full lg:hidden sticky bottom-0 font-jose text-white">
			<Drawer>
				<DrawerTrigger className="w-full flex flex-row justify-between items-center p-2 bg-primary-light">
					<div className="flex items-center justify-center pl-2">
						<div className="flex items-center bg-primary px-2 shadow-md">
							<span className="block mt-1">SUMMARY</span>
						</div>
					</div>
					<div className="h-full bg-primary-light flex flex-col text-right pr-2 text-xs">
						<span className="block">
							Annual € {addedAnnualTotal}
						</span>
						<span className="block">Prorated € {prorated}</span>
					</div>
				</DrawerTrigger>
				<DrawerContent className="bg-primary-light text-white">
					<div className="w-1/3 -mt-4 mx-auto h-[4px] rounded-full bg-white/50" />
					<DrawerHeader>
						<DrawerTitle className="text-xl text-center">
							Order Summary
						</DrawerTitle>
					</DrawerHeader>
					<div className="w-5/6 mt-4 mx-auto overflow-y-scroll max-h-[calc(100dvh-230px)] scrollbar-thin scrollbar-webkit">
						{added.length > 0 && (
							<div className="mt-2">
								<span className="text-lg block mb-1">
									New Items
								</span>
								<ul className="pl-1 pr-3 space-y-2">
									{added.map((row, idx) => {
										const categoryDef =
											selectionData.eMobility[
												row.category as keyof typeof selectionData.eMobility
											]
										return (
											<li
												key={idx}
												className="text-sm"
											>
												<Expandable
													title={removeParenthesesContent(
														row.item.label
													)}
													price={row.annualPrice.toString()}
												>
													<ul className="space-y-1 pl-4">
														{storeGeographies.map(
															(geo, gidx) => {
																const fullItem =
																	storeData.eMobility[
																		row
																			.category
																	].find(
																		(i) =>
																			i.value ===
																			row
																				.item
																				.value
																	)
																const checked =
																	!!fullItem?.geographies?.some(
																		(g) =>
																			g.value ===
																			geo.value
																	)
																return (
																	<li
																		key={
																			gidx
																		}
																		className="flex justify-between w-full"
																	>
																		<div className="flex items-center gap-1">
																			<input
																				type="checkbox"
																				id={`m-added-${row.category}-${row.item.value}-${geo.value}`}
																				checked={
																					checked
																				}
																				onChange={(
																					e
																				) =>
																					handleGeography(
																						e,
																						geo,
																						row.category,
																						row.item
																					)
																				}
																				className="custom-checkbox modal-checkbox scale-[.8] peer"
																			/>
																			<label
																				htmlFor={`m-added-${row.category}-${row.item.value}-${geo.value}`}
																			>
																				{
																					geo.label
																				}
																			</label>
																		</div>
																		<span className="text-white text-xs">
																			€{' '}
																			{categoryDef.fields.find(
																				(
																					f: SelectableItem
																				) =>
																					f.value ===
																					row
																						.item
																						.value
																			)
																				?.price?.[
																				geo.value as keyof SelectableItem['price']
																			] ??
																				'-'}
																		</span>
																	</li>
																)
															}
														)}
													</ul>
												</Expandable>
											</li>
										)
									})}
								</ul>
							</div>
						)}
						{removed.length > 0 && (
							<div className="mt-6">
								<span className="text-lg block mb-1">
									Removed Items
								</span>
								<ul className="pl-1 pr-3 space-y-1 opacity-80">
									{removed.map((row, idx) => (
										<li
											key={idx}
											className="flex justify-between text-sm line-through"
										>
											<span>
												{removeParenthesesContent(
													row.item.label
												)}
											</span>
											<span>
												{row.item.geographies?.length
													? `-${row.item.geographies.length} geograph${row.item.geographies.length === 1 ? 'y' : 'ies'}`
													: ''}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}
						{added.length === 0 && removed.length === 0 && (
							<p className="text-sm text-white/70 mt-4">
								No changes yet. Adjust selections to see changes
								here.
							</p>
						)}
						{storeLanguages.length > 0 && added.length > 0 && (
							<div className="mt-4 border-t border-white/10 pt-2">
								<span className="text-sm">
									Languages multiplier applied: x{' '}
									{storeLanguages.length * 0.25 + 1}
								</span>
							</div>
						)}
					</div>
					<DrawerFooter className="w-5/6 my-6 mx-auto text-xl p-0">
						<div className=" flex flex-row items-center justify-between ">
							<span>Added Annual</span>
							<span>€ {addedAnnualTotal}</span>
						</div>
						<div className=" flex flex-row items-center justify-between text-base ">
							<span>Prorated</span>
							<span>€ {prorated}</span>
						</div>
						{!proratedUsesFallback && (
							<p className="text-xs text-white/60 mt-1">
								Remaining days: {remainingDays}
							</p>
						)}
						{proratedUsesFallback && (
							<p className="text-xs text-amber-300 mt-1">
								No active subscription found - showing full
								annual amount.
							</p>
						)}
						<div className="w-full mt-3 grid grid-cols-1 items-center gap-3 mx-auto font-bold text-sm xl:text-lg text-center text-primary">
							<button
								className="bg-white h-9 shadow-md hover:shadow-xl w-full"
								onClick={onRequest}
								disabled={
									submitting ||
									(added.length === 0 && removed.length === 0)
								}
							>
								{submitting ? 'Submitting…' : 'Request Change'}
							</button>
							<p className="text-xs text-white/80">
								Prorated amount reflects remaining subscription
								time.
							</p>
						</div>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	)
}
