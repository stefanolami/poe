import * as React from 'react'
import { Html, Body, Heading, Text } from '@react-email/components'

export default function SelectionReminderEmail({
	clientId,
	days,
}: {
	clientId: string
	days: number
}) {
	return (
		<Html>
			<Body>
				<Heading>Reminder</Heading>
				<Text>Client: {clientId}</Text>
				<Text>{days} days left to complete your selection change.</Text>
			</Body>
		</Html>
	)
}
