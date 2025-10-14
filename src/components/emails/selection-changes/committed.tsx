import * as React from 'react'
import {
	Html,
	Head,
	Preview,
	Body,
	Container,
	Section,
	Row,
	Column,
	Text,
	Img,
	Link,
} from '@react-email/components'

type Props = {
	clientId: string
	org_name?: string | null
	previewText?: string
	accountLink?: string
}

const baseUrl = 'https://www.poeontap.com/'

export default function SelectionCommittedEmail({
	clientId,
	org_name,
	previewText = 'POE Selection Change Applied',
	accountLink,
}: Props) {
	return (
		<Html>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<style>{`
					@media only screen and (max-width: 600px) {
						.container { width: 100% !important; }
						.containerInner { padding: 0 16px !important; }
						.col-title, .cta-col { display: block !important; width: 100% !important; }
						.col-title { text-align: center !important; }
						.header-title { font-size: 18px !important; line-height: 28px !important; padding: 12px 8px 4px !important; }
						.logo-left-img { width: 140px !important; height: auto !important; }
						.logo-right-img { width: 55px !important; height: auto !important; }
						.cta-col { padding: 8px 0 !important; }
						.cta-row { padding: 0 12px 12px !important; text-align: center !important; }
						.cta-button { display: flex !important; margin: auto !important; width: 200px !important; padding: 10px 12px !important; font-size: 12px !important; }
						.cta-btn-td { display: block !important; width: 100% !important; padding: 6px 0 !important; }
						.cta-btn-td .cta-button { width: 200px !important; margin: 2px auto !important; }
					}
				`}</style>
				<style>
					{`@import url('https://fonts.googleapis.com/css2?family=Unna:wght@700&display=swap'); *{ font-family: 'Unna', serif; }`}
				</style>
				<style>
					{`@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100..700&display=swap'); *{ font-family: 'Josefin Sans', sans-serif; }`}
				</style>
			</Head>
			<Preview>{previewText}</Preview>
			<Body style={bodyStyle}>
				<Container
					style={containerOuter}
					className="container"
				>
					{/* Top strip */}
					<Section style={topStrip}>
						<Row>
							<Column style={topStripLeft}>
								CLIENT ID: {clientId}
							</Column>
						</Row>
					</Section>
					{/* Header */}
					<Section style={gradientHeader}>
						<Row>
							<Column
								style={logoLeftCol}
								className="col-left"
							>
								<Img
									src={`${baseUrl}logos/poe-white.png`}
									alt="POE Logo"
									width={160}
									height={34}
									style={logoImg}
									className="logo-img logo-left-img"
								/>
							</Column>
							<Column
								style={logoSpacerCol}
								className="col-spacer"
							></Column>
							<Column
								style={logoRightCol}
								className="col-right"
							>
								<Img
									src={`${baseUrl}logos/consulting-white.png`}
									alt="Consulting Logo"
									width={160}
									height={42}
									style={{
										...logoImg,
										marginRight: 0,
										marginLeft: 'auto',
									}}
									className="logo-img logo-right-img"
								/>
							</Column>
						</Row>
						<Row>
							<Column
								style={titleColWrapper}
								className="col-title"
							>
								<Text
									style={centerTitle}
									className="header-title"
								>
									SELECTION CHANGE APPLIED
								</Text>
							</Column>
						</Row>
						<Row>
							<Column style={{ padding: 0 }}>
								<div style={waveWrapper}>
									<div style={waveInner}>
										<div
											dangerouslySetInnerHTML={{
												__html:
													'<!--[if mso]>' +
													'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="line-height:0;height:62px;background:#ffffff;">&nbsp;</td></tr></table>' +
													'<![endif]-->' +
													'<!--[if !mso]><!-->' +
													'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" width="100%" height="36" style="display:block;width:140%;height:36px;"><path fill="#FFFFFF" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"/></svg>' +
													'<!--<![endif]-->',
											}}
										/>
									</div>
								</div>
							</Column>
						</Row>
					</Section>
					<Container
						style={containerInner}
						className="containerInner"
					>
						<Section>
							<Text style={paragraph}>
								Dear {org_name ? `${org_name} ` : ''}Team
								Member,
							</Text>
							<Text style={paragraph}>
								We’re pleased to confirm that your requested
								selection changes have been successfully applied
								to your account.
							</Text>
							<Text style={paragraph}>
								You’ll now start receiving updates and services
								aligned with your updated preferences. If you
								need any further adjustments, please write to{' '}
								<Link
									href={`mailto:info@poeontap.com`}
									style={linkInline}
								>
									info@poeontap.com
								</Link>{' '}
								and we’ll be happy to assist.
							</Text>
						</Section>
						{/* CTAs */}
						<Section className="cta-row">
							<table
								role="presentation"
								cellPadding={0}
								cellSpacing={0}
								border={0}
								align="center"
								style={{ margin: '16px auto 0' }}
							>
								<tbody>
									<tr>
										<td
											className="cta-btn-td"
											style={{
												padding: '14px 8px',
												textAlign: 'center',
											}}
										>
											<Link
												href="https://www.consultingontap.com/contact"
												style={ctaButton}
												target="_blank"
												rel="noopener noreferrer"
												className="cta-button"
											>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={`${baseUrl}logos/lucide/mail-poe.png`}
													alt="Contact Us"
													style={ctaButtonIcon}
												/>
												CONTACT US
											</Link>
										</td>
										<td
											className="cta-btn-td"
											style={{
												padding: '14px 8px',
												textAlign: 'center',
											}}
										>
											<Link
												href={
													accountLink ||
													`https://www.poeontap.com`
												}
												style={ctaButton}
												target="_blank"
												rel="noopener noreferrer"
												className="cta-button"
											>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={`${baseUrl}logos/lucide/user-poe.png`}
													alt="Your Account"
													style={ctaButtonIcon}
												/>
												ACCESS YOUR ACCOUNT
											</Link>
										</td>

										<td
											className="cta-btn-td"
											style={{
												padding: '14px 8px',
												textAlign: 'center',
											}}
										>
											<Link
												href="https://www.consultingontap.com/services"
												style={ctaButton}
												target="_blank"
												rel="noopener noreferrer"
												className="cta-button"
											>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={`${baseUrl}logos/lucide/book-open-text-poe.png`}
													alt="Our Services"
													style={ctaButtonIcon}
												/>
												OUR SERVICES
											</Link>
										</td>
									</tr>
								</tbody>
							</table>
						</Section>
						{/* Footer */}
						<Section style={footerSection}>
							<Text style={footerLead}>
								POE (Time&Place Consulting) Central Office Team:{' '}
								<span
									style={{
										color: '#00334d',
										fontWeight: 600,
									}}
								>
									+32 (0) 485 28 22 21
								</span>
							</Text>
							<Row style={footer}>
								<Column style={footerColLeft}>
									<Img
										src={`${baseUrl}logos/poe-hero-logo-new.png`}
										alt="Time & Place Consulting"
										width={130}
										height={26}
										style={{ display: 'inline-block' }}
										className="logo-img logo-left-img-footer"
									/>
								</Column>
								<Column style={footerColRight}>
									<Img
										src={`${baseUrl}logos/consulting-logo-full.png`}
										alt="Time & Place Consulting"
										width={130}
										height={34}
										style={{ display: 'inline-block' }}
										className="logo-img logo-right-img-footer"
									/>
								</Column>
							</Row>
						</Section>
					</Container>
				</Container>
			</Body>
		</Html>
	)
}

// Styles from account-recap default
const bodyStyle: React.CSSProperties = {
	margin: 0,
	padding: 0,
	backgroundColor: '#ffffff',
	width: '100%',
	fontFamily: 'Josefin Sans, sans-serif',
}
const containerOuter: React.CSSProperties = {
	background:
		'linear-gradient(180deg, rgba(53,75,131,0.2) 0%, rgba(39,51,90,0.2) 100%)',
	maxWidth: '600px',
	width: '100%',
}
const containerInner: React.CSSProperties = { width: '100%', marginTop: '30px' }
const topStrip: React.CSSProperties = {
	backgroundColor: '#354B83',
	color: '#ffffff',
	fontSize: 11,
	fontWeight: 700,
	textTransform: 'uppercase',
	letterSpacing: '0.5px',
	padding: 0,
}
const topStripLeft: React.CSSProperties = {
	padding: '12px 18px',
	textAlign: 'left' as const,
}
const gradientHeader: React.CSSProperties = {
	background: 'linear-gradient(180deg,#354B83 0%, #27335A 100%)',
	color: '#ffffff',
	position: 'relative',
	padding: '11px 0 0',
}
const logoLeftCol: React.CSSProperties = {
	width: '33.33%',
	padding: '4px 4px 0 12px',
	textAlign: 'left' as const,
	verticalAlign: 'top' as const,
}
const logoSpacerCol: React.CSSProperties = {
	width: '33.33%',
	padding: 0,
	fontSize: 0,
	lineHeight: 0,
}
const logoRightCol: React.CSSProperties = {
	width: '33.33%',
	padding: '4px 12px 0 4px',
	textAlign: 'right' as const,
	verticalAlign: 'top' as const,
}
const titleColWrapper: React.CSSProperties = {
	width: '100%',
	textAlign: 'center' as const,
	padding: '14px 6px 0',
}
const logoImg: React.CSSProperties = { display: 'block', maxWidth: '100%' }
const centerTitle: React.CSSProperties = {
	fontSize: 20,
	lineHeight: '26px',
	fontWeight: 800,
	letterSpacing: '.5px',
	color: '#fff',
	margin: '20px 0 0',
}
const waveWrapper: React.CSSProperties = {
	position: 'relative',
	height: '62px',
	lineHeight: 0,
	overflow: 'hidden',
	width: '100%',
}
const waveInner: React.CSSProperties = {
	position: 'absolute',
	bottom: 0,
	left: 0,
	width: '100%',
	lineHeight: 0,
	transform: 'rotate(180deg)',
}
const paragraph: React.CSSProperties = {
	fontSize: 14,
	lineHeight: '20px',
	color: '#27335a',
}
const linkInline: React.CSSProperties = {
	color: '#00334d',
	textDecoration: 'underline',
}
const ctaButton: React.CSSProperties = {
	fontSize: 10,
	lineHeight: '18px',
	display: 'inline-flex',
	fontWeight: 700,
	color: '#ffffff',
	textDecoration: 'none',
	alignItems: 'center',
	justifyContent: 'center',
	width: 'auto',
	gap: '6px',
	padding: '8px 10px',
	textTransform: 'uppercase',
	backgroundColor: '#27335A',
}
const ctaButtonIcon: React.CSSProperties = {
	width: '16px',
	height: '16px',
	marginRight: '4px',
	color: '#ffffff',
}
const footerSection: React.CSSProperties = {
	fontSize: 11,
	color: '#666666',
	padding: '20px 34px 28px',
	textAlign: 'center' as const,
}
const footerLead: React.CSSProperties = {
	fontStyle: 'italic',
	paddingBottom: 14,
	margin: 0,
}
const footerColLeft: React.CSSProperties = {
	textAlign: 'left' as const,
	width: '50%',
	paddingTop: 8,
}
const footerColRight: React.CSSProperties = {
	textAlign: 'right' as const,
	width: '50%',
	paddingTop: 8,
}
const footer: React.CSSProperties = { marginTop: 30 }
