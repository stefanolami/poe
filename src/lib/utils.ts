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
