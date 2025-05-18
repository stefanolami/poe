import { geographiesArray } from '@/data/data'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
