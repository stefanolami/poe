import { type EmailOtpType } from '@supabase/supabase-js'
//import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/supabase/server'

/* export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const token_hash = searchParams.get('token_hash')
	const type = searchParams.get('type') as EmailOtpType | null
	const next = searchParams.get('next') ?? '/'
	const redirectTo = request.nextUrl.clone()
	redirectTo.pathname = next

	if (token_hash && type) {
		const supabase = await createClient()

		console.log(
			'Verifying OTP with token_hash:',
			token_hash,
			'and type:',
			type
		)

		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		})
		if (!error) {
			console.log('OTP verified successfully')

			return NextResponse.redirect(
				'http://localhost:3000/update-password'
			)
		}
	}

	// return the user to an error page with some instructions
	console.log('OTP verification failed, redirecting to error page')
	redirectTo.pathname = '/auth/auth-code-error'
	return NextResponse.redirect(redirectTo)
} */

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const token_hash = searchParams.get('token_hash')
		const type = searchParams.get('type') as EmailOtpType | null

		if (!token_hash || !type) {
			console.log('Missing token_hash or type parameters')
			return NextResponse.redirect(
				new URL('/auth/error?error=missing-parameters', request.url)
			)
		}

		const supabase = await createClient()

		console.log(
			'Verifying OTP with token_hash:',
			token_hash,
			'and type:',
			type
		)

		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		})

		if (error) {
			console.log('OTP verification failed:', error?.message)
			return NextResponse.redirect(
				new URL('/auth/error?error=verification-failed', request.url)
			)
		}

		console.log('OTP verified successfully')
		return NextResponse.redirect(new URL('/update-password', request.url))
	} catch (error) {
		console.error('Error in auth confirmation:', error)
		return NextResponse.redirect(
			new URL('/auth/error?error=unexpected-error', request.url)
		)
	}
}
