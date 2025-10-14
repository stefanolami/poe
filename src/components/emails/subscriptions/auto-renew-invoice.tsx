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

export default function AutoRenewInvoiceEmail({
	clientId,
	subscriptionId,
}: {
	clientId: string
	subscriptionId: string
}) {
	return (
		<Html>
			<Head />
			<Preview>POE Subscription Renewal - Action Needed</Preview>
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
							Subscription Renewal Pending
						</Text>
						<Text style={{ fontSize: 14, lineHeight: '20px' }}>
							Your subscription has reached its end. Your account
							is now pending for up to 14 days while we await
							payment. Please complete your payment to keep your
							access active.
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
						<Text style={{ fontSize: 12, color: '#666' }}>
							Previous Subscription: {subscriptionId}
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}
