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

export default function FreezeNoticeEmail({ clientId }: { clientId: string }) {
	return (
		<Html>
			<Head />
			<Preview>POE Account Frozen</Preview>
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
							Account Frozen
						</Text>
						<Text style={{ fontSize: 14, lineHeight: '20px' }}>
							Your account has been frozen due to non-payment.
							Please contact our team to reactivate your account.
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
