'use client'
import { useSyncAuthState } from '@/hooks/use-synch-auth-state'

export function AuthProvider({ children }: { children: React.ReactNode }) {
	useSyncAuthState()
	return <>{children}</>
}
