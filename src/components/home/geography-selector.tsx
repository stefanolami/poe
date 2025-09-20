'use client'
import { useStore } from '@/store/store'
import { Geography } from '@/lib/types'
import { geographiesArrayFrontend } from '@/data/data'
import ExpandableGeography from '../ui/expandableGeography'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type GeographyGroup = {
	label: string
	value: string
	countries?: Geography[]
}

export default function GeographySelector() {
	const geographies = useStore<Geography[]>((state) => state.geographies)
	const addGeography = useStore((state) => state.addGeography)
	const removeGeography = useStore((state) => state.removeGeography)
	const [isExpanded, setIsExpanded] = useState(false)

	const handleGeographies = (geography: Geography) => {
		if (geographies.find((geo) => geography.value === geo.value)) {
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
				<h3 className="text-lg md:text-xl xl:text-2xl font-semibold text-primary my-4 md:my-0 md:mb-3">
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
						className={`h-5 w-5 text-primary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
					/>
				</button>
			</div>

			{/* Expanded geography selection */}
			{isExpanded && (
				<div className="bg-white border-2 border-primary/20 rounded-lg p-6 lg:p-8">
					{/* Mobile: original stacked layout */}
					<div className="grid gap-6 md:hidden">
						{(geographiesArrayFrontend as GeographyGroup[]).map(
							(group, groupIndex) => {
								if (
									group.countries &&
									group.countries.length > 0
								) {
									return (
										<div
											key={groupIndex}
											className="space-y-3 flex items-start justify-start"
										>
											<ExpandableGeography
												title={group.label}
												defaultOpen={true}
											>
												<div
													className={`pl-4 ${group.value === 'eu27' ? 'grid grid-cols-2 gap-x-4 gap-y-2' : 'space-y-2'}`}
												>
													{[
														'eu27',
														'otherEu',
													].includes(group.value) && (
														<label
															className={`flex items-center gap-3 cursor-pointer hover:bg-primary/5 rounded px-2 py-1 transition-colors ${group.value === 'eu27' ? 'col-span-2' : ''}`}
														>
															{(() => {
																const countries =
																	group.countries ||
																	[]
																const selectedInGroup =
																	countries.filter(
																		(c) =>
																			geographies.some(
																				(
																					g
																				) =>
																					g.value ===
																					c.value
																			)
																	)
																const allSelected =
																	selectedInGroup.length ===
																		countries.length &&
																	countries.length >
																		0
																const onToggleAll =
																	() => {
																		if (
																			allSelected
																		) {
																			// Deselect all
																			countries.forEach(
																				(
																					c
																				) => {
																					if (
																						geographies.some(
																							(
																								g
																							) =>
																								g.value ===
																								c.value
																						)
																					) {
																						removeGeography(
																							c
																						)
																					}
																				}
																			)
																		} else {
																			// Select all
																			countries.forEach(
																				(
																					c
																				) => {
																					if (
																						!geographies.some(
																							(
																								g
																							) =>
																								g.value ===
																								c.value
																						)
																					) {
																						addGeography(
																							c
																						)
																					}
																				}
																			)
																		}
																	}
																return (
																	<>
																		<input
																			type="checkbox"
																			checked={
																				allSelected
																			}
																			onChange={
																				onToggleAll
																			}
																			className="custom-checkbox"
																		/>
																		<span className="text-sm md:text-base text-primary">
																			Select
																			all
																		</span>
																	</>
																)
															})()}
														</label>
													)}
													{group.countries.map(
														(
															country,
															countryIndex
														) => {
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
									const single: Geography = {
										label: group.label,
										value: group.value,
									}
									const isSelected = geographies.find(
										(geo) => single.value === geo.value
									)
									const isDisabled = single.value === 'BR'
									return (
										<div
											key={groupIndex}
											className="space-y-3 flex items-start justify-start"
										>
											<label
												className={`grid grid-cols-[1.25rem,1fr] items-center gap-3 px-2 py-1 rounded transition-colors ${
													isDisabled
														? 'bg-gray-50 cursor-not-allowed'
														: 'cursor-pointer hover:bg-primary/5'
												}`}
											>
												<span className="inline-flex w-5 justify-start">
													<input
														disabled={isDisabled}
														type="checkbox"
														value={single.value}
														checked={!!isSelected}
														onChange={() =>
															handleGeographies(
																single
															)
														}
														className={`custom-checkbox ${isDisabled ? 'disabled:bg-gray-200 disabled:border-gray-300 disabled:cursor-not-allowed' : ''}`}
													/>
												</span>
												<span
													className={`text-sm md:text-base ${isDisabled ? 'text-gray-400' : 'text-primary'} font-medium`}
												>
													{single.label}
												</span>
											</label>
										</div>
									)
								}
							}
						)}
					</div>

					{/* Desktop: fixed 3-column layout */}
					<div className="hidden md:grid md:grid-cols-3 gap-6">
						{/* Column 1: EU-Administered and Brazil */}
						<div className="space-y-3">
							{(() => {
								const euAdmin = (
									geographiesArrayFrontend as GeographyGroup[]
								).find((i) => i.value === 'euAdmin')
								if (!euAdmin) return null
								const isSelected = geographies.find(
									(geo) => euAdmin.value === geo.value
								)
								return (
									<label className="flex items-center gap-3 cursor-pointer hover:bg-primary/5 rounded px-2 py-1 transition-colors">
										<input
											type="checkbox"
											value={euAdmin.value}
											checked={!!isSelected}
											onChange={() =>
												handleGeographies({
													label: euAdmin.label,
													value: euAdmin.value,
												})
											}
											className="custom-checkbox"
										/>
										<span className="text-sm md:text-base text-primary font-medium">
											{euAdmin.label}
										</span>
									</label>
								)
							})()}

							{(() => {
								const brazil = (
									geographiesArrayFrontend as GeographyGroup[]
								).find((i) => i.value === 'BR')
								if (!brazil) return null
								const isSelected = geographies.find(
									(geo) => brazil.value === geo.value
								)
								const isDisabled = true
								return (
									<label
										className={`flex items-center gap-3 rounded px-2 py-1 transition-colors ${
											isDisabled
												? 'bg-gray-50 cursor-not-allowed'
												: 'cursor-pointer hover:bg-primary/5'
										}`}
									>
										<input
											disabled={isDisabled}
											type="checkbox"
											value={brazil.value}
											checked={!!isSelected}
											onChange={() =>
												handleGeographies({
													label: brazil.label,
													value: brazil.value,
												})
											}
											className={`custom-checkbox ${
												isDisabled
													? 'disabled:bg-gray-200 disabled:border-gray-300 disabled:cursor-not-allowed'
													: ''
											}`}
										/>
										<span
											className={`text-sm md:text-base ${isDisabled ? 'text-gray-400' : 'text-primary'} font-medium`}
										>
											{brazil.label}
										</span>
									</label>
								)
							})()}
						</div>

						{/* Column 2: EU-27 accordion */}
						<div className="space-y-3">
							{(() => {
								const eu27 = (
									geographiesArrayFrontend as GeographyGroup[]
								).find((i) => i.value === 'eu27')
								if (!eu27 || !eu27.countries) return null
								return (
									<ExpandableGeography
										title={eu27.label}
										defaultOpen={true}
									>
										<div className="pl-4 pt-1 grid grid-cols-2 gap-x-4 gap-y-2">
											{(() => {
												const countries =
													eu27.countries || []
												const selectedInGroup =
													countries.filter(
														(c: Geography) =>
															geographies.some(
																(g) =>
																	g.value ===
																	c.value
															)
													)
												const allSelected =
													selectedInGroup.length ===
														countries.length &&
													countries.length > 0
												const onToggleAll = () => {
													if (allSelected) {
														countries.forEach(
															(c: Geography) => {
																if (
																	geographies.some(
																		(g) =>
																			g.value ===
																			c.value
																	)
																) {
																	removeGeography(
																		c
																	)
																}
															}
														)
													} else {
														countries.forEach(
															(c: Geography) => {
																if (
																	!geographies.some(
																		(g) =>
																			g.value ===
																			c.value
																	)
																) {
																	addGeography(
																		c
																	)
																}
															}
														)
													}
												}
												return (
													<label className="flex items-center gap-3 cursor-pointer hover:bg-primary/5 rounded px-2 py-1 transition-colors col-span-2">
														<input
															type="checkbox"
															checked={
																allSelected
															}
															onChange={
																onToggleAll
															}
															className="custom-checkbox"
														/>
														<span className="text-sm md:text-base text-primary font-medium">
															Select all
														</span>
													</label>
												)
											})()}
											{eu27.countries.map(
												(country, idx) => {
													const isSelected =
														geographies.find(
															(geo) =>
																country.value ===
																geo.value
														)
													return (
														<label
															key={idx}
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
															<span className="text-sm md:text-base text-primary font-medium">
																{country.label}
															</span>
														</label>
													)
												}
											)}
										</div>
									</ExpandableGeography>
								)
							})()}
						</div>

						{/* Column 3: Other European Countries accordion */}
						<div className="space-y-3">
							{(() => {
								const other = (
									geographiesArrayFrontend as GeographyGroup[]
								).find((i) => i.value === 'otherEu')
								if (!other || !other.countries) return null
								return (
									<ExpandableGeography
										title={other.label}
										defaultOpen={true}
									>
										<div className="pl-4 pt-1 space-y-2">
											{(() => {
												const countries =
													other.countries || []
												const selectedInGroup =
													countries.filter(
														(c: Geography) =>
															geographies.some(
																(g) =>
																	g.value ===
																	c.value
															)
													)
												const allSelected =
													selectedInGroup.length ===
														countries.length &&
													countries.length > 0
												const onToggleAll = () => {
													if (allSelected) {
														countries.forEach(
															(c: Geography) => {
																if (
																	geographies.some(
																		(g) =>
																			g.value ===
																			c.value
																	)
																) {
																	removeGeography(
																		c
																	)
																}
															}
														)
													} else {
														countries.forEach(
															(c: Geography) => {
																if (
																	!geographies.some(
																		(g) =>
																			g.value ===
																			c.value
																	)
																) {
																	addGeography(
																		c
																	)
																}
															}
														)
													}
												}
												return (
													<label className="flex items-center gap-3 cursor-pointer hover:bg-primary/5 rounded px-2 py-1 transition-colors">
														<input
															type="checkbox"
															checked={
																allSelected
															}
															onChange={
																onToggleAll
															}
															className="custom-checkbox"
														/>
														<span className="text-sm md:text-base text-primary font-medium">
															Select all
														</span>
													</label>
												)
											})()}
											{other.countries.map(
												(country, idx) => {
													const isSelected =
														geographies.find(
															(geo) =>
																country.value ===
																geo.value
														)
													return (
														<label
															key={idx}
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
															<span className="text-sm md:text-base text-primary font-medium">
																{country.label}
															</span>
														</label>
													)
												}
											)}
										</div>
									</ExpandableGeography>
								)
							})()}
						</div>
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
