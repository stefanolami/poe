import { selectionData } from '@/data/data'
import { AccountRecapType, PricedGeographicItem } from '@/lib/types'
import { removeParenthesesContent } from '@/lib/utils'
import {
	Body,
	Column,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Row,
	Section,
	Text,
} from '@react-email/components'

const AccountRecapEmail = ({
	data,
	total,
	id,
}: {
	data: AccountRecapType
	total: number
	id: string
}) => {
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
			<Body style={{ width: '100%', fontFamily: 'Josefin Sans' }}>
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
							Hello!
						</Heading>
					</Section>

					<Section style={section}>
						<Text style={fieldText}>
							Here is a summary of your selection. Click on the
							link below to confirm it and create your account.
						</Text>
						<Link
							href={`http://localhost:3000/confirm-account/${id}`}
						>
							Confirm Account
						</Link>
					</Section>

					<Section style={section}>
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
									data[key as keyof AccountRecapType].length >
									0
								) {
									return (
										<>
											{index > 0 && <Divider />}
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
																		).price
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
							} /* else if (key === 'report') {
												const category =
													DATA[key as keyof MobilityData]
						
												if (category.length > 0) {
													return (
														<div
															className="mt-2"
															key={index}
														>
															<span className="text-lg">Reports</span>
															<ul className="pl-1 pr-3">
																{category.map((item, index) => (
																	<li
																		key={index}
																		className="flex w-full items-center justify-between gap-4 py-2"
																	>
																		<span className="text-white">
																			{item.value == 'eu'
																				? 'EU'
																				: 'Non-EU'}
																		</span>
																		<span className="text-white">
																			€ {item.price?.default}
																		</span>
																	</li>
																))}
															</ul>
														</div>
													)
												}
											} */ else if (
								key === 'typeOfVehicleContract' ||
								key === 'chargingStationsContract'
							) {
								if (
									data[key as keyof AccountRecapType].length >
									0
								) {
									return (
										<>
											<DividerSmall />
											<div key={index}>
												<Text>Type of Contract</Text>
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

					<Divider />

					<Section style={section}>
						<div style={listItemDiv}>
							<Text
								style={{
									fontSize: '30px',
								}}
							>
								TOTAL
							</Text>
							<Text
								style={{
									marginLeft: 'auto',
									fontSize: '30px',
								}}
							>
								€ {total} / year
							</Text>
						</div>
					</Section>

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

export default AccountRecapEmail

const Divider = () => {
	return (
		<div
			style={{
				backgroundColor: '#009EC2',
				height: '3px',
				width: '100%',
				margin: '24px auto',
			}}
		></div>
	)
}
const DividerSmall = () => {
	return (
		<div
			style={{
				backgroundColor: '#009EC2',
				height: '1px',
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
	fontWeight: 500,
	fontSize: '20px',
	fontFamily: 'Josefin Sans',
}

const fieldText = {
	fontSize: '16px',
}

const list = {
	listStyleType: 'disc',
}

const listItemContract = {
	margin: '8px 0',
}

const listItemDiv: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'start',
	flexDirection: 'row',
}
