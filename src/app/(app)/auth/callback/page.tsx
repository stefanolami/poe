'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/supabase/client'

export default function AuthCallbackPage() {
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const run = async () => {
			const supabase = createClient()

			// Prefer explicit next, default to /account
			const next = searchParams.get('next') || '/account'

			// Parse hash if present (implicit flow)
			// Example: #access_token=...&refresh_token=...&type=magiclink
			const hash =
				typeof window !== 'undefined' ? window.location.hash : ''
			const hashParams = new URLSearchParams(
				hash.startsWith('#') ? hash.slice(1) : hash
			)
			const access_token =
				hashParams.get('access_token') ||
				searchParams.get('access_token')
			const refresh_token =
				hashParams.get('refresh_token') ||
				searchParams.get('refresh_token')
			const code = searchParams.get('code')
			const token_hash = searchParams.get('token_hash')
			type EmailOtpType = 'email' | 'recovery' | 'invite' | 'magiclink'
			const qpType = searchParams.get('type')
			const type = (qpType as EmailOtpType) || undefined

			try {
				if (access_token && refresh_token) {
					const { error } = await supabase.auth.setSession({
						access_token,
						refresh_token,
					})
					if (error) throw error
					router.replace(next)
					return
				}

				if (code) {
					const { error } =
						await supabase.auth.exchangeCodeForSession(code)
					if (error) throw error
					router.replace(next)
					return
				}

				if (token_hash && type) {
					const { error } = await supabase.auth.verifyOtp({
						token_hash,
						type,
					})
					if (error) throw error
					router.replace(next)
					return
				}

				// Missing data — go to error page
				router.replace('/auth/error?error=missing-parameters')
			} catch {
				router.replace('/auth/error?error=verification-failed')
			}
		}
		run()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="min-h-[60vh] flex items-center justify-center">
			<p className="text-sm text-muted-foreground">Finalizing sign-in…</p>
		</div>
	)
}
