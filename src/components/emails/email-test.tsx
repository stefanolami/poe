import {
	Body,
	Column,
	Container,
	Head,
	Heading,
	Html,
	Section,
	Text,
	Img,
} from '@react-email/components'

const EmailTest = ({ text }: { text: string }) => {
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
				{/* <Font
					fontFamily="Josefin Sans"
					fallbackFontFamily="sans-serif"
					webFont={{
						url: 'https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap',
						format: 'woff2',
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
				<Font
					fontFamily="Unna"
					fallbackFontFamily="serif"
					webFont={{
						url: 'https://fonts.googleapis.com/css2?family=Unna:wght@700&display=swap',
						format: 'woff2',
					}}
					fontWeight={700}
					fontStyle="normal"
				/> */}
			</Head>
			<Body>
				<Container style={{ width: '600px' }}>
					<Section
						style={{
							backgroundColor: '#009EC2',
							padding: '16px',
						}}
					>
						<Column align="center">
							<Img
								src={`https://www.poeontap.com/logos/poe-white.png`}
								width="140"
								height="32"
								alt="Notion's Logo"
							/>
							<Heading
								as="h1"
								style={{
									fontSize: '40px',
									fontWeight: 400,
									fontFamily: 'Unna',
									color: '#fff',
									textAlign: 'center',
								}}
							>
								Lorem Ipsum
							</Heading>
						</Column>
					</Section>
					<div
						style={{
							backgroundColor: '#004A6A',
							height: '6px',
							width: '100%',
							margin: '0 auto',
						}}
					></div>
					<div
						style={{
							backgroundColor: '#009EC2',
							height: '6px',
							width: '100%',
							margin: '0 auto',
						}}
					></div>
					<Section
						style={{
							backgroundColor: '#fff',
							color: '#004A6A',
							padding: '16px',
						}}
					>
						{/* <div
							style={{
								backgroundColor: '#fff',
								color: '#004A6A',
								padding: '16px',
								display: 'grid',
								gridTemplateColumns: '1fr 2fr',
							}}
						> */}
						<Text
							style={{
								fontWeight: 700,
								fontSize: '20px',
							}}
						>
							<strong>Lorem Ipsum</strong>
						</Text>
						<Text>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis
							nostrud exercitation ullamco laboris nisi ut aliquip
							ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore
							eu fugiat nulla pariatur. Excepteur sint occaecat
							cupidatat non proident, sunt in culpa qui officia
							deserunt mollit anim id est laborum.
						</Text>
						{/* </div> */}
					</Section>
					<div
						style={{
							backgroundColor: '#004A6A',
							height: '4px',
							width: '100%',
							margin: '0 auto',
						}}
					></div>
					<div
						style={{
							backgroundColor: '#009EC2',
							height: '4px',
							width: '100%',
							margin: '0 auto',
						}}
					></div>
					<Section
						style={{
							backgroundColor: '#fff',
							color: '#000',
							padding: '16px',
						}}
					>
						<Text>
							<strong>Lorem Ipsum</strong>
						</Text>
						<Text>{text}</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}

export default EmailTest
