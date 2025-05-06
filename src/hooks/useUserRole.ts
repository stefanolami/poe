import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'

export function useUserRole() {
	const [role, setRole] = useState<'client' | 'admin' | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function load() {
			const supabase = createClient()
			const {
				data: { session },
			} = await supabase.auth.getSession()
			if (!session) return setLoading(false)

			const { data: profile } = await supabase
				.from('users_profiles')
				.select('role')
				.eq('user_id', session.user.id)
				.single()

			const role: 'client' | 'admin' | null =
				profile?.role === 'client' || profile?.role === 'admin'
					? profile.role
					: null

			setRole(role ?? null)
			setLoading(false)
		}

		load()
	})

	return { role, loading }
}
