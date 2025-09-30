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
	const [timeRange, setTimeRange] = useState<'3d' | '1w' | '1m'>('3d')

	const { clients, grants, tenders, investments, alerts } = data

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
					timeLimit = new Date(
						now.getTime() - 3 * 24 * 60 * 60 * 1000
					)
					break
				case '1w':
					timeLimit = new Date(
						now.getTime() - 7 * 24 * 60 * 60 * 1000
					)
					break
				case '1m':
					// Approximate 1 month as 30 days for this dashboard metric
					timeLimit = new Date(
						now.getTime() - 30 * 24 * 60 * 60 * 1000
					)
					break
				default:
					timeLimit = new Date(
						now.getTime() - 3 * 24 * 60 * 60 * 1000
					)
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
		timeRange: '3d' | '1w' | '1m'
	): number => {
		const now = new Date()

		// Determine period length in days
		const days = timeRange === '3d' ? 3 : timeRange === '1w' ? 7 : 30

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
	const tendersIncrease = getPeriodIncrease(tenders, timeRange)
	const investmentsIncrease = getPeriodIncrease(investments, timeRange)
	const alertsIncrease = getPeriodIncrease(alerts, timeRange)
	return (
		<div>
			<div>
				<ToggleGroup
					type="single"
					value={timeRange}
					onValueChange={(v) => {
						if (!v) return
						setTimeRange(v as '3d' | '1w' | '1m')
					}}
					variant="outline"
					className="w-full mt-4 md:mt-0 md:w-fit ml-auto"
				>
					<ToggleGroupItem value="3d">3 days</ToggleGroupItem>
					<ToggleGroupItem value="1w">1 week</ToggleGroupItem>
					<ToggleGroupItem value="1m">1 month</ToggleGroupItem>
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
												: grant.programme_title}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</CardFooter>
				</Card>

				{/* Latest Tenders (after Grants) */}
				<Card className="@container/card h-full w-full">
					<Link href="/admin/tenders">
						<CardHeader>
							<CardDescription className="flex flex-row items-center justify-between">
								<span>Latest Tenders</span>
								<Badge variant="outline">
									{tendersIncrease === Infinity ? (
										<>
											<Minus />
											<Minus className="-ml-[10px]" />
										</>
									) : (
										<>
											{Math.round(tendersIncrease) >
												0 && <TrendingUp />}
											{Math.round(tendersIncrease) <
												0 && <TrendingDown />}
											{Math.round(tendersIncrease) ==
												0 && <Equal />}
											<span className="ml-2">
												{tendersIncrease > 0 ? '+' : ''}
												{tendersIncrease.toFixed(1)}%
											</span>
										</>
									)}
								</Badge>
							</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{filterDataByTimeRange(tenders).length || 0}
							</CardTitle>
						</CardHeader>
					</Link>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<ul>
							{tenders.slice(0, 3).map((tender, index) => (
								<li key={index}>
									<Link href={`/admin/tenders/${tender.id}`}>
										<span>
											{tender.call_title
												? tender.call_title
												: tender.programme_title}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</CardFooter>
				</Card>

				{/* Latest Investments (after Tenders) */}
				<Card className="@container/card h-full w-full">
					<Link href="/admin/investments">
						<CardHeader>
							<CardDescription className="flex flex-row items-center justify-between">
								<span>Latest Investments</span>
								<Badge variant="outline">
									{investmentsIncrease === Infinity ? (
										<>
											<Minus />
											<Minus className="-ml-[10px]" />
										</>
									) : (
										<>
											{Math.round(investmentsIncrease) >
												0 && <TrendingUp />}
											{Math.round(investmentsIncrease) <
												0 && <TrendingDown />}
											{Math.round(investmentsIncrease) ==
												0 && <Equal />}
											<span className="ml-2">
												{investmentsIncrease > 0
													? '+'
													: ''}
												{investmentsIncrease.toFixed(1)}
												%
											</span>
										</>
									)}
								</Badge>
							</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{filterDataByTimeRange(investments).length || 0}
							</CardTitle>
						</CardHeader>
					</Link>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<ul>
							{investments.slice(0, 3).map((inv, index) => (
								<li key={index}>
									<Link href={`/admin/investments/${inv.id}`}>
										<span>
											{inv.call_title
												? inv.call_title
												: inv.programme_title}
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
