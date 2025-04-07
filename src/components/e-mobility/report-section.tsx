import { useStore } from '@/store/store'
import { SelectableItem } from '@/store/store.types'
import { useShallow } from 'zustand/shallow'

const ReportSection = ({
	section,
}: {
	section: {
		label: string
		value: string
		fieldsLabel: string
		fields: SelectableItem[]
		contracts: SelectableItem[]
	}
}) => {
	const { label, fields } = section

	const { storeData, addData, removeData } = useStore(
		useShallow((state) => ({
			storeData: state.data,
			addData: state.addData,
			removeData: state.removeData,
		}))
	)

	const handleCheckbox = (item: SelectableItem) => {
		if (storeData.eMobility.report.find((el) => el.value === item.value)) {
			removeData('report', item)
		} else {
			addData('report', item)
		}
	}

	return (
		<div className="w-full mt-8">
			<div className="w-full px-5 py-2 xl:py-3 bg-primary text-white font-unna text-base text-balance xl:text-3xl">
				{label}
			</div>
			<ul className="mt-3 px-2 py-2 xl:py-5 flex flex-col justify-between items-start gap-3">
				{fields.map((field, index) => (
					<li
						className="flex flex-row justify-start items-start gap-1 text-xs text-primary"
						key={index}
					>
						<input
							type="checkbox"
							id="checkbox-report-eu"
							value="report-eu"
							onChange={() => handleCheckbox(field)}
							checked={
								storeData.eMobility.report.find(
									(element) => element.value === field.value
								)
									? true
									: false
							}
							className="custom-checkbox scale-[.8] peer"
						/>
						<label
							className="peer-checked:font-bold"
							htmlFor="checkbox-report-eu"
						>
							{field.label}
						</label>
						<span className="block text-nowrap">
							EUR {field.price?.default} / year
						</span>
					</li>
				))}
			</ul>
		</div>
	)
}

export default ReportSection
