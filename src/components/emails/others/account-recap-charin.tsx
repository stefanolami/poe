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
	Hr,
} from '@react-email/components'
import { selectionData } from '@/data/data'
import { AccountRecapType, PricedGeographicItem } from '@/lib/types'
import { removeParenthesesContent } from '@/lib/utils'

type Props = {
	data: AccountRecapType
	total: number
	id: string
	previewText?: string
}

const baseUrl = 'https://www.poeontap-charin.com/'

const AccountRecapEmail = ({
	data,
	total,
	id,
	previewText = 'Your Account Recap from POE',
}: Props) => {
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
						.logo-left-img-footer { width: 110px !important; height: auto !important; }
						.logo-right-img-footer { width: 110px !important; height: auto !important; }
						.cta-col { padding: 8px 0 !important; }
						.cta-row { padding: 0 12px 12px !important; text-align: center !important; }
						.cta-button { display: flex !important; margin: auto !important; width: 200px !important; padding: 10px 12px !important; font-size: 12px !important; }
						/* Stack CTA cells vertically on mobile */
						.cta-btn-td { display: block !important; width: 100% !important; padding: 6px 0 !important; }
						.cta-btn-td .cta-button { width: 200px !important; margin: 2px auto !important; }
						.stack-on-mobile { display: block !important; width: 100% !important; }
								/* Stack data tables on mobile only */
								.responsive-table thead { display: none !important; }
								.responsive-table tr { display: block !important; margin-bottom: 10px !important; }
								.responsive-table td, .responsive-table th { display: block !important; width: 100% !important; box-sizing: border-box !important; }
					}
				`}</style>
				<style>
					{`
			@import url('https://fonts.googleapis.com/css2?family=Unna:wght@700&display=swap');
			*{
			font-family: 'Unna', serif;
			}`}
				</style>
				<style>
					{`
			@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100..700&display=swap');
			*{
			font-family: 'Josefin Sans', sans-serif;
			}`}
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
								CLIENT ID: {id}
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
									src={`${baseUrl}logos/charin-logo.png`}
									alt="Charin Logo"
									width={77}
									height={60}
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
									ACCOUNT RECAP
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
						{/* Greeting and CTA */}
						<Section>
							<Text style={paragraph}>Hello!</Text>
							<Text style={paragraph}>
								Here is a summary of your selection. Click the
								button below to confirm it and create your
								account.
							</Text>
							<Row className="cta-row">
								<Column
									className="cta-col"
									align="center"
									style={{ textAlign: 'center' }}
								>
									<Link
										href={`${baseUrl}confirm-account/${id}`}
										style={ctaButtonTop}
									>
										Confirm Account
									</Link>
								</Column>
							</Row>
						</Section>

						<Section>
							{Object.keys(data).map((key, index) => {
								if (
									key !== 'typeOfVehicleContract' &&
									key !== 'chargingStationsContract'
								) {
									const category =
										selectionData.eMobility[
											key as keyof typeof selectionData.eMobility
										]
									if (
										data[key as keyof AccountRecapType]
											.length > 0
									) {
										return (
											<>
												{index > 0 && (
													<Hr style={divider} />
												)}
												<div key={index}>
													<Text style={fieldTitle}>
														{key == 'deployment'
															? 'Grants Deployment'
															: key == 'project'
																? 'Grants Innovative Projects'
																: category.label}
													</Text>
													<ul style={list}>
														{data[
															key as keyof AccountRecapType
														].map((item, index) => (
															<li key={index}>
																<div
																	style={
																		listItemDiv
																	}
																>
																	<Text
																		style={{
																			marginRight:
																				'20px',
																		}}
																	>
																		{removeParenthesesContent(
																			item.label
																		)}{' '}
																		(
																		{(
																			item as PricedGeographicItem
																		).geographies
																			?.map(
																				(
																					geo
																				) =>
																					geo.label
																			)
																			.join(
																				', '
																			)}
																		)
																	</Text>
																	<Text
																		style={{
																			marginLeft:
																				'auto',
																			whiteSpace:
																				'nowrap',
																		}}
																	>
																		€{' '}
																		{
																			(
																				item as PricedGeographicItem
																			)
																				.price
																		}{' '}
																		/ year
																	</Text>
																</div>
															</li>
														))}
													</ul>
												</div>
											</>
										)
									}
								} else if (
									key === 'typeOfVehicleContract' ||
									key === 'chargingStationsContract'
								) {
									if (
										data[key as keyof AccountRecapType]
											.length > 0
									) {
										return (
											<>
												<Hr style={dividerThin} />
												<div key={index}>
													<Text>
														Type of Contract
													</Text>
													<ul>
														{data[
															key as keyof AccountRecapType
														].map((item, index) => (
															<li
																key={index}
																style={
																	listItemContract
																}
															>
																<Text>
																	{item.label}
																</Text>
															</li>
														))}
													</ul>
												</div>
											</>
										)
									}
								}
							})}
						</Section>

						<Hr style={divider} />

						{/* Total */}
						<Section>
							<Row>
								<Column>
									<Text style={totalLabel}>TOTAL</Text>
								</Column>
								<Column>
									<Text
										style={{
											...totalLabel,
											textAlign: 'right',
										}}
									>
										€ {total} / year
									</Text>
								</Column>
							</Row>
						</Section>

						<Section
							/* style={ctaRow} */
							className="cta-row"
						>
							{/* Centered inner table so buttons sit together in the middle on desktop */}
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
										></td>
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
						{/* Footer (same as grants-email) */}
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

						{/* Footer */}
					</Container>
				</Container>
			</Body>
		</Html>
	)
}

export default AccountRecapEmail

// Styles (reused from opportunities layout)
const bodyStyle: React.CSSProperties = {
	margin: 0,
	padding: 0,
	backgroundColor: '#ffffff',
	width: '100%',
	fontFamily: 'Josefin Sans, sans-serif',
}
const containerOuter: React.CSSProperties = {
	background:
		'linear-gradient(180deg, rgba(170,210,120,0.12) 0%, rgba(0,55,75,0.12) 100%)',
	maxWidth: '600px',
	width: '100%',
}

const containerInner: React.CSSProperties = {
	width: '100%',
	marginTop: '30px',
}
const topStrip: React.CSSProperties = {
	backgroundColor: '#00334d',
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
	background: 'linear-gradient(180deg,#00374B 0%,#6AA5B9 55%,#AAD278 100%)',
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
	padding: '0',
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
	color: '#00334d',
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

const fieldTitle: React.CSSProperties = {
	fontSize: 16,
	fontWeight: 600,
	marginTop: 8,
}

const divider: React.CSSProperties = {
	border: 'none',
	borderTop: '1px solid #00374B',
	height: 0,
	width: '80%',
	display: 'block',
	margin: '12px auto 40px',
}
const dividerThin: React.CSSProperties = {
	border: 'none',
	borderTop: '1px solid #00374B',
	height: 0,
	width: '50%',
	display: 'block',
	margin: '12px auto 40px',
}

const list: React.CSSProperties = {
	listStyleType: 'disc',
}

const listItemContract: React.CSSProperties = {
	margin: '8px 0',
}

const listItemDiv: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'start',
	flexDirection: 'row',
}

const totalLabel: React.CSSProperties = {
	fontSize: 22,
	fontWeight: 700,
	color: '#27335a',
}

const ctaButton: React.CSSProperties = {
	fontSize: 12,
	lineHeight: '18px',
	display: 'inline-flex',
	fontWeight: 700,
	color: '#ffffff',
	textDecoration: 'none',
	alignItems: 'center',
	justifyContent: 'center',
	width: 'auto',
	gap: '6px',
	padding: '8px 14px',
	textTransform: 'uppercase',
	backgroundColor: '#AAD278',
}
const ctaButtonTop: React.CSSProperties = {
	fontSize: 12,
	lineHeight: '18px',
	display: 'inline-flex',
	fontWeight: 700,
	color: '#ffffff',
	textDecoration: 'none',
	alignItems: 'center',
	justifyContent: 'center',
	width: 'auto',
	gap: '6px',
	padding: '8px 14px',
	textTransform: 'uppercase',
	backgroundColor: '#00334d',
	margin: '0 auto 20px',
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
