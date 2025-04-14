'use client'

import { selectionData } from '@/data/data'
import GeographyModifier from '../geography-modifier'
import Hero from '../hero'
import SelectionSection from './selection-sections'
import ReportSection from './report-section'
import LanguageSection from './language-section'
import SummaryMobile from './summary-mobile'
import SummaryDesktop from './summary-desktop'

const EmobilityComponent = () => {
	return (
		<div className="relative">
			<Hero />
			<section className="mx-auto w-[90%] max-w-[1200px] font-jose mt-12 lg:mt-28">
				<div className="mx-auto flex lg:hidden flex-col items-center justify-center gap-2">
					<div className="flex justify-center items-center text-white font-unna font-bold text-lg md:text-xl bg-primary-light h-10 md:h-12 w-44 md:w-56">
						E-Mobility
					</div>
					<GeographyModifier />
				</div>
				<div className="hidden lg:flex justify-center items-center text-white font-unna font-bold text-3xl w-56 h-16 bg-primary-light mr-auto">
					E-Mobility
				</div>

				{/* SELECTION */}
				<div className="w-full mt-8 md:mt-12 lg:mt-6 mb-5 md:mb-8 lg:flex flex-row items-start justify-between lg:gap-4">
					<div className="">
						<div className="w-full px-5 py-2 xl:py-3 mb-4 bg-primary text-white font-unna text-base md:text-lg lg:text-2xl xl:text-3xl">
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
					<div className="hidden lg:block lg:sticky top-10 self-start">
						<GeographyModifier />
						<SummaryDesktop />
					</div>
				</div>
			</section>
			<SummaryMobile />
		</div>
	)
}

export default EmobilityComponent
