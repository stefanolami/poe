import { NextResponse } from 'next/server'
import { processDueRenewals } from '@/lib/subscriptions/renewal-logic'

// GET route invoked by external cron (e.g. Vercel Cron)
export async function GET() {
	try {
		const result = await processDueRenewals()
		return NextResponse.json(result)
	} catch (e) {
		console.error('Cron subscription-renewal error', e)
		return NextResponse.json({ error: 'cron failure' }, { status: 500 })
	}
}
