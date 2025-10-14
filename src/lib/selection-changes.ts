import { selectionData } from '@/data/data'
import { ClientSelectionType, ClientDataJsonType } from '@/lib/types'

// Map a clients row into the ClientSelectionType shape we use in the app
export function clientRowToSelection(row: {
	vehicles_type: ClientDataJsonType[] | null
	vehicles_contract: string[] | null
	charging_stations_type: ClientDataJsonType[] | null
	charging_stations_contract: string[] | null
	pif: ClientDataJsonType[] | null
	deployment: ClientDataJsonType[] | null
	project: ClientDataJsonType[] | null
}): ClientSelectionType {
	return {
		typeOfVehicle: (row.vehicles_type as ClientDataJsonType[]) || [],
		typeOfVehicleContract: row.vehicles_contract || [],
		chargingStations:
			(row.charging_stations_type as ClientDataJsonType[]) || [],
		chargingStationsContract: row.charging_stations_contract || [],
		pif: (row.pif as ClientDataJsonType[]) || [],
		deployment: (row.deployment as ClientDataJsonType[]) || [],
		project: (row.project as ClientDataJsonType[]) || [],
	}
}

export type SelectionDiff = {
	added: { category: keyof ClientSelectionType; item: ClientDataJsonType }[]
	removed: { category: keyof ClientSelectionType; item: ClientDataJsonType }[]
}

// Compute a simple diff: items present in toSelection but not fromSelection are added, and vice versa
export function diffSelections(
	fromSelection: ClientSelectionType,
	toSelection: ClientSelectionType
): SelectionDiff {
	const added: SelectionDiff['added'] = []
	const removed: SelectionDiff['removed'] = []

	// Only diff JSON selection categories, not the contract string arrays
	const categories: (keyof ClientSelectionType)[] = [
		'typeOfVehicle',
		'chargingStations',
		'pif',
		'deployment',
		'project',
	]
	for (const category of categories) {
		const fromItems = new Map(
			(fromSelection[category] as ClientDataJsonType[]).map((x) => [
				keyFor(x),
				x,
			])
		)
		const toItems = new Map(
			(toSelection[category] as ClientDataJsonType[]).map((x) => [
				keyFor(x),
				x,
			])
		)

		// additions
		for (const [k, item] of toItems.entries()) {
			if (!fromItems.has(k)) added.push({ category, item })
		}
		// removals
		for (const [k, item] of fromItems.entries()) {
			if (!toItems.has(k)) removed.push({ category, item })
		}
	}

	return { added, removed }
}

function keyFor(item: ClientDataJsonType): string {
	const geos = (item.geographies || [])
		.map((g) => g.value)
		.sort()
		.join(',')
	return `${item.value}|${geos}`
}

// Price calculation using selectionData like store.getSinglePriceFromDB
export function priceSelection(selection: ClientSelectionType): number {
	let total = 0
	const categories = Object.keys(selection) as (keyof ClientSelectionType)[]
	for (const category of categories) {
		if (
			category === 'typeOfVehicleContract' ||
			category === 'chargingStationsContract'
		)
			continue
		const items = selection[category] as ClientDataJsonType[]
		for (const item of items) {
			total += priceSingle(category, item)
		}
	}
	return total
}

export function priceSingle(
	category: keyof ClientSelectionType,
	item: ClientDataJsonType
): number {
	let total = 0
	const cat = category as keyof typeof selectionData.eMobility
	const def = selectionData.eMobility[cat]
	const found = def.fields.find(
		(f: { value: string; label: string; price?: Record<string, string> }) =>
			f.value === item.value
	)
	if (!found) return 0
	const geos = item.geographies || []
	for (const g of geos) {
		const p = found.price?.[g.value as keyof typeof found.price]
		if (p) total += parseInt(String(p), 10)
	}
	return total
}

// Apply selection to clients row columns
export function selectionToClientUpdates(selection: ClientSelectionType) {
	return {
		vehicles_type: selection.typeOfVehicle,
		vehicles_contract: selection.typeOfVehicleContract,
		charging_stations_type: selection.chargingStations,
		charging_stations_contract: selection.chargingStationsContract,
		pif: selection.pif,
		deployment: selection.deployment,
		project: selection.project,
	}
}
