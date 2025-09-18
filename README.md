## Subscription Auto-Renewal

Yearly subscription management has been added:

- Table: `subscriptions` with `period_start`, `period_end`, `auto_renew`, `status` (active | expired | frozen)
- Client columns: `current_subscription`, `account_status` (active | frozen)
- Cron endpoint: `GET /api/cron/subscription-renewal` (configure via Vercel Cron)
    - If `auto_renew = true` and period_end = today: creates new period & triggers invoice email stub
    - If `auto_renew = false`: reminder emails at -30, -7, -1 days; freezes after period_end
- UI toggle: `AutoRenewToggle` component in account area
- Guard: `ensureActiveAccount` throws for frozen accounts
- Email stubs: `subscription-mails.ts` (implement real templates & sending)

Example Vercel cron config:

```json
{
	"cron": [
		{ "path": "/api/cron/subscription-renewal", "schedule": "0 5 * * *" }
	]
}
```

Next steps you can implement:

1. Replace email stubs with real React Email templates
2. Add admin UI to manually create / extend subscriptions
3. Add analytics around renewal conversion
4. Add soft-grace period before freezing (e.g. 7 days)
