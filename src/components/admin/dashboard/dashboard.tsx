import { ChartAreaInteractive } from '@/components/ui/dashboard/chart-area-interactive'
import { DataTable } from '@/components/ui/dashboard/data-table'
import { SectionCards } from '@/components/ui/dashboard/section-cards'
import React from 'react'

const DashboardComponent = () => {
	return (
		<div className="bg-primary text-white">
			<h1 className="text-white font-jose text-2xl">Dashboard</h1>
			<div className="flex flex-1 flex-col">
				<div className="flex flex-1 flex-col gap-2">
					<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
						<SectionCards />
						<div className="px-4 lg:px-6">
							<ChartAreaInteractive />
						</div>
						{/*  <DataTable data={data} /> */}
					</div>
				</div>
			</div>
		</div>
	)
}

export default DashboardComponent
