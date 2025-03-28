import Image from 'next/image'

export default function Hero() {
	return (
		<div className="relative mx-auto w-1/2 md:w-1/3 max-w-[520px] aspect-[116/23] my-10 md:my-16 lg:my-20 xl:my-24">
			<Image
				src="/poe-hero-logo.png"
				fill
				alt="POE hero logo"
			/>
		</div>
	)
}
