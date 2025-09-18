export function ensureActiveAccount(client: { account_status?: string }) {
	if (client.account_status === 'frozen') {
		throw new Error('Account frozen. Please renew your subscription.')
	}
}
