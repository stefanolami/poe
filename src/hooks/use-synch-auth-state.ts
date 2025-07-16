'use client'

import { useEffect } from 'react'
import { getUserRole } from '@/actions/auth'
import { useStore } from '@/store/store'
import { useShallow } from 'zustand/shallow'
import { createClient } from '@/supabase/client'

export function useSyncAuthState() {
	const { setUserRole, setIsAuthenticated } = useStore(
		useShallow((state) => ({
			setUserRole: state.setUserRole,
			setIsAuthenticated: state.setIsAuthenticated,
		}))
	)

	useEffect(() => {
		setUserRole(null)
		setIsAuthenticated(false)

		const initAuth = async () => {
			// Check initial session
			console.log('Checking session...')
			try {
				const role = await getUserRole()
				if (role === 'client' || role === 'admin') {
					setUserRole(role)
					setIsAuthenticated(true)
				}
			} catch (error) {
				console.error('Failed to check user session:', error)
			}

			// Set up auth listener
			const supabase = createClient()
			const {
				data: { subscription },
			} = supabase.auth.onAuthStateChange(async (event, session) => {
				if (event === 'SIGNED_OUT' || !session) {
					setUserRole(null)
					setIsAuthenticated(false)
				} else if (event === 'SIGNED_IN' && session) {
					const role = await getUserRole()
					setUserRole(role)
					setIsAuthenticated(true)
				}
			})

			return subscription
		}
		//eslint-disable-next-line
		let subscription: any
		initAuth().then((sub) => {
			subscription = sub
		})

		return () => {
			subscription?.unsubscribe()
		}
	}, [setUserRole, setIsAuthenticated])
}
