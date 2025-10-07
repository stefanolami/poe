import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const code = searchParams.get('code')
		const token_hash = searchParams.get('token_hash')
		const type = searchParams.get('type') as EmailOtpType | null

		const supabase = await createClient()

		// Preferred modern flow: code exchange
		if (code) {
			const { error } = await supabase.auth.exchangeCodeForSession(code)
			if (error) {
				return NextResponse.redirect(
					new URL(
						'/auth/error?error=verification-failed',
						request.url
					)
				)
			}
			return NextResponse.redirect(new URL('/account', request.url))
		}

		// Legacy OTP flow: token_hash + type
		if (token_hash && type) {
			const { error } = await supabase.auth.verifyOtp({
				type,
				token_hash,
			})
			if (error) {
				return NextResponse.redirect(
					new URL(
						'/auth/error?error=verification-failed',
						request.url
					)
				)
			}
			return NextResponse.redirect(new URL('/account', request.url))
		}

		return NextResponse.redirect(
			new URL('/auth/error?error=missing-parameters', request.url)
		)
	} catch {
		return NextResponse.redirect(
			new URL('/auth/error?error=unexpected-error', request.url)
		)
	}
}
