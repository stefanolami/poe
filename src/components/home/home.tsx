import React from 'react'
import Hero from '../hero'
import SectorSelector from './sector-selector'

const HomeComponent = () => {
	return (
		<div className="mb-24 xl:mb-20 relative">
			<Hero />
			<div className="space-y-2 text-left text-primary text-xs md:text-base xl:text-xl m-5 md:my-16 xl:my-24 font-normal w-4/5 md:w-3/4 xl:w-2/3 max-w-screen-lg mx-auto">
				<p>
					POE is a real-time alert system connecting you to local,
					regional and global publicly-supported funding, financial &
					business opportunities:
				</p>
				<ul className="list-disc list-outside pl-5">
					<li>
						<strong>Public Grants</strong> - non-repayable pockets
						designed for developing and implementing your innovative
						projects, or supporting the implementation of government
						policy-driven ambitions with your products, services &
						knowledge.
					</li>
					<li>
						<strong>Public Investment Financing</strong> - typically
						low-risk, repayable loans to support the development of
						your ambitions locally and globally.
					</li>
					<li>
						<strong>Public Procurement</strong> - business
						opportunities to sell your products, services and
						knowledge to government or government-driven
						infrastructure.
					</li>
				</ul>
				<p>
					These opportunities are identified by our global teams of
					experts who have direct access to the decision-makers, have
					local knowledge, speak the local language and have the
					sectoral expertise. Do not be surprised if you will know
					about opportunities before they are officially published.
					And, looking beyond, our experts can ensure a most
					competitive proposal, and/or help you implement your project
					from cradle-to-cradle.{' '}
				</p>
			</div>
			<SectorSelector />
		</div>
	)
}

export default HomeComponent
