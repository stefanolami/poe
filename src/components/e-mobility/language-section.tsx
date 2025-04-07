import { useStore } from '@/store/store'
import { SelectableItem } from '@/store/store.types'
import React from 'react'
import { useShallow } from 'zustand/shallow'

const LanguageSection = ({
	languages,
}: {
	languages: {
		label: string
		value: string
	}[]
}) => {
	const { storeLanguages, addLanguage, removeLanguage } = useStore(
		useShallow((state) => ({
			storeLanguages: state.languages,
			addLanguage: state.addLanguage,
			removeLanguage: state.removeLanguage,
		}))
	)

	const handleLanguages = (
		e: React.ChangeEvent<HTMLInputElement>,
		item: SelectableItem
	) => {
		if (e.target.checked) {
			addLanguage(item)
		} else {
			removeLanguage(item)
		}
	}

	return (
		<div
			className="w-full xl:pb-5"
			id="language-section"
		>
			<div className="w-full px-5 py-2 xl:py-3 bg-primary text-white font-unna text-base text-balance xl:text-3xl">
				Language
			</div>
			<div className="mt-3 px-2 py-2">
				<span className="text-pretty block text-primary text-xs xl:text-lg">
					All monitoring is furnished in English. The reports can be
					available in the following languages with an additional{' '}
					<strong>25 percent</strong> for each country, on top of the
					total costs:
				</span>
				<ul className="mt-3 space-y-1 text-xs">
					{languages.map((item, index) => (
						<li
							key={item.value}
							className="flex flex-row items-center justify-between text-primary"
						>
							<div className="flex flex-row items-center gap-1 justify-start">
								<input
									type="checkbox"
									id={`checkbox-language-${index}`}
									value={item.value}
									onChange={(e) => handleLanguages(e, item)}
									checked={
										storeLanguages?.find(
											(element) =>
												element.value === item.value
										)
											? true
											: false
									}
									className="custom-checkbox scale-[.8] peer"
								/>
								<label
									htmlFor={`checkbox-language-${index}`}
									className="peer-checked:font-bold"
								>
									{item.label}
								</label>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default LanguageSection
