import { geographiesArray, selectionData } from '@/data/data'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
	ClientDataJsonType,
	ClientDataType,
	SelectionDataEmobilityType,
	ClientType,
	GrantType,
} from './types'
import { SelectableItem } from '@/store/store.types'

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

export function selectionArrayFromStoreToDB(array: SelectableItem[]) {
	return array.map(
		(item) =>
			({
				value: item.value,
				geographies: item.geographies,
			}) as ClientDataJsonType
	)
}

//eslint-disable-next-line
export function normalizeClientData(data: any): ClientDataType {
	return {
		...data,
		deployment: Array.isArray(data.deployment)
			? (data.deployment as ClientDataJsonType[])
			: null,
		vehicles_type: Array.isArray(data.vehicles_type)
			? (data.vehicles_type as ClientDataJsonType[])
			: null,
		charging_stations_type: Array.isArray(data.charging_stations_type)
			? (data.charging_stations_type as ClientDataJsonType[])
			: null,
		pif: Array.isArray(data.pif)
			? (data.pif as ClientDataJsonType[])
			: null,
		project: Array.isArray(data.project)
			? (data.project as ClientDataJsonType[])
			: null,
	}
}

export async function fileToAttachment(file: {
	filename: string
	content: Buffer
}) {
	return {
		filename: file.filename,
		content: file.content.toString('base64'),
	}
}

// Build a personalized email subject for a grant alert
// Format: "POE Alert - GB / BG - Call Title" (or grant programme if call title missing)
export function buildGrantEmailSubject(
	grant: Pick<GrantType, 'geography' | 'call_title' | 'grant_programme'>,
	client: Partial<
		Pick<
			ClientType,
			| 'vehicles_type'
			| 'charging_stations_type'
			| 'pif'
			| 'deployment'
			| 'project'
			| 'email'
		>
	>
) {
	const title = grant.call_title || grant.grant_programme || 'Grant'

	// Collect all client geography codes from nested selection arrays
	const collectCodes = (arr: unknown): string[] => {
		if (!Array.isArray(arr)) return []
		try {
			return (
				arr as Array<{
					geographies?: { value: string; label?: string }[]
				}>
			)
				.flatMap((item) => item?.geographies || [])
				.map((g) => g.value)
				.filter(Boolean)
		} catch {
			return []
		}
	}

	const clientGeoCodes = new Set<string>([
		...collectCodes(client.vehicles_type as unknown[]),
		...collectCodes(client.charging_stations_type as unknown[]),
		...collectCodes(client.pif as unknown[]),
		...collectCodes(client.deployment as unknown[]),
		...collectCodes(client.project as unknown[]),
	])

	// Intersect with grant geographies, preserving the grant order
	const intersection = (grant.geography || []).filter((code) =>
		clientGeoCodes.has(code)
	)

	const parts = ['POE Alert']
	if (intersection.length > 0) {
		const displayCodes = intersection.map((code) =>
			code === 'euAdmin' ? 'EU' : code
		)
		parts.push(displayCodes.join(' / '))
	}
	parts.push(title)
	return parts.join(' - ')
}
