'use client'

import { selectionData } from '@/data/data'
import GeographyModifier from '../geography-modifier'
import Hero from '../hero'
import SelectionSection from './selection-sections'
import ReportSection from './report-section'
import LanguageSection from './language-section'
import SummaryMobile from './summary-mobile'

const EmobilityComponent = () => {
	return (
		<div className="relative">
			<Hero />
			<section className="mx-auto w-[90%] font-jose mt-12">
				<div className="mx-auto flex lg:hidden flex-col items-center justify-center gap-2">
					<div className="flex justify-center items-center text-white font-unna font-bold text-lg bg-primary-light h-10 w-44">
						E-Mobility
					</div>
					<GeographyModifier />
				</div>
				<div className="hidden lg:flex justify-center items-center text-white font-unna font-bold text-4xl py-3 px-8 bg-primary-light w-fit mr-auto">
					E-Mobility
				</div>

				{/* SELECTION */}
				<div className="w-full">
					<div className="w-full mt-8 px-5 py-2 xl:py-3 mb-4 bg-primary text-white font-unna text-base xl:text-3xl">
						Public Procurement Opportunities (Tenders)
					</div>
					{Object.entries(selectionData.eMobility).map(
						([key, value]) =>
							value.value == 'report' ? (
								<ReportSection
									key={key}
									section={selectionData.eMobility.report}
								/>
							) : (
								<SelectionSection
									key={key}
									section={value}
									category={key}
								/>
							)
					)}
					<LanguageSection languages={selectionData.language} />
				</div>
			</section>
			<SummaryMobile />
		</div>
	)
}

export default EmobilityComponent
