import { FormattedGrantType } from '@/lib/types'
import { formatDeadline, formatGeography } from '@/lib/utils'
import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Section,
	Text,
	Img,
	Row,
	Column,
} from '@react-email/components'

const GrantsEmailTailored = ({
	grant,
	assessment,
}: {
	grant: FormattedGrantType
	assessment: { client: string; relevance: string; next_steps: string }
}) => {
	const {
		geography,
		call_title,
		programme_title,
		alert_purpose,
		programme_purpose,
		instrument_type,
		awarding_authority,
		reference_number,
		deadline,
		in_brief,
		value,
		further_details,
	} = grant

	return (
		<Html lang="en">
			<Head>
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
			<Body style={{ width: '100%' }}>
				<div style={{ width: '600px', margin: '0 auto' }}>
					<Section
						style={{
							backgroundColor: '#009EC2',
							padding: '16px',
							paddingBottom: '0px',
						}}
					>
						<Section>
							<Row>
								<Column>
									<Img
										src={`https://www.poeontap.com/logos/poe-white.png`}
										width="151"
										height="32"
										alt="POE's Logo"
									/>
								</Column>
								<Column>
									<Img
										src={`https://www.poeontap.com/logos/consulting-white.png`}
										width="122"
										height="32"
										alt="T&P Consulting's Logo"
									/>
								</Column>
							</Row>
						</Section>
						<Heading
							as="h1"
							style={{
								fontSize: '30px',
								fontWeight: 400,
								fontFamily: 'Unna',
								color: '#fff',
								textAlign: 'center',
								marginBottom: '10px',
								marginTop: '50px',
							}}
						>
							{call_title || programme_title}
						</Heading>
					</Section>

					<Section style={section}>
						<Text style={fieldTitle}>
							<strong>GEOGRAPHY</strong>
						</Text>
						<Text style={fieldText}>
							{formatGeography(geography)}
						</Text>

						{call_title && (
							<>
								<Text style={fieldTitle}>
									<strong>CALL TITLE</strong>
								</Text>
								<Text style={fieldText}>{call_title}</Text>
							</>
						)}

						{programme_title && (
							<>
								<Text style={fieldTitle}>
									<strong>GRANT PROGRAMME</strong>
								</Text>
								<Text style={fieldText}>{programme_title}</Text>
							</>
						)}

						{value && (
							<>
								<Text style={fieldTitle}>
									<strong>VALUE</strong>
								</Text>
								<Text style={fieldText}>{value}</Text>
							</>
						)}

						{alert_purpose && (
							<>
								<Text style={fieldTitle}>
									<strong>ALERT PURPOSE</strong>
								</Text>
								<Text style={fieldText}>{alert_purpose}</Text>
							</>
						)}

						{programme_purpose && (
							<>
								<Text style={fieldTitle}>
									<strong>ALERT PURPOSE</strong>
								</Text>
								<Text style={fieldText}>
									{programme_purpose}
								</Text>
							</>
						)}

						{instrument_type && (
							<>
								<Text style={fieldTitle}>
									<strong>INSTRUMENT TYPE</strong>
								</Text>
								<Text style={fieldText}>{instrument_type}</Text>
							</>
						)}

						{awarding_authority && (
							<>
								<Text style={fieldTitle}>
									<strong>AWARDING AUTHORITY</strong>
								</Text>
								<Text style={fieldText}>
									{awarding_authority}
								</Text>
							</>
						)}

						{reference_number && (
							<>
								<Text style={fieldTitle}>
									<strong>REFERENCE NUMBER</strong>
								</Text>
								<Text style={fieldText}>
									{reference_number}
								</Text>
							</>
						)}
					</Section>

					<Divider />

					<Section style={section}>
						<Text style={fieldTitle}>
							<strong>DEADLINE(S)</strong>
						</Text>
						{(deadline ?? []).map((date, index) => (
							<Text
								key={index}
								style={fieldText}
							>
								{formatDeadline(date)}
							</Text>
						))}
					</Section>

					<Divider />

					<Section style={section}>
						<Text style={fieldTitle}>
							<strong>IN BRIEF</strong>
						</Text>
						<Text style={fieldText}>{in_brief}</Text>
					</Section>

					<Divider />

					{further_details && further_details.length > 0 && (
						<>
							<Section style={section}>
								<Text style={fieldTitle}>
									<strong>
										LINKS / RESOURCES / FURTHER DETAILS
									</strong>
								</Text>
								{further_details.map((details, index) => {
									const detail = details.split('///')
									return (
										<Text
											key={index}
											style={fieldText}
										>
											{new Date(
												detail[0]
											).toLocaleDateString('en-GB', {
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
											})}
											{' - '}
											<Link href={detail[1]}>
												{detail[1]}
											</Link>
											{' - '}
											{detail[2]}
										</Text>
									)
								})}
								{/* {grant.files && grant.files.length > 0 && (
									<Section>
										<Text style={fieldTitle}>
											<strong>ATTACHMENTS</strong>
										</Text>
										<ul>
											{grant.files.map(
												(filePath, idx) => {
													// Generate the public URL for each file
													const url = `https://wgbitmetlwsyukgoortd.supabase.co/storage/v1/object/public/documents${filePath}`
													return (
														<li key={idx}>
															<a href={url}>
																{filePath
																	.split('/')
																	.pop()}
															</a>
														</li>
													)
												}
											)}
										</ul>
									</Section>
								)} */}
							</Section>

							<Divider />
						</>
					)}

					{assessment && (
						<>
							<Section style={section}>
								<Text style={fieldTitle}>
									<strong>RELEVANCE</strong>
								</Text>
								<Text style={fieldText}>
									{assessment.relevance}
								</Text>
								<Text style={fieldTitle}>
									<strong>NEXT STEPS</strong>
								</Text>
								<Text style={fieldText}>
									{assessment.next_steps}
								</Text>
							</Section>

							<Divider />
						</>
					)}

					<Section style={section}>
						<Text style={fieldText}>
							<strong>
								For additional questions or support, please
								contact:{' '}
							</strong>
							<Link href="mailto:info@poeontap.com">
								info@poeontap.com
							</Link>
						</Text>
						<Text style={fieldText}>
							You can find additional information on the full list
							of support services we can provide{' '}
							<Link
								href="https://timeandplaceconsulting.com/service/eu-funding-project-management"
								style={{
									textDecorationLine: 'underline',
								}}
							>
								here
							</Link>
							.
						</Text>
					</Section>
				</div>
			</Body>
		</Html>
	)
}

export default GrantsEmailTailored

const Divider = () => {
	return (
		<div
			style={{
				backgroundColor: '#009EC2',
				height: '5px',
				width: '100%',
				margin: '0 auto',
			}}
		></div>
	)
}

const section = {
	backgroundColor: '#fff',
	color: '#27335a',
	padding: '16px',
}

const fieldTitle = {
	marginBottom: '-10px',
	marginTop: '26px',
	fontWeight: 500,
	fontSize: '14px',
	fontFamily: 'Josefin Sans',
	color: '#009EC2',
}

const fieldText = {
	fontSize: '16px',
	display: 'block',
}
