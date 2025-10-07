// app/(app)/(auth)/auth/error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
	const searchParams = useSearchParams()
	const error = searchParams.get('error')

	const getErrorDetails = (errorCode: string | null) => {
		switch (errorCode) {
			case 'verification-failed':
				return {
					title: 'Verification Failed',
					message:
						'The verification link is invalid or has expired. Please request a new password reset.',
					action: 'Try Again',
					actionLink: '/forgot-password',
				}
			case 'missing-parameters':
				return {
					title: 'Invalid Link',
					message:
						'The verification link appears to be incomplete or corrupted. Please access your account manually from the link below.',
					action: 'Login',
					actionLink: '/login',
				}
			case 'missing-code':
				return {
					title: 'Missing Verification Code',
					message:
						'No verification code was found in the link. Please check your email and use the complete link.',
					action: 'Request New Link',
					actionLink: '/forgot-password',
				}
			case 'invalid-reset-link':
				return {
					title: 'Invalid Reset Link',
					message:
						'This password reset link is invalid or has already been used. Please request a new one.',
					action: 'Reset Password',
					actionLink: '/forgot-password',
				}
			case 'reset-failed':
				return {
					title: 'Reset Failed',
					message:
						'There was an error processing your password reset. Please try again.',
					action: 'Try Again',
					actionLink: '/forgot-password',
				}
			case 'session-expired':
				return {
					title: 'Session Expired',
					message:
						'Your session has expired. Please log in again to continue.',
					action: 'Log In',
					actionLink: '/login',
				}
			case 'unauthorized':
				return {
					title: 'Unauthorized Access',
					message:
						'You are not authorized to access this resource. Please log in with the correct credentials.',
					action: 'Log In',
					actionLink: '/login',
				}
			case 'unexpected-error':
				return {
					title: 'Something Went Wrong',
					message:
						'An unexpected error occurred. Please try again or contact support if the problem persists.',
					action: 'Try Again',
					actionLink: '/login',
				}
			default:
				return {
					title: 'Authentication Error',
					message:
						'An authentication error occurred. Please try logging in again.',
					action: 'Log In',
					actionLink: '/login',
				}
		}
	}

	const errorDetails = getErrorDetails(error)

	return (
		<div className="max-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100">
						<AlertCircle className="h-10 w-10 text-red-600" />
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						{errorDetails.title}
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						{errorDetails.message}
					</p>
					{error && (
						<p className="mt-1 text-xs text-gray-400">
							Error code: {error}
						</p>
					)}
				</div>

				<div className="space-y-4">
					<Button
						asChild
						className="w-full text-white"
					>
						<Link href={errorDetails.actionLink}>
							<RefreshCw className="h-4 w-4 mr-2" />
							{errorDetails.action}
						</Link>
					</Button>

					<Button
						variant="outline"
						asChild
						className="w-full"
					>
						<Link href="/">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Home
						</Link>
					</Button>

					<div className="text-center">
						<Link
							href="/login"
							className="text-sm text-primary hover:text-primary/80 underline"
						>
							Or go to login page
						</Link>
					</div>
				</div>

				<div className="text-center">
					<p className="text-xs text-gray-500">
						Need help?{' '}
						<Link
							href="/contact"
							className="text-primary hover:text-primary/80 underline"
						>
							Contact Support
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
