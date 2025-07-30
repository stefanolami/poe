'use client'

import { useEffect } from 'react'
import { getUserRole } from '@/actions/auth'
import { useShallow } from 'zustand/shallow'
import { createClient } from '@/supabase/client'
import { useAuthStore } from '@/store/auth-store'

export function useSyncAuthState() {
	const { setUserRole, setAuthInitialized } = useAuthStore(
		useShallow((state) => ({
			setUserRole: state.setUserRole,
			setAuthInitialized: state.setAuthInitialized,
		}))
	)

	useEffect(() => {
		console.log('useSyncAuthState: Setting up auth...')
		setUserRole(null)
		setAuthInitialized(false)

		const initAuth = async () => {
			// Check initial session
			console.log('Checking session...')
			try {
				const role = await getUserRole()
				console.log('Found role:', role)
				if (
					role === 'client' ||
					role === 'admin' ||
					role === 'super-admin' ||
					role === 'supervisor' ||
					role === 'consultant'
				) {
					setUserRole(role)
				}
			} catch (error) {
				console.error('Failed to check user session:', error)
			} finally {
				setAuthInitialized(true)
			}

			// Set up auth listener
			const supabase = createClient()
			const {
				data: { subscription },
			} = supabase.auth.onAuthStateChange(async (event, session) => {
				console.log('Auth state changed:', event, !!session)
				if (event === 'SIGNED_OUT' || !session) {
					setUserRole(null)
				} else if (event === 'SIGNED_IN' && session) {
					const role = await getUserRole()
					console.log('Auth listener found role:', role)
					setUserRole(role)
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
			console.log('Cleaning up auth listener')
			subscription?.unsubscribe()
		}
	}, [setUserRole, setAuthInitialized])
}
