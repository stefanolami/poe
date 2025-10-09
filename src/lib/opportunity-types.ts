// Unified raw opportunity input types and normalization helpers
import type {
	FormattedGrantType,
	FormattedTenderType,
	FormattedInvestmentType,
} from './types'

// Base raw shape from DB before normalization
export interface RawOpportunityBase {
	geography: string[] | null | undefined
	call_title?: string | null
	programme_title?: string | null
	alert_purpose?: string | null
	programme_purpose?: string | null
	instrument_type?: string | null
	awarding_authority?: string | null
	geography_details?: string | null
	deadline?: unknown // can be null, string[], string[][], etc.
	in_brief?: string | null
	value?: string | null
	sector?: string | null
	further_details?: unknown // same triple or string pattern
	reference_number?: string | null
	internal_deadline?: string | null
	intro?: string | null
	subject_matter?: string | null
	pre_launch?: boolean | null
	files?: string[] | null
	consultant?: string | null
	tailored_assessment?: unknown
}

export interface RawGrant extends RawOpportunityBase {
	deployment?: unknown
	project?: unknown
}

export interface RawTender extends RawOpportunityBase {
	vehicles?: unknown
	vehicles_contracts?: unknown
	stations?: unknown
	stations_contracts?: unknown
}

export type RawInvestment = RawOpportunityBase

/* Normalization helpers */

function mapTripleArray(arr: unknown): string[] {
	if (!Array.isArray(arr)) return []
	return arr.map((d) =>
		Array.isArray(d)
			? `${d[0] || ''}///${d[1] || ''}///${d[2] || ''}`
			: String(d)
	)
}

export function normalizeGrant(
	raw: RawGrant,
	tailored = false,
	assessment?: {
		relevance?: string | null
		next_steps?: string | null
	} | null
): FormattedGrantType & {
	tailored?: boolean
	assessment?: {
		relevance?: string | null
		next_steps?: string | null
	} | null
} {
	return {
		geography: raw.geography || [],
		call_title: raw.call_title ?? null,
		programme_title: raw.programme_title ?? null,
		alert_purpose: raw.alert_purpose ?? null,
		programme_purpose: raw.programme_purpose ?? null,
		instrument_type: raw.instrument_type ?? null,
		awarding_authority: raw.awarding_authority ?? null,
		geography_details: raw.geography_details || undefined,
		deadline: mapTripleArray(raw.deadline),
		in_brief: raw.in_brief ?? null,
		value: raw.value ?? null,
		sector: raw.sector || 'e-mobility',
		further_details: mapTripleArray(raw.further_details),
		reference_number: raw.reference_number ?? null,
		internal_deadline: raw.internal_deadline ?? null,
		intro: raw.intro ?? null,
		subject_matter: raw.subject_matter ?? null,
		pre_launch: !!raw.pre_launch,
		files: raw.files || null,
		tailored_assessment: undefined, // not exposed directly in formatted shape (assessment passed separately)
		consultant: raw.consultant ?? null,
		deployment: Array.isArray(raw.deployment)
			? (raw.deployment as string[])
			: null,
		project: Array.isArray(raw.project) ? (raw.project as string[]) : null,
		tailored: !!tailored,
		assessment: tailored ? assessment || null : null,
	}
}

export function normalizeTender(
	raw: RawTender,
	tailored = false,
	assessment?: {
		relevance?: string | null
		next_steps?: string | null
	} | null
): FormattedTenderType & {
	tailored?: boolean
	assessment?: {
		relevance?: string | null
		next_steps?: string | null
	} | null
} {
	return {
		geography: raw.geography || [],
		call_title: raw.call_title ?? null,
		programme_title: raw.programme_title ?? null,
		alert_purpose: raw.alert_purpose ?? null,
		programme_purpose: raw.programme_purpose ?? null,
		instrument_type: raw.instrument_type ?? null,
		awarding_authority: raw.awarding_authority ?? null,
		geography_details: raw.geography_details || undefined,
		deadline: mapTripleArray(raw.deadline),
		in_brief: raw.in_brief ?? null,
		value: raw.value ?? null,
		sector: raw.sector || 'e-mobility',
		further_details: mapTripleArray(raw.further_details),
		reference_number: raw.reference_number ?? null,
		internal_deadline: raw.internal_deadline ?? null,
		intro: raw.intro ?? null,
		subject_matter: raw.subject_matter ?? null,
		pre_launch: !!raw.pre_launch,
		files: raw.files || null,
		tailored_assessment: undefined,
		consultant: raw.consultant ?? null,
		vehicles: Array.isArray(raw.vehicles)
			? (raw.vehicles as string[])
			: null,
		vehicles_contracts: Array.isArray(raw.vehicles_contracts)
			? (raw.vehicles_contracts as string[])
			: null,
		stations: Array.isArray(raw.stations)
			? (raw.stations as string[])
			: null,
		stations_contracts: Array.isArray(raw.stations_contracts)
			? (raw.stations_contracts as string[])
			: null,
		tailored: !!tailored,
		assessment: tailored ? assessment || null : null,
	}
}

export function normalizeInvestment(
	raw: RawInvestment,
	tailored = false,
	assessment?: {
		relevance?: string | null
		next_steps?: string | null
	} | null
): FormattedInvestmentType & {
	tailored?: boolean
	assessment?: {
		relevance?: string | null
		next_steps?: string | null
	} | null
} {
	return {
		geography: raw.geography || [],
		call_title: raw.call_title ?? null,
		programme_title: raw.programme_title ?? null,
		alert_purpose: raw.alert_purpose ?? null,
		programme_purpose: raw.programme_purpose ?? null,
		instrument_type: raw.instrument_type ?? null,
		awarding_authority: raw.awarding_authority ?? null,
		geography_details: raw.geography_details || undefined,
		deadline: mapTripleArray(raw.deadline),
		in_brief: raw.in_brief ?? null,
		value: raw.value ?? null,
		sector: raw.sector || 'e-mobility',
		further_details: mapTripleArray(raw.further_details),
		reference_number: raw.reference_number ?? null,
		internal_deadline: raw.internal_deadline ?? null,
		intro: raw.intro ?? null,
		subject_matter: raw.subject_matter ?? null,
		pre_launch: !!raw.pre_launch,
		files: raw.files || null,
		tailored_assessment: undefined,
		consultant: raw.consultant ?? null,
		tailored: !!tailored,
		assessment: tailored ? assessment || null : null,
	}
}
