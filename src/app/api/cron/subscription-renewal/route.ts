import { NextResponse } from 'next/server'
import {
	processDueRenewals,
	processPendingFreezes,
} from '@/lib/subscriptions/renewal-logic'

// GET route invoked by external cron (e.g. Vercel Cron)
export async function GET() {
	try {
		const result = await processDueRenewals()
		const pending = await processPendingFreezes()
		return NextResponse.json({ ...result, ...pending })
	} catch (e) {
		console.error('Cron subscription-renewal error', e)
		return NextResponse.json({ error: 'cron failure' }, { status: 500 })
	}
}
