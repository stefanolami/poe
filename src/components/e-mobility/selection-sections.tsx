'use client'

import { MobilityData, SelectableItem } from '@/store/store.types'
import { useStore } from '@/store/store'
import { useShallow } from 'zustand/shallow'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SelectionSection = ({
	section,
	category,
}: {
	section: {
		label: string
		value: string
		fieldsLabel: string
		fields: SelectableItem[]
		contracts: SelectableItem[]
	}
	category: string
}) => {
	const { label, fieldsLabel, fields, contracts } = section

	const router = useRouter()

	const contractCategory =
		category === 'typeOfVehicle'
			? 'typeOfVehicleContract'
			: 'chargingStationsContract'

	const {
		storeData,
		storeSector,
		geographies,
		addData,
		removeData,
		getSinglePrice,
		getAllAbovePrice,
	} = useStore(
		useShallow((state) => ({
			storeSector: state.sector,
			storeData: state.data,
			geographies: state.geographies,
			addData: state.addData,
			removeData: state.removeData,
			getSinglePrice: state.getSinglePrice,
			getAllAbovePrice: state.getAllAbovePrice,
		}))
	)

	const handleCheckbox = (
		category: keyof MobilityData,
		item: SelectableItem,
		isContract: boolean
	) => {
		if (!isContract) {
			if (
				storeData.eMobility[category].find(
					(el) => el.value === item.value
				)
			) {
				removeData(category, item)
			} else {
				addData(category, item)
			}
		} else {
			if (
				storeData.eMobility[contractCategory].find(
					(el) => el.value === item.value
				)
			) {
				removeData(contractCategory, item)
			} else {
				addData(contractCategory, item)
			}
		}
	}

	const handleAllAbove = (
		e: React.ChangeEvent<HTMLInputElement>,
		category: keyof MobilityData,
		isContract: boolean
	) => {
		if (!isContract) {
			if (e.target.checked) {
				fields.forEach((item) => {
					if (
						!storeData.eMobility[category].find(
							(el: SelectableItem) => el.value === item.value
						)
					) {
						addData(category, item)
					}
				})
			} else {
				fields.forEach((item) => {
					if (
						storeData.eMobility[category].find(
							(el: SelectableItem) => el.value === item.value
						)
					) {
						removeData(category, item)
					}
				})
			}
		} else {
			if (e.target.checked) {
				contracts.forEach((item) => {
					if (
						!storeData.eMobility[contractCategory].find(
							(el: SelectableItem) => el.value === item.value
						)
					) {
						addData(contractCategory, item)
					}
				})
			} else {
				contracts.forEach((item) => {
					if (
						storeData.eMobility[contractCategory].find(
							(el: SelectableItem) => el.value === item.value
						)
					) {
						removeData(contractCategory, item)
					}
				})
			}
		}
	}

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (
				Object.keys(storeSector).length === 0 ||
				geographies.length === 0
			) {
				router.push(`/`)
			}
		}, 2000)

		return () => clearTimeout(timeoutId) // Cleanup function
		//eslint-disable-next-line
	}, [storeSector, geographies])

	return (
		<div className="w-full">
			<div className="w-full px-5 pt-2 pb-1 xl:py-3 bg-secondary text-white font-bold text-sm md:text-base lg:text-xl">
				{label}
			</div>
			<div className="px-2 text-xs md:text-sm lg:text-base  my-3">
				<span className="block text-primary font-bold text-xs md:text-base lg:text-lg">
					{fieldsLabel}
				</span>

				{/* FIELDS */}
				<ul className="space-y-1 mt-3">
					{fields.map((item, index) => (
						<li
							key={item.value}
							className="flex flex-row items-center justify-between text-primary"
						>
							<div className="flex flex-row items-center gap-1 justify-start">
								<input
									type="checkbox"
									id={`checkbox-${category}-${index}`}
									value={item.value}
									onChange={() =>
										handleCheckbox(
											category as keyof MobilityData,
											item,
											false
										)
									}
									checked={
										storeData.eMobility[
											category as keyof MobilityData
										].find(
											(element) =>
												element.value === item.value
										)
											? true
											: false
									}
									className="custom-checkbox scale-[.8] peer"
								/>
								<label
									htmlFor={`checkbox-${category}-${index}`}
									className="peer-checked:font-bold"
								>
									{item.label}
								</label>
							</div>
							<span
								className={
									storeData.eMobility[
										category as keyof MobilityData
									].find(
										(element) =>
											element.value === item.value
									)
										? 'font-bold'
										: ''
								}
							>{`€ ${getSinglePrice(
								category as keyof MobilityData,
								item
							)} / year`}</span>
						</li>
					))}
					<li
						key="all-above"
						className="flex flex-row items-center justify-between text-primary"
					>
						<div className="flex flex-row items-center gap-1 justify-start">
							<input
								type="checkbox"
								id="checkbox-vehicle-type-all-above"
								value="all"
								onChange={(e) =>
									handleAllAbove(
										e,
										category as keyof MobilityData,
										false
									)
								}
								checked={
									storeData.eMobility[
										category as keyof MobilityData
									]?.length === fields.length
										? true
										: false
								}
								className="custom-checkbox scale-[.8] peer"
							/>
							<label
								className="peer-checked:font-bold"
								htmlFor="checkbox-vehicle-type-all-above"
							>
								All of the above
							</label>
						</div>
						<span
							className={
								storeData.eMobility[
									category as keyof MobilityData
								].length === fields.length
									? 'font-bold'
									: ''
							}
						>{`€ ${getAllAbovePrice(
							category as keyof MobilityData
						)} / year`}</span>
					</li>
				</ul>

				{/* CONTRACTS */}
				{storeData.eMobility[category as keyof MobilityData]?.length >
					0 && (
					<div className="mt-3">
						<span className="text-primary block font-bold text-xs md:text-sm lg:text-xl">
							Type of Contract
						</span>
						<span className="text-primary block text-xs md:text-sm lg:text-lg">
							(Needs to be selected as soon as any of the above
							are selected)
						</span>
						<ul className="space-y-1 mt-3">
							{contracts.map((item, index) => (
								<li
									key={item.value}
									className="flex flex-row items-center justify-between text-primary"
								>
									<div className="flex flex-row items-center gap-1 justify-start">
										<input
											type="checkbox"
											id={`checkbox-${category}-contract-${index}`}
											value={item.value}
											onChange={() =>
												handleCheckbox(
													category as keyof MobilityData,
													item,
													true
												)
											}
											checked={
												storeData.eMobility[
													contractCategory as keyof MobilityData
												].find(
													(element) =>
														element.value ===
														item.value
												)
													? true
													: false
											}
											className="custom-checkbox scale-[.8] peer"
										/>
										<label
											className="peer-checked:font-bold"
											htmlFor={`checkbox-${category}contract-${index}`}
										>
											{item.label}
										</label>
									</div>
								</li>
							))}
							<li
								key="all-above"
								className="flex flex-row items-center justify-between text-primary"
							>
								<div className="flex flex-row items-center gap-1 justify-start">
									<input
										type="checkbox"
										id={`checkbox-vehicle-contract-all-above`}
										value="all"
										onChange={(e) =>
											handleAllAbove(
												e,
												category as keyof MobilityData,
												true
											)
										}
										checked={
											storeData.eMobility[
												contractCategory as keyof MobilityData
											].length === contracts.length
												? true
												: false
										}
										className="custom-checkbox scale-[.8]"
									/>
									<label htmlFor="checkbox-vehicle-contract-all-above">
										All of the above
									</label>
								</div>
							</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	)
}

export default SelectionSection
