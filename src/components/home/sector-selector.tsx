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
			changeSector({})
			setActiveSector('')
			setOpenGeographies(false)
			return
		} else {
			console.log('different sector')
			changeSector(sector)
			setActiveSector(sector.label)
			setOpenGeographies(true)
			setTimeout(() => {
				geoRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 100)
		}
	}

	const handleContinue = () => {
		if (geographies.length > 0 && Object.keys(storeSector).length > 0) {
			router.push(`/selection`)
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
			<div className="md:hidden">
				<div className="flex flex-col xl:flex-row items-center justify-center gap-4 xl:gap-12 mx-auto mt-10 xl:mt-12 3xl:mt-24">
					{activeSector !== 'Aviation' ? (
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
					{activeSector !== 'E-Mobility' ? (
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
				<div className="my-2 xl:my-16 justify-self-end">
					<p className="text-center text-red-500 h-10 mt-6 xl:mt-0 xl:my-4">
						{missingGeographies}
					</p>
					<button
						className="mx-auto font-unna font-bold text-base xl:text-3xl flex items-center justify-center bg-secondary hover:brightness-95 overflow-hidden text-white w-40 xl:w-52 h-9 xl:h-16"
						onClick={handleContinue}
					>
						Continue
					</button>
				</div>
			</div>

			{/* BIG */}
			<div className="hidden md:block">
				<div className="grid grid-cols-2 justify-center items-center w-auto gap-4 xl:gap-12 mx-auto mt-10 xl:mt-12 3xl:mt-24">
					{/* LEFT */}
					<div className="justify-self-end self-start">
						<div className="justify-self-end">
							{activeSector !== 'Aviation' && (
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
						</div>
						{activeSector == 'E-Mobility' && (
							<div className="my-2 xl:my-4 justify-self-end flex flex-col items-end justify-between">
								<p className="hidden md:block text-right text-base xl:text-xl text-wrap w-64 xl:w-96 mt-10 md:mt-0">
									Please choose the geographies you are
									interested in
								</p>
								<p className="text-center text-red-500 h-10 mt-6 xl:mt-0 xl:my-4 text-base md:text-lg xl:text-xl">
									{missingGeographies}
								</p>
								<button
									className="ml-auto font-unna font-bold text-base md:text-xl xl:text-3xl flex items-center justify-center bg-secondary hover:brightness-95 overflow-hidden text-white w-40 md:w-48 xl:w-52 h-9 md:h-12 xl:h-16"
									onClick={handleContinue}
								>
									Continue
								</button>
							</div>
						)}
						<div ref={geoRef}>
							{openGeographies && activeSector == 'Aviation' && (
								<>
									<GeographySelector />
									<div className="my-2 xl:my-16 justify-self-end">
										<p className="text-center text-red-500 h-10 mt-6 xl:mt-0 xl:my-4">
											{missingGeographies}
										</p>
									</div>
								</>
							)}
						</div>
					</div>

					{/* RIGHT */}
					<div className="justify-self-start self-start">
						<div className="justify-self-end">
							{activeSector !== 'E-Mobility' && (
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
						{activeSector == 'Aviation' && (
							<div className="my-2 xl:my-4 justify-self-end flex flex-col items-end justify-between">
								<p className="hidden md:block text-left text-base xl:text-xl text-wrap w-64 xl:w-96 mt-10 md:mt-0">
									Please choose the geographies you are
									interested in
								</p>
								<p className="text-center text-red-500 h-10 mt-6 xl:mt-0 xl:my-4 text-base md:text-lg xl:text-xl">
									{missingGeographies}
								</p>
								<button
									className="mr-auto font-unna font-bold text-base md:text-xl xl:text-3xl flex items-center justify-center bg-secondary hover:brightness-95 overflow-hidden text-white w-40 md:w-48 xl:w-52 h-9 md:h-12 xl:h-16"
									onClick={handleContinue}
								>
									Continue
								</button>
							</div>
						)}
						<div ref={geoRef}>
							{openGeographies &&
								activeSector == 'E-Mobility' && (
									<>
										<GeographySelector />
										<div className="my-2 xl:my-16 justify-self-end">
											<p className="text-center text-red-500 h-10 mt-6 xl:mt-0 xl:my-4">
												{missingGeographies}
											</p>
										</div>
									</>
								)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
