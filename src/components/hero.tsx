'use client'

import Image from 'next/image'
import UsersLoginSection from './users-login-section'

export default function Hero() {
	return (
		<div className="w-full relative">
			<div className="relative mx-auto w-1/2 md:w-1/3 max-w-[520px] aspect-[116/23]">
				<Image
					src="/poe-hero-logo.png"
					fill
					alt="POE hero logo"
				/>
			</div>
			<div className="hidden lg:block absolute right-10 -top-20">
				<UsersLoginSection />
			</div>
		</div>
	)
}
