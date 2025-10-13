import * as React from 'react'
import { Html, Body, Heading, Text } from '@react-email/components'

export default function SelectionCommittedEmail({
	clientId,
}: {
	clientId: string
}) {
	return (
		<Html>
			<Body>
				<Heading>Selection change committed</Heading>
				<Text>Client: {clientId}</Text>
				<Text>Your selection change has been applied.</Text>
			</Body>
		</Html>
	)
}
