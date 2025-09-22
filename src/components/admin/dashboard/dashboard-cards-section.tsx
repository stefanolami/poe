'use client'

import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Equal, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group'
import { useState } from 'react'
import Link from 'next/link'
import { DashboardDataType } from '@/lib/types'

export function DashboardCardSection({ data }: { data: DashboardDataType }) {
	const [timeRange, setTimeRange] = useState('3d')

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
				case '3d':
					timeLimit = new Date(now.setDate(now.getDate() - 3))
					break
				case '2d':
					timeLimit = new Date(now.setDate(now.getDate() - 2))
					break
				case '1d':
					timeLimit = new Date(now.setDate(now.getDate() - 1))
					break
				default:
					timeLimit = new Date(now.setDate(now.getDate() - 3))
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
		const days = timeRange === '1d' ? 1 : timeRange === '2d' ? 2 : 3

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
					className="w-full mt-4 md:mt-0 md:w-fit ml-auto"
				>
					<ToggleGroupItem value="3d">Last 3 days</ToggleGroupItem>
					<ToggleGroupItem value="2d">Last 2 days</ToggleGroupItem>
					<ToggleGroupItem value="1d">Last 1 day</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
				{/* <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"> */}

				<Card className="@container/card h-full w-full">
					<Link href="/admin/clients">
						<CardHeader>
							<CardDescription className="flex flex-row items-center justify-between">
								<span>Latest Clients</span>
								<Badge variant="outline">
									{clientsIncrease === Infinity ? (
										<>
											<Minus />
											<Minus className="-ml-[10px]" />
										</>
									) : (
										<>
											{Math.round(clientsIncrease) >
												0 && <TrendingUp />}
											{Math.round(clientsIncrease) <
												0 && <TrendingDown />}
											{Math.round(clientsIncrease) ==
												0 && <Equal />}
											<span className="ml-2">
												{clientsIncrease > 0 ? '+' : ''}
												{clientsIncrease.toFixed(1)}%
											</span>
										</>
									)}
								</Badge>
							</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{filterDataByTimeRange(clients).length || 0}
							</CardTitle>
						</CardHeader>
					</Link>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<ul>
							{clients.slice(0, 3).map((client, index) => (
								<li key={index}>
									<Link href={`/admin/clients/${client.id}`}>
										<span>
											{client.first_name}{' '}
											{client.last_name}
											{client.org_name &&
												` - ${client.org_name}`}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</CardFooter>
				</Card>

				<Card className="@container/card h-full w-full">
					<Link href="/admin/grants">
						<CardHeader>
							<CardDescription className="flex flex-row items-center justify-between">
								<span>Latest Grants</span>
								<Badge variant="outline">
									{grantsIncrease === Infinity ? (
										<>
											<Minus />
											<Minus className="-ml-[10px]" />
										</>
									) : (
										<>
											{Math.round(grantsIncrease) > 0 && (
												<TrendingUp />
											)}
											{Math.round(grantsIncrease) < 0 && (
												<TrendingDown />
											)}
											{Math.round(grantsIncrease) ==
												0 && <Equal />}
											<span className="ml-2">
												{grantsIncrease > 0 ? '+' : ''}
												{grantsIncrease.toFixed(1)}%
											</span>
										</>
									)}
								</Badge>
							</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{filterDataByTimeRange(grants).length || 0}
							</CardTitle>
						</CardHeader>
					</Link>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<ul>
							{grants.slice(0, 3).map((grant, index) => (
								<li key={index}>
									<Link href={`/admin/grants/${grant.id}`}>
										<span>
											{grant.call_title
												? grant.call_title
												: grant.grant_programme}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</CardFooter>
				</Card>
				<Card className="@container/card h-full w-full">
					<Link href="/admin/alerts">
						<CardHeader>
							<CardDescription className="flex flex-row items-center justify-between">
								<span>Latest Alerts</span>
								<Badge variant="outline">
									{alertsIncrease === Infinity ? (
										<>
											<Minus />
											<Minus className="-ml-[10px]" />
										</>
									) : (
										<>
											{Math.round(alertsIncrease) > 0 && (
												<TrendingUp />
											)}
											{Math.round(alertsIncrease) < 0 && (
												<TrendingDown />
											)}
											{Math.round(alertsIncrease) ==
												0 && <Equal />}
											<span className="ml-2">
												{alertsIncrease > 0 ? '+' : ''}
												{alertsIncrease.toFixed(1)}%
											</span>
										</>
									)}
								</Badge>
							</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{filterDataByTimeRange(alerts).length || 0}
							</CardTitle>
						</CardHeader>
					</Link>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<ul>
							{alerts.slice(0, 3).map((alert, index) => (
								<li key={index}>
									<Link href={`/admin/alerts/${alert.id}`}>
										<span>{alert.subject}</span>
									</Link>
								</li>
							))}
						</ul>
					</CardFooter>
				</Card>

				<Card className="@container/card h-full w-full">
					<CardHeader>
						<CardDescription className="flex flex-row items-center justify-between">
							<span>Notified Clients</span>
						</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							{getMatchedClientsCount(alerts) || 0}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
				</Card>
			</div>
		</div>
	)
}
