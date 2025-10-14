'use client'

import * as React from 'react'
import { useStore } from '@/store/store'
import { useShallow } from 'zustand/shallow'
import { removeParenthesesContent } from '@/lib/utils'
import { selectionData } from '@/data/data'
import Expandable from '@/components/ui/expandable'
import { MobilityData, SelectableItem } from '@/store/store.types'

export default function SummaryDesktopEdit({
	onRequest,
	submitting,
}: {
	onRequest: () => void
	submitting?: boolean
}) {
	const {
		getAddedItems,
		getRemovedItems,
		getAddedItemsProratedTotal,
		storeLanguages,
		captureInitialPlan,
		initialPlan,
		storeData,
		storeGeographies,
		addSingleGeography,
		removeSingleGeography,
	} = useStore(
		useShallow((state) => ({
			getAddedItems: state.getAddedItems,
			getRemovedItems: state.getRemovedItems,
			getAddedItemsProratedTotal: state.getAddedItemsProratedTotal,
			storeLanguages: state.languages,
			captureInitialPlan: state.captureInitialPlan,
			initialPlan: state.initialPlan,
			storeData: state.data,
			storeGeographies: state.geographies,
			addSingleGeography: state.addSingleGeography,
			removeSingleGeography: state.removeSingleGeography,
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
		<div className="bg-primary-light text-white px-2 py-4">
			<div>
				<span className="text-xl text-center block">Order Summary</span>
			</div>
			<div className="w-5/6 my-4 mx-auto overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-thin scrollbar-webkit">
				{added.length > 0 && (
					<div className="mt-2">
						<span className="text-lg block mb-1">New Items</span>
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
														// In added items we only show the incremental geos for pricing but allow toggling others if user wants to expand scope before submitting
														const fullItem =
															storeData.eMobility[
																row.category
															].find(
																(i) =>
																	i.value ===
																	row.item
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
																key={gidx}
																className="flex justify-between w-full"
															>
																<div className="flex items-center gap-1">
																	<input
																		type="checkbox"
																		id={`added-${row.category}-${row.item.value}-${geo.value}`}
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
																		htmlFor={`added-${row.category}-${row.item.value}-${geo.value}`}
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
																	)?.price?.[
																		geo.value as keyof SelectableItem['price']
																	] ?? '-'}
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
						No changes yet. Select or deselect items to see a
						summary here.
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
			<div className="w-5/6 mb-3 mx-auto text-xl">
				<div className="flex flex-col gap-1">
					<div className="flex flex-row items-center justify-between">
						<span>Added Annual Total</span>
						<span>€ {addedAnnualTotal}</span>
					</div>
					<div className="flex flex-row items-center justify-between text-base">
						<span>Prorated (remaining)</span>
						<span>€ {prorated}</span>
					</div>
					{!proratedUsesFallback && (
						<p className="text-xs text-white/60">
							Remaining days: {remainingDays}
						</p>
					)}
					{proratedUsesFallback && (
						<p className="text-xs text-amber-300">
							No active subscription found - showing full annual
							amount.
						</p>
					)}
				</div>
				<div className="w-3/4 mx-auto mt-6 mb-3 grid grid-rows-1 items-center gap-4 font-bold text-sm xl:text-lg text-center text-primary">
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
						Prorated amount reflects remaining subscription time.
					</p>
				</div>
			</div>
		</div>
	)
}
