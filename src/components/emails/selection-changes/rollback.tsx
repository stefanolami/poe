import * as React from 'react'
import { Html, Body, Heading, Text } from '@react-email/components'

export default function SelectionRollbackEmail({
	clientId,
}: {
	clientId: string
}) {
	return (
		<Html>
			<Body>
				<Heading>Selection change rolled back</Heading>
				<Text>Client: {clientId}</Text>
				<Text>
					Your pending selection change expired and has been rolled
					back.
				</Text>
			</Body>
		</Html>
	)
}
