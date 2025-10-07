import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const token_hash = searchParams.get('token_hash')
		const type = searchParams.get('type') as EmailOtpType | null

		if (!token_hash || !type) {
			return NextResponse.redirect(
				new URL('/auth/error?error=missing-parameters', request.url)
			)
		}

		const supabase = await createClient()
		const { error } = await supabase.auth.verifyOtp({ type, token_hash })

		if (error) {
			return NextResponse.redirect(
				new URL('/auth/error?error=verification-failed', request.url)
			)
		}

		// On success, redirect to the account dashboard (session cookies now set)
		return NextResponse.redirect(new URL('/account', request.url))
	} catch {
		return NextResponse.redirect(
			new URL('/auth/error?error=unexpected-error', request.url)
		)
	}
}
