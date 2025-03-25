'use client'
import { useStore } from '@/store/store'
import { Geography } from '@/lib/types'

const ITEMS = [
	{ value: 'euAdmin', label: 'EU Administrated' },
	{ value: 'eu27', label: 'EU27, Island, Norway, UK, Switzerland ' },
	{ value: 'brazil', label: 'Brazil' },
	{ value: 'turkey', label: 'Turkey ' },
	{ value: 'colombia', label: 'Colombia ' },
	{ value: 'russia', label: 'Russia ' },
]

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
		<div className="text-xs md:text-base xl:text-2xl w-full">
			<p className="text-center mt-10 md:mt-0 md:hidden">
				Please choose the geographies you are interested in:
			</p>
			<ul className="flex flex-col items-center md:items-start justify-center gap-3 xl:gap-4 mx-auto mt-6 md:mt-0">
				{ITEMS.map((item, index) => (
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
				))}
			</ul>
		</div>
	)
}
