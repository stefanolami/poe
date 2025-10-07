import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const code = searchParams.get('code')
		const access_token = searchParams.get('access_token')
		const refresh_token = searchParams.get('refresh_token')
		const token_hash = searchParams.get('token_hash')
		const type = searchParams.get('type') as EmailOtpType | null

		const supabase = await createClient()

		// Preferred modern flow: code exchange
		if (code) {
			const { error } = await supabase.auth.exchangeCodeForSession(code)
			if (error) {
				const err = new URL('/auth/error', request.url)
				err.searchParams.set('error', 'verification-failed')
				err.searchParams.set('src', 'code')
				return NextResponse.redirect(err)
			}
			return NextResponse.redirect(new URL('/account', request.url))
		}

		// Legacy token style: explicit tokens present
		if (access_token && refresh_token) {
			const { error } = await supabase.auth.setSession({
				access_token,
				refresh_token,
			})
			if (error) {
				const err = new URL('/auth/error', request.url)
				err.searchParams.set('error', 'verification-failed')
				err.searchParams.set('src', 'tokens')
				return NextResponse.redirect(err)
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
				const err = new URL('/auth/error', request.url)
				err.searchParams.set('error', 'verification-failed')
				err.searchParams.set('src', 'otp')
				return NextResponse.redirect(err)
			}
			return NextResponse.redirect(new URL('/account', request.url))
		}

		const err = new URL('/auth/error', request.url)
		err.searchParams.set('error', 'missing-parameters')
		if (code) err.searchParams.set('hasCode', '1')
		if (token_hash) err.searchParams.set('hasToken', '1')
		if (access_token) err.searchParams.set('hasAT', '1')
		if (refresh_token) err.searchParams.set('hasRT', '1')
		return NextResponse.redirect(err)
	} catch {
		return NextResponse.redirect(
			new URL('/auth/error?error=unexpected-error', request.url)
		)
	}
}
