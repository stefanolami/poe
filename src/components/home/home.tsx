import React from 'react'
import Hero from '../hero'
import SectorSelector from './sector-selector'

const HomeComponent = () => {
	return (
		<div className="mb-24 xl:mb-20">
			<Hero />
			<p className="text-center text-primary text-xs md:text-base xl:text-2xl m-5 xl:mt-16 3xl:mt-24 font-normal w-4/5 md:w-3/4 xl:w-2/3 max-w-screen-lg mx-auto">
				POE is a dynamic, real-time alert system designed to connect
				stakeholders—businesses, NGOs, and individuals—with public
				funding, public financing, and public tender opportunities. POE
				serves as an essential tool for those looking to sell products
				or services locally, regionally, or globally, ensuring they
				never miss an opportunity to engage in publicly funded projects.
			</p>
			<SectorSelector />
		</div>
	)
}

export default HomeComponent
