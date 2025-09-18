// Email stubs - wire into your existing email sending infrastructure
// Adjust imports to your actual email action functions / templates

export async function sendAutoRenewInvoiceEmail(
	clientId: string,
	newSubscriptionId: string
): Promise<void> {
	// TODO: implement actual email (React Email template + server action)
	console.log('sendAutoRenewInvoiceEmail', { clientId, newSubscriptionId })
}

export async function sendFreezeEmail(clientId: string): Promise<void> {
	console.log('sendFreezeEmail', { clientId })
}

export async function sendReminderEmail(
	clientId: string,
	days: number
): Promise<void> {
	console.log('sendReminderEmail', { clientId, days })
}
