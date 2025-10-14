'use client'

import { useEffect, useMemo, useState } from 'react'
import { useStore } from '@/store/store'
import { useShallow } from 'zustand/shallow'
import { selectionData } from '@/data/data'
import TendersSection from '@/components/e-mobility/tenders-sections'
import GrantsSection from '@/components/e-mobility/grants-section'
import GeographyModifier from '@/components/geography-modifier'
import SummaryDesktopEdit from '@/components/account/summary-desktop-edit'
import SummaryMobileEdit from '@/components/account/summary-mobile-edit'
import { SubscriptionRemainingSync } from '@/components/account/subscription-remaining-sync'
import type { ClientSelectionType, ClientDataJsonType } from '@/lib/types'
import { SelectableItem, CategoryData } from '@/store/store.types'
import { useToast } from '@/hooks/use-toast'

type Props = {
	clientId: string
	initialSelection: ClientSelectionType
	onClose?: () => void
	subscriptionPeriodEnd?: string | null // ISO date (yyyy-mm-dd) for current subscription end
}

/**
 * SelectionEdit allows a client to edit their current selection based on the
 * public e-mobility selector UI. On submit it sends a selection change request.
 */
export default function SelectionEdit({
	clientId,
	initialSelection,
	onClose,
	subscriptionPeriodEnd,
}: Props) {
	const [submitting, setSubmitting] = useState(false)
	const { toast } = useToast()

	// Pull store actions and state
	const { storeData, changeSector, addGeography } = useStore(
		useShallow((state) => ({
			storeData: state.data,
			changeSector: state.changeSector,
			addGeography: state.addGeography,
		}))
	)

	// Seed selection into store on mount
	useEffect(() => {
		changeSector({ value: 'eMobility', label: 'E-Mobility' })
		const geoMap = new Map<string, { value: string; label: string }>()
		const collect = (items?: ClientDataJsonType[] | null) => {
			items?.forEach((it) => {
				it.geographies?.forEach((g) => {
					if (!geoMap.has(g.value)) geoMap.set(g.value, g)
				})
			})
		}
		collect(initialSelection.typeOfVehicle)
		collect(initialSelection.chargingStations)
		collect(initialSelection.pif)
		collect(initialSelection.deployment)
		collect(initialSelection.project)
		//eslint-disable-next-line
		Array.from(geoMap.values()).forEach((g) => addGeography(g as any))

		type SelectionDataCategory =
			| 'typeOfVehicle'
			| 'chargingStations'
			| 'pif'
			| 'deployment'
			| 'project'
		const mapItems = (
			category: SelectionDataCategory,
			items?: ClientDataJsonType[] | null
		): SelectableItem[] => {
			return (items || []).map((item) => ({
				value: item.value,
				label:
					(
						selectionData.eMobility[category] as CategoryData
					)?.fields.find((f) => f.value === item.value)?.label ||
					item.value,
				geographies: item.geographies ? [...item.geographies] : [],
			}))
		}

		const typeOfVehicle = mapItems(
			'typeOfVehicle',
			initialSelection.typeOfVehicle
		)
		const chargingStations = mapItems(
			'chargingStations',
			initialSelection.chargingStations
		)
		const pif = mapItems('pif', initialSelection.pif)
		const deployment = mapItems('deployment', initialSelection.deployment)
		const project = mapItems('project', initialSelection.project)

		const typeOfVehicleContract = (
			initialSelection.typeOfVehicleContract || []
		)
			.map((val) =>
				selectionData.eMobility.typeOfVehicle.contracts?.find(
					(c) => c.value === val
				)
			)
			.filter(Boolean) as SelectableItem[]
		const chargingStationsContract = (
			initialSelection.chargingStationsContract || []
		)
			.map((val) =>
				selectionData.eMobility.chargingStations.contracts?.find(
					(c) => c.value === val
				)
			)
			.filter(Boolean) as SelectableItem[]

		useStore.setState((prev) => ({
			data: {
				...prev.data,
				eMobility: {
					typeOfVehicle,
					typeOfVehicleContract,
					chargingStations,
					chargingStationsContract,
					pif,
					deployment,
					project,
				},
			},
		}))
	}, [initialSelection, changeSector, addGeography])

	const toSelection: ClientSelectionType = useMemo(() => {
		const em = storeData.eMobility
		const mapItems = (items: SelectableItem[]): ClientDataJsonType[] =>
			items.map((i) => ({
				value: i.value,
				geographies: i.geographies || [],
			}))
		return {
			typeOfVehicle: mapItems(em.typeOfVehicle),
			typeOfVehicleContract: em.typeOfVehicleContract.map((i) => i.value),
			chargingStations: mapItems(em.chargingStations),
			chargingStationsContract: em.chargingStationsContract.map(
				(i) => i.value
			),
			pif: mapItems(em.pif),
			deployment: mapItems(em.deployment),
			project: mapItems(em.project),
		}
	}, [storeData])

	const handleSubmit = async () => {
		setSubmitting(true)
		try {
			const res = await fetch('/api/selection-changes/request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ clientId, toSelection }),
			})
			type ApiResponse = { ok: boolean; error?: string; change?: unknown }
			const isJson =
				res.headers.get('content-type')?.includes('application/json') ??
				false
			let json: ApiResponse | null = null
			let rawText: string | undefined
			if (res.redirected && res.url.includes('/login')) {
				throw new Error('Please log in to request a selection change.')
			}
			if (res.status === 401 || res.status === 403) {
				throw new Error('You are not authorized. Please log in again.')
			}
			if (isJson) {
				try {
					json = (await res.json()) as ApiResponse
				} catch (err) {
					rawText = await res.text()
					console.error('Selection change parse error:', err, rawText)
				}
			} else {
				rawText = await res.text()
				console.error('Selection change non-JSON response:', rawText)
			}
			if (!res.ok || !(json && json.ok)) {
				const message =
					(json && json.error) ||
					(rawText && rawText.length < 500
						? rawText
						: `Request failed with status ${res.status}`)
				throw new Error(message)
			}
			toast({
				title: 'Request submitted',
				description:
					"Your selection change request has been sent. We'll notify you by email.",
				variant: 'default',
			})
			onClose?.()
		} catch (e) {
			const description =
				e instanceof Error
					? e.message
					: 'Failed to submit selection change'
			toast({
				title: 'Error',
				description,
				variant: 'destructive',
			})
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="space-y-4">
			<SubscriptionRemainingSync periodEnd={subscriptionPeriodEnd} />
			<div className="flex flex-col lg:flex-row gap-4">
				<div className="lg:w-[380px] lg:hidden">
					<GeographyModifier />
				</div>
				<div className="flex-1" />
			</div>

			<div className="grid lg:grid-cols-[2fr_1fr] gap-6">
				<div className="space-y-6">
					<div>
						<div className="w-full px-5 py-2 bg-primary text-white font-unna text-lg">
							Public Procurement Opportunities
						</div>
						{Object.entries(selectionData.eMobility).map(
							([key, value]) => {
								if (
									key === 'typeOfVehicle' ||
									key === 'chargingStations'
								) {
									return (
										<TendersSection
											key={key}
											section={value as CategoryData}
											category={key}
										/>
									)
								}
							}
						)}
					</div>
					<div>
						<div className="w-full px-5 py-2 bg-primary text-white font-unna text-lg">
							Public Grants
						</div>
						{Object.entries(selectionData.eMobility).map(
							([key, value]) => {
								if (key === 'deployment' || key === 'project') {
									return (
										<GrantsSection
											key={key}
											section={value as CategoryData}
											category={key}
										/>
									)
								}
							}
						)}
					</div>
				</div>
				<div className="lg:sticky top-6 self-start">
					<div className="hidden lg:block">
						<GeographyModifier />
						<SummaryDesktopEdit
							onRequest={handleSubmit}
							submitting={submitting}
						/>
					</div>
					<div className="lg:hidden">
						<SummaryMobileEdit
							onRequest={handleSubmit}
							submitting={submitting}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
