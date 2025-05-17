'use client'

import { selectionData } from '@/data/data'
import { removeParenthesesContent } from '@/lib/utils'
import { useStore } from '@/store/store'
import { MobilityData } from '@/store/store.types'
import React from 'react'
import { useShallow } from 'zustand/shallow'

const AccountSummary = () => {
	const { storeData, storeGeographies, getTotalPrice, getSinglePrice } =
		useStore(
			useShallow((state) => ({
				storeData: state.data,
				storeLanguages: state.languages,
				storeGeographies: state.geographies,
				getTotalPrice: state.getTotalPrice,
				getSinglePrice: state.getSinglePrice,
				addSingleGeography: state.addSingleGeography,
				removeSingleGeography: state.removeSingleGeography,
			}))
		)
	return (
		<div className="lg:order-2">
			<h2 className="text-lg md:text-xl lg:text-3xl mb-4 lg:mb-10">
				Your Plan
			</h2>
			<div className="my-4">
				<span className="text-base md:text-lg lg:text-xl">
					{storeGeographies.length > 1 ? 'Geographies' : 'Geography'}
				</span>
				<ul className="mt-2 space-y-1 list-disc list-inside pl-1">
					{storeGeographies.map((item, index) => (
						<li
							className="text-sm md:text-base"
							key={index}
						>
							{item.label}
						</li>
					))}
				</ul>
			</div>
			<div className="my-4">
				{Object.keys(storeData.eMobility).map((key, index) => {
					if (
						key !== 'typeOfVehicleContract' &&
						key !== 'chargingStationsContract' &&
						key !== 'eVehiclesMaintenance' &&
						key !== 'report'
					) {
						const category =
							selectionData.eMobility[
								key as keyof typeof selectionData.eMobility
							]
						if (
							storeData.eMobility[key as keyof MobilityData]
								.length > 0
						) {
							return (
								<div
									className="mt-2 space-y-2"
									key={index}
								>
									<span className="text-base md:text-lg lg:text-xl">
										{key == 'deployment'
											? 'Grants Deployment'
											: key == 'project'
												? 'Grants Innovative Projects'
												: category.label}
									</span>
									<ul className="text-sm md:text-base space-y-1 lg:space-y-2 list-disc list-inside pl-1">
										{storeData.eMobility[
											key as keyof MobilityData
										].map((item, index) => (
											<li
												className="flex flex-row items-center justify-between"
												key={index}
											>
												<span className="list-item">
													{removeParenthesesContent(
														item.label
													)}
												</span>
												<span>
													€{' '}
													{getSinglePrice(
														key as keyof MobilityData,
														item
													)}
													/year
												</span>
											</li>
										))}
									</ul>
								</div>
							)
						}
					} /* else if (key === 'report') {
                        const category =
                            storeData.eMobility[key as keyof MobilityData]

                        if (category.length > 0) {
                            return (
                                <div
                                    className="mt-2"
                                    key={index}
                                >
                                    <span className="text-lg">Reports</span>
                                    <ul className="pl-1 pr-3">
                                        {category.map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex w-full items-center justify-between gap-4 py-2"
                                            >
                                                <span className="text-white">
                                                    {item.value == 'eu'
                                                        ? 'EU'
                                                        : 'Non-EU'}
                                                </span>
                                                <span className="text-white">
                                                    € {item.price?.default}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        }
                    } */ else if (
						key === 'typeOfVehicleContract' ||
						key === 'chargingStationsContract'
					) {
						if (
							storeData.eMobility[key as keyof MobilityData]
								.length > 0
						) {
							return (
								<div
									className="mt-2 space-y-2 mb-4"
									key={index}
								>
									<span className="w-1/3 bg-primary h-[1px] block"></span>
									<ul className="text-sm md:text-base space-y-1 list-disc list-inside pl-1">
										{storeData.eMobility[
											key as keyof MobilityData
										].map((item, index) => (
											<li key={index}>{item.label}</li>
										))}
									</ul>
								</div>
							)
						}
					}
				})}
			</div>

			<div className="mb-3 mt-6 text-base md:text-lg lg:text-xl">
				<div className="flex flex-row items-center justify-between ">
					<span>TOTAL</span>
					<span>€ {getTotalPrice()}/year</span>
				</div>
			</div>
			<span className="w-full bg-primary h-[1px] my-8 block lg:hidden"></span>
		</div>
	)
}

export default AccountSummary
