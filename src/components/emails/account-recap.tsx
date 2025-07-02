import { selectionData } from '@/data/data'
import { AccountRecapType, PricedGeographicItem } from '@/lib/types'
import { removeParenthesesContent } from '@/lib/utils'
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Section,
	Text,
} from '@react-email/components'

const AccountRecapEmail = ({
	data,
	total,
}: {
	data: AccountRecapType
	total: number
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
							Hello!
						</Heading>
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
												<span>
													{key == 'deployment'
														? 'Grants Deployment'
														: key == 'project'
															? 'Grants Innovative Projects'
															: category.label}
												</span>
												<ul style={list}>
													{data[
														key as keyof AccountRecapType
													].map((item, index) => (
														<li
															key={index}
															style={listItem}
														>
															<div
																style={
																	listItemDiv
																}
															>
																<div
																	style={
																		listItemLabel
																	}
																>
																	<span>
																		{removeParenthesesContent(
																			item.label
																		)}
																	</span>
																	<span>
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
																	</span>
																</div>

																<div>
																	€ 67609 /
																	year
																</div>
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
															{item.label}
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
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<span>TOTAL</span>
							<span>€ {total} / year</span>
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
				</Container>
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

/* const fieldTitle = {
	marginBottom: '-10px',
	marginTop: '26px',
	fontWeight: 500,
	fontSize: '14px',
	fontFamily: 'Josefin Sans',
	color: '#009EC2',
} */

const fieldText = {
	fontSize: '16px',
}

const list = {
	listStyleType: 'disc',
}

const listItem = {
	margin: '8px 0',
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

const listItemLabel: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	gap: '4px',
	alignItems: 'start',
	flexDirection: 'column',
	maxWidth: '75%',
}
