import { useStore } from '@/store/store'
import { MobilityData, SelectableItem } from '@/store/store.types'
import { useShallow } from 'zustand/shallow'

type FieldType = {
	label: string
	value: string
	subFields?: SelectableItem[]
}

type SectionType = {
	label: string
	subTitle?: string
	fields: FieldType[]
}

const GrantsSection = ({
	section,
	category,
}: {
	section: SectionType
	category: string
}) => {
	const { label, fields } = section

	const { storeData, addData, removeData, getSinglePrice, getAllAbovePrice } =
		useStore(
			useShallow((state) => ({
				storeData: state.data,
				addData: state.addData,
				removeData: state.removeData,
				getSinglePrice: state.getSinglePrice,
				getAllAbovePrice: state.getAllAbovePrice,
			}))
		)

	const handleCheckbox = (
		item: SelectableItem,
		category: keyof MobilityData
	) => {
		if (
			storeData.eMobility[category]?.find((el) => el.value === item.value)
		) {
			removeData(category, item)
		} else {
			addData(category, item)
		}
	}

	const handleAllAbove = (
		e: React.ChangeEvent<HTMLInputElement>,
		category: keyof MobilityData
	) => {
		if (e.target.checked) {
			fields.forEach((item) => {
				if (
					!storeData.eMobility[category]?.find(
						(el: SelectableItem) => el.value === item.value
					)
				) {
					addData(category, item)
				}
			})
		} else {
			fields.forEach((item) => {
				if (
					storeData.eMobility[category]?.find(
						(el: SelectableItem) => el.value === item.value
					)
				) {
					removeData(category, item)
				}
			})
		}
	}

	return (
		<div className="text-xs md:text-sm lg:text-base">
			<p className="px-2 text-primary">{label}</p>
			<ul className="space-y-1 mt-3 mb-6 px-2">
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
										item,
										category as keyof MobilityData
									)
								}
								checked={
									storeData.eMobility[
										category as keyof MobilityData
									]?.find(
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
								]?.find(
									(element) => element.value === item.value
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
							id={`checkbox-${category}-all-above`}
							value="all"
							onChange={(e) =>
								handleAllAbove(
									e,
									category as keyof MobilityData
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
							htmlFor={`checkbox-${category}-all-above`}
						>
							All of the above
						</label>
					</div>
					<span
						className={
							storeData.eMobility[category as keyof MobilityData]
								.length === fields.length
								? 'font-bold'
								: ''
						}
					>{`€ ${getAllAbovePrice(
						category as keyof MobilityData
					)} / year`}</span>
				</li>
			</ul>
		</div>
	)
}

export default GrantsSection
