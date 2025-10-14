import * as React from 'react'
import {
	Html,
	Head,
	Preview,
	Body,
	Container,
	Section,
	Text,
} from '@react-email/components'

export default function PendingReminderEmail({
	clientId,
	days,
}: {
	clientId: string
	days: number
}) {
	return (
		<Html>
			<Head />
			<Preview>POE Payment Reminder</Preview>
			<Body
				style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}
			>
				<Container
					style={{
						maxWidth: '600px',
						margin: '0 auto',
						padding: '24px',
					}}
				>
					<Section>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 700,
								marginBottom: 8,
							}}
						>
							Payment Reminder
						</Text>
						<Text style={{ fontSize: 14, lineHeight: '20px' }}>
							This is a reminder that your account is pending
							payment. Please complete payment within {days} days
							to avoid the account being frozen.
						</Text>
						<Text
							style={{
								fontSize: 12,
								color: '#666',
								marginTop: 16,
							}}
						>
							Client ID: {clientId}
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}
