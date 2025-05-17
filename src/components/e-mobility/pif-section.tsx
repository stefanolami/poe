import { useStore } from '@/store/store'
import { SelectableItem } from '@/store/store.types'
import { useShallow } from 'zustand/shallow'

type FieldType = {
	label: string
	value: string
	subFields?: SelectableItem[]
}

type SectionType = {
	label: string
	value: string
	fields: FieldType[]
}

const PifSection = ({ section }: { section: SectionType }) => {
	const { label, fields } = section

	const { storeData, addData, removeData } = useStore(
		useShallow((state) => ({
			storeData: state.data,
			addData: state.addData,
			removeData: state.removeData,
		}))
	)

	const handleCheckbox = (
		e: React.ChangeEvent<HTMLInputElement>,
		item: SelectableItem
	) => {
		if (storeData.eMobility.pif?.find((el) => el.value === item.value)) {
			removeData('pif', item)
		} else {
			addData('pif', item)
		}
	}

	return (
		<div className="w-full mt-8">
			<div className="w-full px-5 py-2 xl:py-3 mb-4 bg-primary text-white font-unna text-base md:text-lg lg:text-2xl xl:text-3xl">
				{label}
				<span className="block text-xs md:text-sm lg:text-base xl:text-lg">
					Low-risk, repayable loans from financing organisations
					supported by public means.
				</span>
			</div>
			<ul className="mt-3 px-2 py-2 xl:py-5 flex flex-col justify-between items-start gap-3">
				{fields.map((field, index) => (
					<li
						className="w-full flex flex-row items-start justify-between text-xs md:text-sm lg:text-base text-primary"
						key={index}
					>
						<div className="flex flex-row items-start gap-1 justify-start">
							<input
								type="checkbox"
								id="checkbox-report-eu"
								value="report-eu"
								onChange={(e) => handleCheckbox(e, field)}
								checked={storeData.eMobility.pif?.length > 0}
								className="custom-checkbox scale-[.8] peer"
							/>
							<label
								className="max-w-[600px]"
								htmlFor="checkbox-report-eu"
							>
								{field.label}
							</label>
						</div>

						{/* 
						<span className="block text-nowrap">
							EUR {field.price?.default} / year
						</span> */}
					</li>
				))}
			</ul>
		</div>
	)
}

export default PifSection
