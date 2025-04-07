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
			label: 'E-Vehicles',
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
					value: 'twoWheelers',
					label: 'Two-wheelers (bicycles)',
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
		/* eVehiclesMaintenance: {
			label: 'E-Vehicles Maintenance',
			value: 'eVehiclesMaintenance',
			fieldsLabel: '',
			fields: [
				{
					value: 'evServices',
					label: 'EV repair and maintenance services',
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
					value: 'diagnosis',
					label: 'Diagnosis',
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
					value: 'exchangePurchase',
					label: 'Exchange / Purchase',
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
					value: 'twoWheelers',
					label: 'Two-wheelers (bicycles)',
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
			contracts: [],
		}, */
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
					value: 'twoWheelers',
					label: 'Two-wheelers (bicycles)',
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
		report: {
			label: 'Funding & Investment Financing opportunities in the e-mobility sector',
			value: 'report',
			fieldsLabel: '',
			fields: [
				{
					value: 'eu',
					label: 'EU - Quarterly report (with ad hoc alerts for time-sensitive announcements) on European Commission support programme for research & innovation & deployment investment of e-mobility services',
					price: {
						euAdmin: '',
						eu27: '',
						brazil: '',
						turkey: '',
						colombia: '',
						russia: '',
						default: '8000',
					},
				},
				{
					value: 'nonEu',
					label: 'Non-Eu administrated - Quarterly report (with ad hoc alerts for time-sensitive announcements) on international, regional or national funding or financing programmes of e-mobility services',
					price: {
						euAdmin: '',
						eu27: '',
						brazil: '',
						turkey: '',
						colombia: '',
						russia: '',
						default: '11000',
					},
				},
			],
			contracts: [],
		},
	},
	language: [
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
	],
}
