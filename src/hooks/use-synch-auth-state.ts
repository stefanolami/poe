'use client'

import { useEffect } from 'react'
import { getUserRole } from '@/actions/auth'
import { useStore } from '@/store/store'

export function useSyncAuthState() {
	const setUserRole = useStore((state) => state.setUserRole)
	const setIsAuthenticated = useStore((state) => state.setIsAuthenticated)

	useEffect(() => {
		const checkSession = async () => {
			console.log('Checking user session...')
			try {
				const userRole = await getUserRole()
				if (userRole === 'client' || userRole === 'admin') {
					setUserRole(userRole)
					setIsAuthenticated(true)
				} else {
					setUserRole(null)
					setIsAuthenticated(false)
				}
			} catch {
				setUserRole(null)
				setIsAuthenticated(false)
			}
		}
		checkSession()
	}, [setUserRole, setIsAuthenticated])
}
