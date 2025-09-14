'use client'
import { useStore } from '@/store/store'
import { Geography } from '@/lib/types'
import { geographiesArrayFrontend } from '@/data/data'
import ExpandableGeography from '../ui/expandableGeography'

export default function GeographySelector() {
	const geographies = useStore<Geography[]>((state) => state.geographies)
	const addGeography = useStore((state) => state.addGeography)
	const removeGeography = useStore((state) => state.removeGeography)

	const handleGeographies = (geography: Geography) => {
		console.log(geographies.find((geo) => geography.value == geo.value))
		if (geographies.find((geo) => geography.value == geo.value)) {
			console.log('removing')
			removeGeography(geography)
		} else {
			addGeography(geography)
		}
	}

	return (
		<div className="text-xs md:text-base xl:text-2xl w-full text-primary">
			<p className="text-center mt-10 md:mt-0 md:hidden">
				Get started by choosing the geographies you are interested in
			</p>
			<ul className="flex flex-col items-center md:items-start justify-center gap-1 xl:gap-4 mx-auto mt-6 md:mt-0">
				{geographiesArrayFrontend.map((item, index) => {
					if (item.countries) {
						return (
							<li key={index}>
								<ExpandableGeography title={item.label}>
									{/* <ul className="flex flex-col items-center md:items-start justify-center gap-3 xl:gap-4 mx-auto mt-6 md:mt-0"> */}
									<ul className="lg:grid lg:grid-cols-2 space-y-1">
										{item.countries.map(
											(country, index) => {
												return (
													<li
														key={index}
														className="flex flex-row items-center gap-2 xl:gap-3 w-[242px] xl:w-[470px] pl-7"
													>
														<input
															type="checkbox"
															id={`checkbox-${index}`}
															value={
																country.value
															} // Use a unique value for each item
															checked={
																geographies.find(
																	(geo) =>
																		country.value ==
																		geo.value
																)
																	? true
																	: false
															} // Set checked state
															onChange={() =>
																handleGeographies(
																	country
																)
															}
															className="custom-checkbox"
														/>
														<label
															htmlFor={`checkbox-${index}`}
														>
															{country.label}
														</label>
													</li>
												)
											}
										)}
									</ul>
								</ExpandableGeography>
							</li>
						)
					} else {
						return (
							<li
								key={index}
								className="flex flex-row items-center gap-2 xl:gap-3 w-[242px] xl:w-[470px]"
							>
								<input
									disabled={item.value == 'BR'}
									type="checkbox"
									id={`checkbox-${index}`}
									value={item.value} // Use a unique value for each item
									checked={
										geographies.find(
											(geo) => item.value == geo.value
										)
											? true
											: false
									} // Set checked state
									onChange={() => handleGeographies(item)}
									className="custom-checkbox disabled:bg-gray-200 disabled:border-gray-300 disabled:cursor-not-allowed"
								/>
								<label
									className={
										item.value == 'BR'
											? 'cursor-not-allowed'
											: ''
									}
									htmlFor={`checkbox-${index}`}
								>
									{item.label}
								</label>
							</li>
						)
					}
				})}
				{/* {geographiesArrayFrontend.map((item, index) => (
					
					<li
						key={index}
						className="flex flex-row items-center gap-2 xl:gap-3 w-[242px] xl:w-[470px]"
					>
						<input
							type="checkbox"
							id={`checkbox-${index}`}
							value={item.value} // Use a unique value for each item
							checked={
								geographies.find(
									(geo) => item.value == geo.value
								)
									? true
									: false
							} // Set checked state
							onChange={() => handleGeographies(item)}
							className="custom-checkbox"
						/>
						<label htmlFor={`checkbox-${index}`}>
							{item.label}
						</label>
					</li>
				))} */}
			</ul>
		</div>
	)
}
