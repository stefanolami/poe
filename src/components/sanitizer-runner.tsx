'use client'
import { useEffect, useRef } from 'react'
import { useStore } from '@/store/store'

/**
 * Runs the store __sanitize() method exactly once on first client mount.
 * Place this high in the component tree (e.g., in app layout or AuthProvider).
 */
export function SanitizerRunner() {
	const ranRef = useRef(false)
	const sanitize = useStore((s) => s.__sanitize)
	useEffect(() => {
		if (!ranRef.current) {
			ranRef.current = true
			try {
				sanitize?.()
			} catch (e) {
				console.warn('Sanitize failed', e)
			}
		}
	}, [sanitize])
	return null
}
