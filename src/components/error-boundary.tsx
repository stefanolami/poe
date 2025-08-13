'use client'
import React from 'react'

export class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean; message?: string }
> {
	//eslint-disable-next-line
	constructor(props: any) {
		super(props)
		this.state = { hasError: false, message: undefined }
	}
	static getDerivedStateFromError(error: Error) {
		return { hasError: true, message: error.message }
	}
	//eslint-disable-next-line
	componentDidCatch(error: Error, info: any) {
		console.error('Account page error:', error, info)
	}
	render() {
		if (this.state.hasError) {
			return (
				<div className="p-6 text-red-500 text-sm">
					<p>Something went wrong loading this section.</p>
					<p className="mt-2 opacity-70 break-all">
						{this.state.message}
					</p>
				</div>
			)
		}
		return this.props.children
	}
}
