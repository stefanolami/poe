'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function parseHash(hash: string) {
	const h = hash.startsWith('#') ? hash.slice(1) : hash
	return new URLSearchParams(h)
}

export default function HashErrorListener() {
	const router = useRouter()

	useEffect(() => {
		if (typeof window === 'undefined') return
		const { hash } = window.location
		if (!hash || hash.length <= 1) return
		const params = parseHash(hash)
		const err = params.get('error')
		if (!err) return

		const error_code = params.get('error_code') || undefined
		const error_description = params.get('error_description') || undefined

		// Map to our error route codes
		// otp_expired/access_denied -> verification-failed
		const mapped =
			error_code === 'otp_expired' || err === 'access_denied'
				? 'verification-failed'
				: 'unexpected-error'

		const url = new URL('/auth/error', window.location.origin)
		url.searchParams.set('error', mapped)
		if (error_code) url.searchParams.set('code', error_code)
		if (error_description) url.searchParams.set('desc', error_description)

		// Replace so the hash doesn't stick around in history
		router.replace(url.toString())
	}, [router])

	return null
}
