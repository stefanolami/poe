import { NextRequest, NextResponse } from 'next/server'
import { requestSelectionChange } from '@/actions/selection-changes'
import type { ClientSelectionType } from '@/lib/types'

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as {
			clientId?: string
			toSelection?: ClientSelectionType
		}
		if (!body?.clientId || !body?.toSelection) {
			return NextResponse.json(
				{ ok: false, error: 'Missing clientId or toSelection' },
				{ status: 400 }
			)
		}

		const change = await requestSelectionChange(
			body.clientId,
			body.toSelection
		)
		return NextResponse.json({ ok: true, change }, { status: 200 })
	} catch (err) {
		console.error('Selection change request failed:', err)
		const message = err instanceof Error ? err.message : 'Unknown error'
		return NextResponse.json({ ok: false, error: message }, { status: 500 })
	}
}
