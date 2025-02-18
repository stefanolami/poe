import * as React from 'react'
import { Html, Button } from '@react-email/components'

export function Email1(props) {
	const { text } = props

	return (
		<Html lang="en">
			<div
				style={{
					backgroundColor: '#333',
					padding: '2rem',
				}}
			>
				<h1
					style={{
						color: '#fff',
						fontSize: '2rem',
						padding: '1rem',
					}}
				>
					{text}
				</h1>
			</div>
		</Html>
	)
}

export default Email1
