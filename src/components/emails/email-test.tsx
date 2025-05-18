import { CreateGrantType } from '@/lib/types'
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Section,
	Text,
	Img,
} from '@react-email/components'

const EmailTest = ({ grant }: { grant: CreateGrantType }) => {
	console.log(grant)

	const {
		geography,
		call_title,
		grant_programme,
		alert_purpose,
		instrument_type,
		awarding_authority,
		reference_number,
		deadline,
		in_brief,
		value,
		further_details,
		tailored_assessment,
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
			<Body>
				<Container style={{ width: '600px' }}>
					<Section
						style={{
							backgroundColor: '#009EC2',
							padding: '16px',
							paddingBottom: '0px',
						}}
					>
						<Img
							src={`https://www.poeontap.com/logos/poe-white.png`}
							width="140"
							height="32"
							alt="Notion's Logo"
						/>
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
							Lorem Ipsum dolor sit amet Lorem Ipsum
						</Heading>
					</Section>

					<Section style={section}>
						<Text style={fieldTitle}>
							<strong>GEOGRAPHY</strong>
						</Text>
						<Text style={fieldText}>{geography}</Text>

						{call_title && (
							<>
								<Text style={fieldTitle}>
									<strong>CALL TITLE</strong>
								</Text>
								<Text style={fieldText}>{call_title}</Text>
							</>
						)}

						{grant_programme && (
							<>
								<Text style={fieldTitle}>
									<strong>GRANT PROGRAMME</strong>
								</Text>
								<Text style={fieldText}>{grant_programme}</Text>
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

						<Text style={fieldTitle}>
							<strong>PROGRAMME PURPOSE</strong>
						</Text>
						<Text style={fieldText}>Lorem Ipsum</Text>

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
						{deadline.map((date, index) => (
							<Text
								key={index}
								style={fieldText}
							>
								{date}
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

					{further_details && (
						<>
							<Section style={section}>
								<Text style={fieldTitle}>
									<strong>
										LINKS / RESOURCES / FURTHER DETAILS
									</strong>
								</Text>
								{further_details.map((detail, index) => (
									<Text
										key={index}
										style={fieldText}
									>
										{detail}
									</Text>
								))}
							</Section>

							<Divider />
						</>
					)}

					{tailored_assessment && (
						<>
							<Section style={section}>
								<Text style={fieldTitle}>
									<strong>RELEVANCE</strong>
								</Text>
								<Text style={fieldText}>
									{tailored_assessment[0]}
								</Text>
								<Text style={fieldTitle}>
									<strong>NEXT STEPS</strong>
								</Text>
								<Text style={fieldText}>
									{tailored_assessment[1]}
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
				</Container>
			</Body>
		</Html>
	)
}

export default EmailTest

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
	color: '#004A6A',
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
}
