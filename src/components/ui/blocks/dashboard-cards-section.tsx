'use client'

import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '../toggle-group'
import { useState } from 'react'
import Link from 'next/link'

type DashboardDataType = {
	clients: { created_at: string }[] | []
	grants: { created_at: string }[] | []
	alerts: { created_at: string; matched_clients: string[] | null }[] | []
}

export function DashboardCardSection({ data }: { data: DashboardDataType }) {
	const [timeRange, setTimeRange] = useState('90d')

	const { clients, grants, alerts } = data

	console.log('DashboardCardSection data:', data)

	const filterDataByTimeRange = (
		data: { created_at: string; matched_clients?: string[] | null }[]
	) => {
		return data.filter((item) => {
			const itemDate = new Date(item.created_at)
			const now = new Date()

			let timeLimit: Date

			switch (timeRange) {
				case '90d':
					timeLimit = new Date(now.setDate(now.getDate() - 90))
					break
				case '2d':
					timeLimit = new Date(now.setDate(now.getDate() - 2))
					break
				case '1d':
					timeLimit = new Date(now.setDate(now.getDate() - 1))
					break
				default:
					timeLimit = new Date(now.setDate(now.getDate() - 90))
			}

			return itemDate >= timeLimit
		})
	}

	const getMatchedClientsCount = (
		alerts: { created_at: string; matched_clients: string[] | null }[]
	) => {
		return filterDataByTimeRange(alerts).reduce((count, alert) => {
			if (alert.matched_clients && alert.matched_clients.length > 0) {
				return count + alert.matched_clients.length
			}
			return count
		}, 0)
	}

	const getPeriodIncrease = (
		data: { created_at: string }[],
		timeRange: string
	): number => {
		const now = new Date()

		// Determine period length in days
		const days = timeRange === '1d' ? 1 : timeRange === '2d' ? 2 : 90

		// Current period
		const periodStart = new Date(now)
		periodStart.setDate(now.getDate() - days)

		// Previous period
		const prevPeriodStart = new Date(periodStart)
		prevPeriodStart.setDate(periodStart.getDate() - days)

		// Count for current period
		const currentCount = data.filter((item) => {
			const date = new Date(item.created_at)
			return date >= periodStart && date <= now
		}).length

		// Count for previous period
		const prevCount = data.filter((item) => {
			const date = new Date(item.created_at)
			return date >= prevPeriodStart && date < periodStart
		}).length

		if (prevCount === 0) {
			return currentCount > 0 ? Infinity : 0
		}

		return ((currentCount - prevCount) / prevCount) * 100
	}
	const clientsIncrease = getPeriodIncrease(clients, timeRange)
	const grantsIncrease = getPeriodIncrease(grants, timeRange)
	const alertsIncrease = getPeriodIncrease(alerts, timeRange)
	return (
		<div>
			<div>
				<ToggleGroup
					type="single"
					value={timeRange}
					onValueChange={setTimeRange}
					variant="outline"
					className="w-fit ml-auto"
				>
					<ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
					<ToggleGroupItem value="2d">Last 30 days</ToggleGroupItem>
					<ToggleGroupItem value="1d">Last 7 days</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
				{/* <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"> */}
				<Link href="/admin/clients">
					<Card className="@container/card h-full w-full">
						<CardHeader>
							<CardDescription className="flex flex-row items-center justify-between">
								<span>Latest Clients</span>
								<Badge variant="outline">
									<TrendingDown />
									<span>
										{clientsIncrease > 0 ? '+' : ''}
										{clientsIncrease.toFixed(1)}%
									</span>
								</Badge>
							</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{filterDataByTimeRange(clients).length || 0}
							</CardTitle>
							{/* <CardAction></CardAction> */}
						</CardHeader>
						<CardFooter className="flex-col items-start gap-1.5 text-sm">
							<div className="line-clamp-1 flex gap-2 font-medium">
								Trending up this month{' '}
								<TrendingUp className="size-4" />
							</div>
							<div className="text-muted-foreground">
								Visitors for the last 6 months
							</div>
						</CardFooter>
					</Card>
				</Link>
				<Link href="/admin/grants">
					<Card className="@container/card h-full w-full">
						<CardHeader>
							<CardDescription className="flex flex-row items-center justify-between">
								<span>Latest Grants</span>
								<Badge variant="outline">
									<TrendingDown />
									<span>
										{grantsIncrease > 0 ? '+' : ''}
										{grantsIncrease.toFixed(1)}%
									</span>
								</Badge>
							</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{filterDataByTimeRange(grants).length || 0}
							</CardTitle>
							{/* <CardAction>
						<Badge variant="outline">
							<IconTrendingDown />
							-20%
						</Badge>
					</CardAction> */}
						</CardHeader>
						<CardFooter className="flex-col items-start gap-1.5 text-sm">
							<div className="line-clamp-1 flex gap-2 font-medium">
								Down 20% this period{' '}
								<TrendingDown className="size-4" />
							</div>
							<div className="text-muted-foreground">
								Acquisition needs attention
							</div>
						</CardFooter>
					</Card>
				</Link>
				<Link href="/admin/alerts">
					<Card className="@container/card h-full w-full">
						<CardHeader>
							<CardDescription className="flex flex-row items-center justify-between">
								<span>Latest Alerts</span>
								<Badge variant="outline">
									<TrendingDown />
									<span>
										{alertsIncrease > 0 ? '+' : ''}
										{alertsIncrease.toFixed(1)}%
									</span>
								</Badge>
							</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{filterDataByTimeRange(alerts).length || 0}
							</CardTitle>
							{/* <CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+12.5%
						</Badge>
					</CardAction> */}
						</CardHeader>
						<CardFooter className="flex-col items-start gap-1.5 text-sm">
							<div className="line-clamp-1 flex gap-2 font-medium">
								Strong user retention{' '}
								<TrendingUp className="size-4" />
							</div>
							<div className="text-muted-foreground">
								Engagement exceed targets
							</div>
						</CardFooter>
					</Card>
				</Link>
				<Link href="/admin/alerts">
					<Card className="@container/card h-full w-full">
						<CardHeader>
							<CardDescription className="flex flex-row items-center justify-between">
								<span>Latest Clients</span>
								<Badge variant="outline">
									<TrendingDown />
									<span>
										{clientsIncrease > 0 ? '+' : ''}
										{clientsIncrease.toFixed(1)}%
									</span>
								</Badge>
							</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{getMatchedClientsCount(alerts) || 0}
							</CardTitle>
							{/* <CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+4.5%
						</Badge>
					</CardAction> */}
						</CardHeader>
						<CardFooter className="flex-col items-start gap-1.5 text-sm">
							<div className="line-clamp-1 flex gap-2 font-medium">
								Steady performance increase{' '}
								<TrendingUp className="size-4" />
							</div>
							<div className="text-muted-foreground">
								Meets growth projections
							</div>
						</CardFooter>
					</Card>
				</Link>
			</div>
		</div>
	)
}
