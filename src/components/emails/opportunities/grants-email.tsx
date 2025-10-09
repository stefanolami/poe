import * as React from 'react'
import { FormattedGrantType } from '@/lib/types'
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

// Local props for this email template to mirror tenders layout
type DeadlineTuple = [string, string, string]
type FurtherDetailsTuple = [string, string, string]

type GrantsEmailCharinProps = {
	grant: FormattedGrantType
	previewText?: string
	// Client metadata (optional for backward compatibility)
	clientId?: string
	org_name?: string | null
	// Optional: direct magic-link for account access
	accountLink?: string
	// Optional tailored extras (mirrors tender template behavior)
	assessment?: {
		relevance?: string | null
		next_steps?: string | null
	} | null
}

const baseUrl = 'https://www.poeontap.com/'

const GrantsEmail = ({
	grant,
	previewText = 'Grant Alert from POE',
	clientId,
	org_name,
	accountLink,
	assessment,
}: GrantsEmailCharinProps) => {
	const {
		geography,
		call_title,
		programme_title,
		alert_purpose,
		programme_purpose,
		instrument_type,
		awarding_authority,
		geography_details,
		deadline,
		in_brief,
		value,
		further_details,
	} = grant

	const geoText = geography.join(', ')
	const deadlineRows: DeadlineTuple[] = (deadline ?? []).map((d) => {
		const [dateIso = '', time = '', note = ''] = d.split('///')
		return [dateIso, time, note]
	})
	const furtherRows: FurtherDetailsTuple[] = (further_details ?? []).map(
		(fd) => {
			const [dateStr = '', url = '', comment = ''] = fd.split('///')
			return [dateStr, url, comment]
		}
	)

	return (
		<Html>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<style>
					{`
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
				`}
				</style>
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
								CLIENT ID: {clientId || ''}
							</Column>
						</Row>
					</Section>

					{/* Gradient header */}
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
									alt="Charin Logo"
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
									GRANT ALERT
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
						{/* 1. Greeting and intro */}
						<Section>
							<Text style={paragraph}>
								Dear {org_name} Team Member,
							</Text>
							<Text style={paragraph}>
								Please find here an update alert regarding a
								published opportunity.
								<br />
								The following has been amended in the call.
							</Text>
						</Section>
						<Hr style={divider} />

						{/* 2. Key information fields */}
						<Section>
							{renderField('Geography(-ies):', geoText)}
							{renderField(
								'Geography Details:',
								geography_details || undefined
							)}
							{renderField(
								'Call Title:',
								call_title || undefined
							)}
							{renderField(
								'Awarding Authority:',
								awarding_authority || undefined
							)}
							{renderField('Value:', value || undefined)}
							{renderField(
								'Programme Title:',
								programme_title || undefined
							)}
							{renderField(
								'Programme Purpose:',
								programme_purpose || undefined
							)}
							{renderField(
								'Instrument Type:',
								instrument_type || undefined
							)}
							{renderField(
								'POE Alert Purpose:',
								alert_purpose || undefined
							)}
						</Section>
						<Hr style={divider} />

						{/* 3. Deadlines table */}

						{deadline && deadline.length > 0 && (
							<>
								<Section style={{ marginBottom: '30px' }}>
									<Text style={fieldLabel}>Deadline</Text>
									<table
										width="100%"
										cellPadding={0}
										cellSpacing={0}
										style={tableBase}
										className="responsive-table"
									>
										<tbody>
											{deadlineRows.map((d, i) => {
												const [dateIso, time, note] = d
												const dateStr = dateIso
													? new Date(
															dateIso
														).toLocaleDateString(
															'en-GB',
															{
																day: '2-digit',
																month: 'short',
																year: 'numeric',
															}
														)
													: ''
												return (
													<tr key={i}>
														<td style={tdCell}>
															{note}
														</td>
														<td style={tdCell}>
															{dateStr}
														</td>
														<td style={tdCell}>
															{time}
														</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								</Section>
								<Hr style={divider} />
							</>
						)}

						{/* 4. In brief */}
						<Section>
							<Text style={fieldLabel}>In Brief</Text>
							<Text style={paragraph}>{in_brief}</Text>
							{assessment ? (
								<>
									<Text style={fieldLabel}>Relevance</Text>
									{assessment.relevance ? (
										<Text style={paragraph}>
											{assessment.relevance}
										</Text>
									) : (
										<Text style={paragraph}>
											No tailored relevance provided.
										</Text>
									)}
									<Text style={fieldLabel}>Next Steps</Text>
									{assessment.next_steps ? (
										<Text style={paragraph}>
											{assessment.next_steps}
										</Text>
									) : (
										<Text style={paragraph}>
											No tailored next steps provided.
										</Text>
									)}
								</>
							) : null}
						</Section>
						<Hr style={divider} />

						{/* 6. Links / Documents / Further Details */}
						{further_details && further_details.length > 0 ? (
							<>
								<Section style={{ marginBottom: '30px' }}>
									<Text style={fieldLabel}>
										Further Details
									</Text>
									<table
										width="100%"
										cellPadding={0}
										cellSpacing={0}
										style={tableBase}
										className="responsive-table"
									>
										<tbody>
											{furtherRows.map((row, idx) => {
												const [dateStr, url, comment] =
													row
												const dateFormatted = dateStr
													? new Date(
															dateStr
														).toLocaleDateString(
															'en-GB',
															{
																day: '2-digit',
																month: 'short',
																year: 'numeric',
															}
														)
													: ''
												return (
													<tr key={idx}>
														<td style={tdCell}>
															{dateFormatted}
														</td>
														<td style={linkCell}>
															<Link
																href={url}
																style={
																	linkInline
																}
															>
																{url}
															</Link>
														</td>
														<td style={tdCell}>
															{comment}
														</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								</Section>
								<Hr style={divider} />
							</>
						) : null}
						{assessment && (
							<Section>
								<Text style={paragraph}>
									For additional questions or support, please
									contact:{' '}
									<Link
										href={`mailto:info@poeontap.com`}
										style={linkInline}
									>
										info@poeontap.com
									</Link>
								</Text>
							</Section>
						)}

						{/* CTAs */}
						<Section className="cta-row">
							<table
								role="presentation"
								cellPadding={0}
								cellSpacing={0}
								border={0}
								align="center"
								style={{ margin: '0 auto' }}
							>
								<tbody>
									<tr>
										{!assessment && (
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
														src={`${baseUrl}logos/lucide/mail.png`}
														alt="Contact Us"
														style={ctaButtonIcon}
													/>
													CONTACT US
												</Link>
											</td>
										)}
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
													src={`${baseUrl}logos/lucide/user.png`}
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
													src={`${baseUrl}logos/lucide/book-open-text.png`}
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
					</Container>
					{/* Footer */}
					<Section style={footerSection}>
						<Text style={footerLead}>
							POE (Time&Place Consulting) Central Office Team:{' '}
							<span style={{ color: '#00334d', fontWeight: 600 }}>
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
			</Body>
		</Html>
	)
}

export default GrantsEmail

// Shared styles copied from tenders-email-charin
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

const containerInner: React.CSSProperties = {
	width: '100%',
	marginTop: '30px',
}
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
	margin: '0 0 16px',
}
const linkInline: React.CSSProperties = {
	color: '#00334d',
	textDecoration: 'underline',
}
const fieldLabel: React.CSSProperties = {
	color: '#00334d',
	fontWeight: 700,
	fontSize: 14,
	margin: '0 0 8px',
}
const fieldValue: React.CSSProperties = {
	fontSize: 14,
	color: '#333333',
	margin: '0 0 10px',
}
const divider: React.CSSProperties = {
	border: 'none',
	borderTop: '1px solid #00374B',
	height: 0,
	width: '50%',
	display: 'block',
	margin: '12px auto 40px',
}

// Table styles
const tableBase: React.CSSProperties = {
	borderCollapse: 'collapse',
	width: '100%',
}
const tdCell: React.CSSProperties = {
	border: '1px solid #cccccc',
	padding: '8px',
	fontSize: 12,
	color: '#333333',
	verticalAlign: 'middle' as const,
}
const linkCell: React.CSSProperties = {
	...tdCell,
	color: '#00334d',
	textDecoration: 'underline',
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
	padding: '8px 10px',
	textTransform: 'uppercase',
	backgroundColor: '#AAD278',
}
const ctaButtonIcon: React.CSSProperties = {
	width: '16px',
	height: '16px',
	marginRight: '4px',
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

// Helpers
function renderField(label: string, value?: string) {
	if (!value) return null
	return (
		<table
			width="100%"
			cellPadding={0}
			cellSpacing={0}
			style={{ margin: '5px 0 5px' }}
		>
			<tbody>
				<tr>
					<td style={{ textAlign: 'left', padding: '4px 0' }}>
						<div style={fieldLabel}>{label}</div>
						<div style={fieldValue}>{value}</div>
					</td>
				</tr>
			</tbody>
		</table>
	)
}
