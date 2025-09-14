'use client'

import { useState, useRef, /* useEffect, */ Ref } from 'react'
import { useRouter } from 'next/navigation'
import SectorButton from '@/components/home/sector-button'
import GeographySelector from '@/components/home/geography-selector'
import { useStore } from '@/store/store'

export default function SectorSelector() {
	const [openGeographies, setOpenGeographies] = useState(false)
	const [missingGeographies, setMissingGeographies] = useState('')
	const [activeSector, setActiveSector] = useState('')

	const storeSector = useStore((state) => state.sector)
	const changeSector = useStore((state) => state.changeSector)
	const geographies = useStore((state) => state.geographies)

	const geoRef: Ref<HTMLDivElement> = useRef(null)
	const router = useRouter()

	const handleClick = (sector: { value: string; label: string }) => {
		if (sector.label == activeSector) {
			console.log('same sector')
			changeSector({ value: '', label: '' })
			setActiveSector('')
			setOpenGeographies(false)
			return
		} else {
			console.log('different sector')
			changeSector(sector)
			setActiveSector(sector.value)
			setOpenGeographies(true)
			setTimeout(() => {
				geoRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 100)
		}
	}

	const handleContinue = () => {
		if (geographies.length > 0 && Object.keys(storeSector).length > 0) {
			if (activeSector === 'aviation') {
				router.push(`/aviation`)
			}
			if (activeSector === 'eMobility') {
				router.push(`/e-mobility`)
			}
		} else if (geographies.length === 0) {
			setMissingGeographies('Please select at least one geography')
		} else if (Object.keys(storeSector).length === 0) {
			setMissingGeographies(
				'Something went wrong. Please refresh the page and try again.'
			)
		}
	}

	/* useEffect(() => {
		if (!storeSector) {
			if (sectorParam) {
				changeSector(sectorParam)
				setOpenGeographies(true)
			} else {
				setOpenGeographies(false)
				console.log('opening geo', storeSector)
			}
		} else {
			setOpenGeographies(true)
		}
		//eslint-disable-next-line
	}, [locale, urlParams]) */

	return (
		<div>
			{/* MOBILE */}
			<div className="md:hidden text-primary">
				<div className="flex flex-col xl:flex-row items-center justify-center gap-4 xl:gap-12 mx-auto mt-10 xl:mt-12 3xl:mt-24">
					{activeSector !== 'aviation' ? (
						<SectorButton
							text={'E-Mobility'}
							handler={() =>
								handleClick({
									value: 'eMobility',
									label: 'E-Mobility',
								})
							}
							activeButton={activeSector}
						/>
					) : null}
					{activeSector !== 'eMobility' ? (
						<SectorButton
							text={'Aviation'}
							handler={() =>
								handleClick({
									value: 'aviation',
									label: 'Aviation',
								})
							}
							activeButton={activeSector}
						/>
					) : null}
				</div>
				<div ref={geoRef}>
					{openGeographies && <GeographySelector />}
				</div>
				{activeSector && (
					<div className="my-2 xl:my-16 mx-auto">
						<p className="text-center text-red-500 h-10 mt-6 xl:mt-0 xl:my-4">
							{missingGeographies}
						</p>
						<button
							className="mx-auto font-unna font-bold text-base xl:text-3xl flex items-center justify-center bg-secondary hover:brightness-95 overflow-hidden text-white w-40 xl:w-52 h-9 xl:h-16 shadow-md hover:shadow-xl"
							onClick={handleContinue}
						>
							Continue
						</button>
					</div>
				)}
			</div>

			{/* BIG */}
			<div className="hidden md:block">
				{/* Sector Buttons - Centered */}
				<div className="flex flex-col xl:flex-row items-center justify-center gap-4 xl:gap-12 mx-auto mt-10 xl:mt-12 3xl:mt-24">
					{activeSector !== 'aviation' && (
						<SectorButton
							text="E-Mobility"
							handler={() =>
								handleClick({
									value: 'eMobility',
									label: 'E-Mobility',
								})
							}
							activeButton={activeSector}
						/>
					)}
					{activeSector !== 'eMobility' && (
						<SectorButton
							text="Aviation"
							handler={() =>
								handleClick({
									value: 'aviation',
									label: 'Aviation',
								})
							}
							activeButton={activeSector}
						/>
					)}
				</div>

				{/* Geography Section - Centered Below Buttons */}
				{activeSector && (
					<div className="mt-8 xl:mt-12">
						<div className="text-center mb-6">
							<p className="text-base xl:text-xl text-primary mb-4">
								Get started by choosing the geographies you are
								interested in
							</p>
							<p className="text-red-500 h-10 text-base xl:text-xl">
								{missingGeographies}
							</p>
						</div>

						<div
							ref={geoRef}
							className="mb-8"
						>
							{openGeographies && <GeographySelector />}
						</div>

						<div className="text-center">
							<button
								className="font-unna font-bold text-base md:text-xl xl:text-3xl flex items-center justify-center bg-secondary hover:brightness-95 overflow-hidden text-white w-40 md:w-48 xl:w-52 h-9 md:h-12 xl:h-16 mx-auto shadow-md hover:shadow-xl"
								onClick={handleContinue}
							>
								Continue
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
