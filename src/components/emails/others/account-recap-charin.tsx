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

const baseUrl = 'https://www.poeontap.com/'

const AccountRecapEmailCharin = ({
	data,
	total,
	id,
	previewText = 'Your Account Recap from CharIN by POE',
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
						.logo-right-img { width: 110px !important; height: auto !important; }
						.cta-col { padding: 8px 0 !important; }
						.cta-row { padding: 0 12px 12px !important; text-align: center !important; }
						.cta-button { display: flex !important; margin: auto !important; width: 220px !important; padding: 10px 12px !important; font-size: 12px !important; }
						.stack-on-mobile { display: block !important; width: 100% !important; }
					}
				`}</style>
				<style>{`
					@import url('https://fonts.googleapis.com/css2?family=Unna:wght@700&display=swap');
					* { font-family: 'Unna', serif; }
				`}</style>
				<style>{`
					@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100..700&display=swap');
					* { font-family: 'Josefin Sans', sans-serif; }
				`}</style>
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

					{/* Gradient header */}
					<Section style={gradientHeader}>
						<Row>
							<Column style={logoLeftCol}>
								<Img
									src={`${baseUrl}logos/poe-white.png`}
									alt="POE Logo"
									width={160}
									height={34}
									style={logoImg}
									className="logo-left-img"
								/>
							</Column>
							<Column style={logoSpacerCol}></Column>
							<Column style={logoRightCol}>
								<Img
									src={`${baseUrl}logos/charin.png`}
									alt="CharIN Logo"
									width={160}
									height={42}
									style={{
										...logoImg,
										marginRight: 0,
										marginLeft: 'auto',
									}}
									className="logo-right-img"
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
								<Column className="cta-col">
									<Link
										href={`${baseUrl}confirm-account/${id}`}
										style={ctaButton}
									>
										Confirm Account
									</Link>
								</Column>
							</Row>
						</Section>

						<Hr style={divider} />

						{/* Items */}
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
									const items = data[
										key as keyof AccountRecapType
									] as PricedGeographicItem[]
									if (items.length > 0) {
										return (
											<div key={index}>
												{index > 0 && (
													<Hr style={divider} />
												)}
												<Text style={fieldTitle}>
													{key == 'deployment'
														? 'Grants Deployment'
														: key == 'project'
															? 'Grants Innovative Projects'
															: (category?.label as string)}
												</Text>
												<ul style={ulStyle}>
													{items.map(
														(
															item: PricedGeographicItem,
															i
														) => (
															<li
																key={i}
																style={liRow}
															>
																<span>
																	{removeParenthesesContent(
																		item.label
																	)}{' '}
																	{item.geographies &&
																		item
																			.geographies
																			.length >
																			0 && (
																			<>
																				(
																				{item.geographies
																					.map(
																						(
																							g
																						) =>
																							g.label
																					)
																					.join(
																						', '
																					)}

																				)
																			</>
																		)}
																</span>
																{typeof item.price !==
																	'undefined' && (
																	<span
																		style={
																			nowrap
																		}
																	>
																		€{' '}
																		{
																			item.price
																		}{' '}
																		/ year
																	</span>
																)}
															</li>
														)
													)}
												</ul>
											</div>
										)
									}
								} else {
									const items = data[
										key as keyof AccountRecapType
									] as { label: string }[]
									if (items.length > 0) {
										return (
											<div key={index}>
												<Hr style={dividerThin} />
												<Text style={fieldSubTitle}>
													Type of Contract
												</Text>
												<ul style={ulStyle}>
													{items.map((item, i) => (
														<li
															key={i}
															style={liRow}
														>
															{item.label}
														</li>
													))}
												</ul>
											</div>
										)
									}
								}
								return null
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

						{/* Footer */}
						<Hr style={dividerThin} />
						<Section>
							<Text style={paragraph}>
								<strong>
									For additional questions or support, please
									contact:{' '}
								</strong>
								<Link href="mailto:info@poeontap.com">
									info@poeontap.com
								</Link>
							</Text>
							<Text style={paragraph}>
								You can find information on the full list of
								support services we provide{' '}
								<Link
									href="https://www.charin.global"
									style={{ textDecorationLine: 'underline' }}
								>
									here
								</Link>
								.
							</Text>
						</Section>
					</Container>
				</Container>
			</Body>
		</Html>
	)
}

export default AccountRecapEmailCharin

// Styles
const bodyStyle: React.CSSProperties = {
	backgroundColor: '#f5f7fb',
	color: '#27335a',
	margin: 0,
	padding: 0,
}

const containerOuter: React.CSSProperties = {
	width: '640px',
	margin: '0 auto',
	backgroundColor: '#ffffff',
	borderRadius: 8,
	overflow: 'hidden',
	boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
}

const containerInner: React.CSSProperties = {
	padding: '20px 24px 28px',
}

const topStrip: React.CSSProperties = {
	backgroundColor: '#27335a',
	color: '#ffffff',
	fontSize: 12,
	padding: '6px 12px',
}

const topStripLeft: React.CSSProperties = {
	textAlign: 'left',
}

const gradientHeader: React.CSSProperties = {
	background: 'linear-gradient(90deg, #c4002b, #27335a)',
	color: '#ffffff',
	padding: '12px 16px 0',
}

const logoLeftCol: React.CSSProperties = { padding: '6px 8px' }
const logoRightCol: React.CSSProperties = { padding: '6px 8px' }
const logoSpacerCol: React.CSSProperties = { width: 10 }

const logoImg: React.CSSProperties = {
	display: 'block',
}

const titleColWrapper: React.CSSProperties = {
	padding: '6px 8px 0',
}

const centerTitle: React.CSSProperties = {
	textAlign: 'center',
	fontSize: 22,
	fontWeight: 700,
	letterSpacing: 0.6,
	margin: '6px 0 0',
	color: '#ffffff',
}

const waveWrapper: React.CSSProperties = {
	width: '100%',
}
const waveInner: React.CSSProperties = {
	width: '100%',
	marginTop: 4,
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

const fieldSubTitle: React.CSSProperties = {
	fontSize: 14,
	fontWeight: 600,
	marginTop: 8,
}

const divider: React.CSSProperties = {
	borderColor: '#e5e7eb',
	margin: '16px 0',
}
const dividerThin: React.CSSProperties = {
	borderColor: '#eef0f4',
	margin: '10px 0',
}

const ulStyle: React.CSSProperties = { paddingLeft: 16, margin: '8px 0' }
const liRow: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	gap: 8,
}
const nowrap: React.CSSProperties = { whiteSpace: 'nowrap' }

const ctaButton: React.CSSProperties = {
	backgroundColor: '#c4002b',
	color: '#ffffff',
	textDecoration: 'none',
	padding: '10px 16px',
	borderRadius: 6,
	fontWeight: 600,
	display: 'inline-block',
}

const totalLabel: React.CSSProperties = {
	fontSize: 22,
	fontWeight: 700,
	color: '#27335a',
}
