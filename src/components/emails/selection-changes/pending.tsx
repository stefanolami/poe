import * as React from 'react'
import { Html, Body, Heading, Text } from '@react-email/components'

export default function SelectionPendingEmail({
	clientId,
	priceCents,
}: {
	clientId: string
	priceCents: number
}) {
	return (
		<Html>
			<Body>
				<Heading>Selection change pending</Heading>
				<Text>Client: {clientId}</Text>
				<Text>Amount due: €{(priceCents / 100).toFixed(2)}</Text>
			</Body>
		</Html>
	)
}
