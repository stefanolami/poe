import { geographiesArray, selectionData } from '@/data/data'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SelectionDataEmobilityType } from './types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function categoryValueToLabel(category: string) {
	if (category === 'typeOfVehicle') return 'E-Vehicles'
	if (category === 'eVehiclesMaintenance') return 'E-Vehicles Maintenance'
	if (category === 'chargingStations') return 'Charging Stations'
}

export function removeParenthesesContent(string: string) {
	if (string.startsWith('Public investment financing opportunities')) {
		return string.slice(0, 27)
	}
	if (string.startsWith('Road Transport (HDVs)')) {
		return string
	}
	if (!string.includes('(')) return string
	const index = string.indexOf('(')
	return string.slice(0, index).trim()
}

export function formatDeadline(deadline: string) {
	const deadlineArray = deadline.split('///')
	const date = new Date(deadlineArray[0])
	const time = deadlineArray[1]
	const notes = deadlineArray[2]
	const formattedDate = date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
	return `${formattedDate} - ${time} - ${notes}`
}

export function formatGeography(geography: string[]) {
	return geography
		.map((code) => {
			const found = geographiesArray.find((g) => g.value === code)
			// Remove prefix if present (e.g., "AT - Austria" → "Austria")
			if (found && found.label.includes(' - ')) {
				return found.label.split(' - ')[1]
			}
			// If no prefix, just return the label
			return found ? found.label : code
		})
		.join(', ')
}

export function getGeoLabel(geography: string) {
	const found = geographiesArray.find((g) => g.value === geography)
	if (found && found.label.includes(' - ')) {
		return found.label.split(' - ')[1]
	}
	return found ? found.label : geography
}

export function getSelectionItemLabel(string: string, category: string) {
	const found = selectionData.eMobility[
		category as keyof typeof selectionData.eMobility
	].fields.find((item) => item.value === string)
	if (
		found &&
		found.label.startsWith('Public investment financing opportunities')
	) {
		return found.label.slice(0, 27)
	}
	return found ? found.label : string
}

export function getSelectionItemContractLabel(
	string: string,
	category: string
) {
	/* const categoryObj =
		selectionData.eMobility[
			category as keyof typeof selectionData.eMobility
		]

	const contracts =
		'contracts' in categoryObj ? categoryObj.contracts : undefined

	if (contracts) {
		// Safe to use contracts here
		const found = contracts.find((item) => item.value === string)
		return found ? found.label : string
	} */
	const mainCategory =
		category == 'typeOfVehicleContract'
			? 'typeOfVehicle'
			: 'chargingStations'
	const data: SelectionDataEmobilityType = selectionData.eMobility
	const found = data[mainCategory].contracts?.find(
		(item) => item.value === string
	)
	return found ? found.label : string
}
