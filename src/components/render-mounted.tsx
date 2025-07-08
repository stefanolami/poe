'use client'

import { useSyncAuthState } from '@/hooks/use-synch-auth-state'
import React, { ReactNode, useEffect, useState } from 'react'

export const RenderMounted = ({ children }: { children: ReactNode }) => {
	const [mounted, setMounted] = useState(false)

	useSyncAuthState()

	useEffect(() => setMounted(true), [])

	if (!mounted) return null

	return <>{children}</>
}
