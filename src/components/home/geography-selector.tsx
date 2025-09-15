'use client'
import { useStore } from '@/store/store'
import { Geography } from '@/lib/types'
import { geographiesArrayFrontend } from '@/data/data'
import ExpandableGeography from '../ui/expandableGeography'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function GeographySelector() {
	const geographies = useStore<Geography[]>((state) => state.geographies)
	const addGeography = useStore((state) => state.addGeography)
	const removeGeography = useStore((state) => state.removeGeography)
	const [isExpanded, setIsExpanded] = useState(false)

	const handleGeographies = (geography: Geography) => {
		if (geographies.find((geo) => geography.value == geo.value)) {
			removeGeography(geography)
		} else {
			addGeography(geography)
		}
	}

	const selectedCount = geographies.length
	const hasSelections = selectedCount > 0

	return (
		<div className="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
			{/* Header */}
			<div className="text-center mb-6">
				<h3 className="text-lg md:text-xl xl:text-2xl font-semibold text-primary mb-4">
					Select Your Geographies
				</h3>
			</div>

			{/* Always visible selected items */}
			{hasSelections && (
				<div className="bg-primary/5 rounded-lg p-4 mb-6 w-fit mx-auto">
					<div className="flex items-center justify-between gap-4 mb-3">
						<h4 className="text-base md:text-lg font-medium text-primary">
							Selected Geographies ({selectedCount})
						</h4>
						<button
							onClick={() => {
								// Clear all selections
								geographies.forEach((geo) =>
									removeGeography(geo)
								)
							}}
							className="text-sm text-primary/60 hover:text-primary transition-colors underline"
						>
							Clear all
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{geographies.map((geo, index) => (
							<span
								key={index}
								className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm md:text-base rounded-full"
							>
								{geo.label}
								<button
									onClick={() => handleGeographies(geo)}
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

			{/* Toggle button */}
			<div className="text-center mb-6">
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary/20 rounded-lg hover:border-primary/40 transition-colors"
				>
					<span className="text-primary font-medium">
						{isExpanded
							? 'Hide geography options'
							: 'Show geography options'}
					</span>
					<ChevronDown
						className={`h-5 w-5 text-primary transition-transform ${
							isExpanded ? 'rotate-180' : ''
						}`}
					/>
				</button>
			</div>

			{/* Expanded geography selection */}
			{isExpanded && (
				<div className="bg-white border-2 border-primary/20 rounded-lg p-6 lg:p-8">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
						{geographiesArrayFrontend.map((item, groupIndex) => {
							if (item.countries) {
								return (
									<div
										key={groupIndex}
										className="space-y-3 flex items-start justify-start"
									>
										<ExpandableGeography
											title={item.label}
											defaultOpen={true}
										>
											<div
												className={`pl-4 ${
													item.value === 'eu27'
														? 'grid grid-cols-2 gap-x-4 gap-y-2'
														: 'space-y-2'
												}`}
											>
												{item.countries.map(
													(country, countryIndex) => {
														const isSelected =
															geographies.find(
																(geo) =>
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
																<span className="text-sm md:text-base text-primary">
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
									(geo) => item.value === geo.value
								)
								const isDisabled = item.value === 'BR'

								return (
									<div
										key={groupIndex}
										className="space-y-3 flex items-start justify-start"
									>
										<label
											className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
												isDisabled
													? 'bg-gray-50 border-gray-200 cursor-not-allowed'
													: 'cursor-pointer'
											}`}
										>
											<input
												disabled={isDisabled}
												type="checkbox"
												value={item.value}
												checked={!!isSelected}
												onChange={() =>
													handleGeographies(item)
												}
												className={`custom-checkbox ${
													isDisabled
														? 'disabled:bg-gray-200 disabled:border-gray-300 disabled:cursor-not-allowed'
														: ''
												}`}
											/>
											<span
												className={`text-sm md:text-base ${
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
						})}
					</div>

					{/* Done button */}
					<div className="text-center mt-8 pt-6 border-t border-primary/20">
						<button
							onClick={() => setIsExpanded(false)}
							className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-base font-medium"
						>
							Done selecting
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
