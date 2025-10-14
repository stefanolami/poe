'use client'
import * as React from 'react'
import { useStore } from '@/store/store'

interface Props {
	periodEnd?: string | null
}

// Computes remaining subscription days from period_end and updates global store.
// Fallback: if no periodEnd or computed <=0, leaves previous value (initially 365) so selectors can fallback to annual pricing.
export function SubscriptionRemainingSync({ periodEnd }: Props) {
	const setRemaining = useStore((s) => s.setSubscriptionRemainingDays)
	React.useEffect(() => {
		if (!periodEnd) return
		const end = new Date(periodEnd)
		const today = new Date()
		// Normalize times to noon to avoid DST boundary shifts
		end.setHours(12, 0, 0, 0)
		today.setHours(12, 0, 0, 0)
		const diffMs = end.getTime() - today.getTime()
		const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
		if (days > 0 && days <= 365) {
			setRemaining(days)
		}
	}, [periodEnd, setRemaining])
	return null
}
