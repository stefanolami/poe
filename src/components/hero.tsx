import Image from 'next/image'
import Link from 'next/link'

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
			<Link
				href="/login"
				className="absolute z-10 right-10 -top-16 hidden lg:block"
			>
				<button className="bg-primary-light text-white font-jose px-10 py-3 shadow-md hover:scale-[1.02] hover:shadow-xl text-lg">
					Login
				</button>
			</Link>
		</div>
	)
}
