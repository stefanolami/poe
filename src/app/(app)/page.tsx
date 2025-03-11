import Hero from '@/components/home/hero'
import SectorSelector from '@/components/home/sector-selector'

export default function HomePage() {
	return (
		<div className="mb-24 xl:mb-20">
			<Hero />
			<SectorSelector />
		</div>
	)
}
