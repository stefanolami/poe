export const priceModalData = {
	general: false,
	typeOfVehicle: {
		cars: false,
		buses: false,
		trucks: false,
		planes: false,
		boats: false,
		twoWheelers: false,
	},
	eVehiclesMaintenance: {
		evServices: false,
		diagnosis: false,
		exchangePurchase: false,
		cars: false,
		buses: false,
		trucks: false,
		planes: false,
		boats: false,
		twoWheelers: false,
	},
	chargingStations: {
		bikesCars: false,
		buses: false,
		trucks: false,
		planes: false,
		boats: false,
		twoWheelers: false,
	},
}

export const selectionData = {
	eMobility: {
		typeOfVehicle: {
			label: 'Electric Vehicles',
			value: 'typeOfVehicle',
			fieldsLabel: 'Type of vehicle',
			fields: [
				{
					value: 'cars',
					label: 'Cars (up to 3,5 tonnes)',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'buses',
					label: 'Buses (all types and sizes)',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '1000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'trucks',
					label: 'Trucks (above 3,5 tonnes)',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'planes',
					label: 'Planes',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'boats',
					label: 'Boats',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'rail',
					label: 'Rail',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'twoThreeWheelers',
					label: '2-3 wheelers (motorbikes & scooters)',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'threeWheelers',
					label: '3 wheelers (rickshaws for persons or cargo)',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'twoWheelers',
					label: '2 wheelers (bicycles)',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
			],
			contracts: [
				{
					value: 'purchase',
					label: 'Purchase',
				},
				{
					value: 'leasing',
					label: 'Leasing / rental agreement',
				},
				{
					value: 'rental',
					label: 'Rental vehicle including driver',
				},
				{
					value: 'fleetManagement',
					label: 'Fleet management',
				},
				{
					value: 'dataManagement',
					label: 'Data management and software service contracts',
				},
			],
		},
		chargingStations: {
			label: 'Charging Stations',
			value: 'chargingStations',
			fieldsLabel: 'Type of vehicle',
			fields: [
				{
					value: 'bikesCars',
					label: 'Motorbikes and Cars (AC/DC)',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'buses',
					label: 'Buses (all types and sizes)',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'trucks',
					label: 'Trucks (above 3,5 tonnes)',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'planesDrones',
					label: 'Planes and Drones',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'boatsShips',
					label: 'Boats and Ships',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'rail',
					label: 'Rail',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					value: 'twoWheelers',
					label: '2 wheelers (bicycles)',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
			],
			contracts: [
				{
					value: 'exchange',
					label: 'Exchange of parts and / or upgrading',
				},
				{
					value: 'digitalUpdates',
					label: 'Digital updates',
				},
				{
					value: 'purchase',
					label: 'Purchase of spare parts',
				},
			],
		},
		pif: {
			label: 'Public Investment Financing',
			value: 'pif',
			fields: [
				{
					label: 'Public investment financing opportunities handbook on state-driven financing, availabilities, accession criteria and processes depending on the geographies you have selected. Updated every end of year’s quarter.',
					value: 'pif',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
			],
		},
		deployment: {
			label: 'Support for infrastructure deployment in accordance with the policies of the geography. At first, you will receive a full report on the current state of affairs in opportunities and a handbook on the various relevant grant pockets. Thereafter, you will receive ad hoc alerts on developments as well as relevant updates to the handbook. Please chose your sector(s) of interest.',
			value: 'deployment',
			fields: [
				{
					label: 'Road Transport (2-/3-/4- wheelers)',
					value: '234Wheelers',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					label: 'Road Transport (HDVs)',
					value: 'hdvs',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					label: 'Maritime',
					value: 'maritime',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					label: 'Aviation (including airports and drones)',
					value: 'aviation',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					label: 'Rail',
					value: 'rail',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
			],
		},
		project: {
			label: 'Innovation-driven projects for charging infrastructure eco-system – from grid to vehicle. At first, you will receive a full report on the current state of affairs in opportunities and a handbook on the various relevant grant pockets. Thereafter, you will receive ad hoc alerts on developments as well as relevant updates to the handbook. Please chose your sector(s) of interest.',
			value: 'project',
			fields: [
				{
					label: 'Road Transport (2-/3-/4- wheelers)',
					value: '234Wheelers',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					label: 'Road Transport (HDVs)',
					value: 'hdvs',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					label: 'Maritime',
					value: 'maritime',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					label: 'Aviation (including airports and drones)',
					value: 'aviation',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
				{
					label: 'Rail',
					value: 'rail',
					price: {
						euAdmin: '3000',
						eu27: '1500',
						brazil: '2000',
						turkey: '2000',
						colombia: '1500',
						russia: '2500',
					},
				},
			],
		},
		/* grants: {
			label: 'Public Grants',
			subTitle:
				'Non-repayable funds for project development and implementation at all TRL & CRL levels (apart from public procurement).',
			fields: [
				{
					label: 'Support for infrastructure deployment in accordance with the policies of the geography. At first, you will receive a full report on the current state of affairs in opportunities and a handbook on the various relevant grant pockets. Thereafter, you will receive ad hoc alerts on developments as well as relevant updates to the handbook. Please chose your sector(s) of interest.',
					value: 'deployment',
					subFields: [
						{
							label: 'Road Transport (2-/3-/4- wheelers)',
							value: '234Wheelers',
						},
						{
							label: 'Road Transport (HDVs)',
							value: 'hdvs',
						},
						{
							label: 'Maritime',
							value: 'maritime',
						},
						{
							label: 'Aviation (including airports and drones)',
							value: 'aviation',
						},
						{
							label: 'Rail',
							value: 'rail',
						},
					],
				},
				{
					label: 'Innovation-driven projects for charging infrastructure eco-system – from grid to vehicle. At first, you will receive a full report on the current state of affairs in opportunities and a handbook on the various relevant grant pockets. Thereafter, you will receive ad hoc alerts on developments as well as relevant updates to the handbook. Please chose your sector(s) of interest.',
					value: 'project',
					subFields: [
						{
							label: 'Road Transport (2-/3-/4- wheelers)',
							value: '234Wheelers',
						},
						{
							label: 'Road Transport (HDVs)',
							value: 'hdvs',
						},
						{
							label: 'Maritime',
							value: 'maritime',
						},
						{
							label: 'Aviation (including airports and drones)',
							value: 'aviation',
						},
						{
							label: 'Rail',
							value: 'rail',
						},
					],
				},
			],
		}, */
	},

	/* language: [
		{
			value: 'german',
			label: 'German',
		},
		{
			value: 'french',
			label: 'French',
		},
		{
			value: 'portuguese',
			label: 'Portuguese',
		},
		{
			value: 'danish',
			label: 'Danish',
		},
		{
			value: 'polish',
			label: 'Polish',
		},
		{
			value: 'italian',
			label: 'Italian',
		},
		{
			value: 'spanish',
			label: 'Spanish',
		},
		{
			value: 'greek',
			label: 'Greek',
		},
		{
			value: 'netherlands',
			label: 'Netherlands',
		},
	], */
}

export const geographiesArray = [
	{ label: 'EU-Administered', value: 'euAdmin' },
	{ label: 'AT - Austria', value: 'AT' },
	{ label: 'BE - Belgium', value: 'BE' },
	{ label: 'BR - Brazil', value: 'BR' },
	{ label: 'BG - Bulgaria', value: 'BG' },
	{ label: 'HR - Croatia', value: 'HR' },
	{ label: 'CY - Cyprus', value: 'CY' },
	{ label: 'CZ - Czech Republic', value: 'CZ' },
	{ label: 'DK - Denmark', value: 'DK' },
	{ label: 'EE - Estonia', value: 'EE' },
	{ label: 'FI - Finland', value: 'FI' },
	{ label: 'FR - France', value: 'FR' },
	{ label: 'DE - Germany', value: 'DE' },
	{ label: 'GR - Greece', value: 'GR' },
	{ label: 'HU - Hungary', value: 'HU' },
	{ label: 'IE - Ireland', value: 'IE' },
	{ label: 'IT - Italy', value: 'IT' },
	{ label: 'LV - Latvia', value: 'LV' },
	{ label: 'LT - Lithuania', value: 'LT' },
	{ label: 'LU - Luxembourg', value: 'LU' },
	{ label: 'MT - Malta', value: 'MT' },
	{ label: 'NL - Netherlands', value: 'NL' },
	{ label: 'NO - Norway', value: 'NO' },
	{ label: 'PL - Poland', value: 'PL' },
	{ label: 'PT - Portugal', value: 'PT' },
	{ label: 'RO - Romania', value: 'RO' },
	{ label: 'SK - Slovakia', value: 'SK' },
	{ label: 'SI - Slovenia', value: 'SI' },
	{ label: 'ES - Spain', value: 'ES' },
	{ label: 'SE - Sweden', value: 'SE' },
	{ label: 'CH - Switzerland', value: 'CH' },
	{ label: 'GB - United Kingdom', value: 'GB' },
]

export const geographiesArrayFrontend = [
	{
		label: 'EU-Administered',
		value: 'euAdmin',
	},
	{
		label: 'EU-27',
		value: 'eu27',
		countries: [
			{ label: 'Austria', value: 'AT' },
			{ label: 'Belgium', value: 'BE' },
			{ label: 'Bulgaria', value: 'BG' },
			{ label: 'Croatia', value: 'HR' },
			{ label: 'Cyprus', value: 'CY' },
			{ label: 'Czech Republic', value: 'CZ' },
			{ label: 'Denmark', value: 'DK' },
			{ label: 'Estonia', value: 'EE' },
			{ label: 'Finland', value: 'FI' },
			{ label: 'France', value: 'FR' },
			{ label: 'Germany', value: 'DE' },
			{ label: 'Greece', value: 'GR' },
			{ label: 'Hungary', value: 'HU' },
			{ label: 'Ireland', value: 'IE' },
			{ label: 'Italy', value: 'IT' },
			{ label: 'Latvia', value: 'LV' },
			{ label: 'Lithuania', value: 'LT' },
			{ label: 'Luxembourg', value: 'LU' },
			{ label: 'Malta', value: 'MT' },
			{ label: 'Netherlands', value: 'NL' },
			{ label: 'Norway', value: 'NO' },
			{ label: 'Poland', value: 'PL' },
			{ label: 'Portugal', value: 'PT' },
			{ label: 'Romania', value: 'RO' },
			{ label: 'Slovakia', value: 'SK' },
			{ label: 'Slovenia', value: 'SI' },
			{ label: 'Spain', value: 'ES' },
			{ label: 'Sweden', value: 'SE' },
		],
	},
	{
		label: 'Other European Countries',
		value: 'otherEu',
		countries: [
			{ label: 'Norway', value: 'NO' },
			{ label: 'Switzerland', value: 'CH' },
			{ label: 'United Kingdom', value: 'GB' },
		],
	},
	{
		label: 'Brazil (Coming Soon)',
		value: 'BR',
	},
]
