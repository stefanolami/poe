'use client'
import { useState } from 'react'
import { useStore } from '@/store/store'
import { Geography } from '@/lib/types'
import { geographiesArrayFrontend } from '@/data/data'
import { MapPin, Edit3 } from 'lucide-react'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import ExpandableGeography from './ui/expandableGeography'

export default function GeographyModifier() {
	const [isOpen, setIsOpen] = useState(false)
	const geographies = useStore((state) => state.geographies)
	const addGeography = useStore((state) => state.addGeography)
	const removeGeography = useStore((state) => state.removeGeography)

	const handleGeographies = (geography: Geography) => {
		if (geographies.find((geo) => geography.value == geo.value)) {
			removeGeography(geography)
		} else {
			addGeography(geography)
		}
	}

	const selectedCount = geographies.length

	return (
		<div
			id="geo-modifier"
			className="w-44 md:w-56 lg:w-full"
		>
			<Sheet
				open={isOpen}
				onOpenChange={setIsOpen}
			>
				<SheetTrigger asChild>
					<button className="w-full bg-primary border-2 border-primary text-white flex items-center justify-between px-4 py-2 h-10 md:h-12 xl:h-16 hover:bg-primary/90 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md group">
						<div className="flex items-center gap-3">
							<div className="p-1.5 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
								<MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
							</div>
							<div className="text-left flex flex-col leading-tight">
								<span className="font-semibold text-xs md:text-sm lg:text-base block">
									Geographies
								</span>
								{selectedCount > 0 ? (
									<span className="text-xs text-white/80">
										{selectedCount} selected
									</span>
								) : (
									<span className="text-xs text-white/80">
										Click to select
									</span>
								)}
							</div>
						</div>
						<Edit3 className="h-4 w-4 lg:h-5 lg:w-5 text-white/70 group-hover:text-white transition-colors" />
					</button>
				</SheetTrigger>

				<SheetContent
					side="right"
					className="w-full sm:w-[540px] lg:w-[600px] bg-white overflow-scroll"
				>
					<SheetHeader>
						<SheetTitle className="text-xl lg:text-2xl text-primary">
							Modify Your Geographies
						</SheetTitle>
						<SheetDescription>
							Update your geography selection to see relevant
							opportunities.
							{selectedCount > 0 && (
								<span className="block mt-2 font-medium text-primary">
									Currently selected: {selectedCount} geograph
									{selectedCount === 1 ? 'y' : 'ies'}
								</span>
							)}
						</SheetDescription>
					</SheetHeader>

					<div className="mt-6 space-y-6">
						{/* Selected geographies summary */}
						{selectedCount > 0 && (
							<div className="bg-primary/5 rounded-lg p-4">
								<h4 className="font-medium text-primary mb-3">
									Selected Geographies
								</h4>
								<div className="flex flex-wrap gap-2">
									{geographies.map((geo, index) => (
										<span
											key={index}
											className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm rounded-full"
										>
											{geo.label}
											<button
												onClick={() =>
													handleGeographies(geo)
												}
												className="hover:bg-white/20 rounded-full p-0.5 ml-1 text-lg leading-none"
												aria-label={`Remove ${geo.label}`}
											>
												×
											</button>
										</span>
									))}
								</div>
							</div>
						)}

						{/* Geography selection */}
						<div className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								{geographiesArrayFrontend.map(
									(item, groupIndex) => {
										if (item.countries) {
											return (
												<div
													key={groupIndex}
													className="space-y-3"
												>
													<ExpandableGeography
														title={item.label}
														defaultOpen={
															item.value ===
															'eu27'
														}
													>
														<div
															className={`pl-4 ${
																item.value ===
																'eu27'
																	? 'grid grid-cols-1 gap-y-2'
																	: 'space-y-2'
															}`}
														>
															{item.countries.map(
																(
																	country,
																	countryIndex
																) => {
																	const isSelected =
																		geographies.find(
																			(
																				geo
																			) =>
																				country.value ===
																				geo.value
																		)
																	return (
																		<label
																			key={
																				countryIndex
																			}
																			className="flex items-center gap-3 cursor-pointer hover:bg-primary/5 rounded px-2 py-1 transition-colors"
																		>
																			<input
																				type="checkbox"
																				value={
																					country.value
																				}
																				checked={
																					!!isSelected
																				}
																				onChange={() =>
																					handleGeographies(
																						country
																					)
																				}
																				className="custom-checkbox"
																			/>
																			<span className="text-sm text-primary">
																				{
																					country.label
																				}
																			</span>
																		</label>
																	)
																}
															)}
														</div>
													</ExpandableGeography>
												</div>
											)
										} else {
											const isSelected = geographies.find(
												(geo) =>
													item.value === geo.value
											)
											const isDisabled =
												item.value === 'BR'

											return (
												<div
													key={groupIndex}
													className="md:col-span-2"
												>
													<label
														className={`flex items-center gap-3 p-3 transition-colors ${
															isDisabled
																? 'bg-gray-50 border-gray-200 cursor-not-allowed'
																: 'cursor-pointer hover:bg-primary/5 border-primary/20'
														}`}
													>
														<input
															disabled={
																isDisabled
															}
															type="checkbox"
															value={item.value}
															checked={
																!!isSelected
															}
															onChange={() =>
																handleGeographies(
																	item
																)
															}
															className={`custom-checkbox ${
																isDisabled
																	? 'disabled:bg-gray-200 disabled:border-gray-300 disabled:cursor-not-allowed'
																	: ''
															}`}
														/>
														<span
															className={`text-sm ${
																isDisabled
																	? 'text-gray-400'
																	: 'text-primary'
															}`}
														>
															{item.label}
														</span>
													</label>
												</div>
											)
										}
									}
								)}
							</div>
						</div>

						{/* Actions */}
						<div className="flex justify-between items-center pt-4 border-t">
							<button
								onClick={() => {
									geographies.forEach((geo) =>
										removeGeography(geo)
									)
								}}
								className="text-sm text-primary/60 hover:text-primary transition-colors"
							>
								Clear all
							</button>
							<button
								onClick={() => setIsOpen(false)}
								className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
							>
								Done
							</button>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
