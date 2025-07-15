import React from 'react'
import { BarLoader } from './loading'

const LoadingOverlay = () => {
	return (
		<div className="fixed h-full flex items-center justify-center inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
			<BarLoader />
		</div>
	)
}

export default LoadingOverlay
