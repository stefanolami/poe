/**
 * Bounded concurrency runner.
 * Executes worker over items with at most `limit` simultaneous executions.
 */
export async function runWithConcurrency<T>(
	items: T[],
	limit: number,
	worker: (item: T, index: number) => Promise<void>
) {
	if (limit <= 0) throw new Error('Concurrency limit must be > 0')
	const queue = [...items.entries()]
	const running: Promise<void>[] = []
	async function runNext() {
		const next = queue.shift()
		if (!next) return
		const [idx, item] = next
		await worker(item, idx)
		await runNext()
	}
	for (let i = 0; i < Math.min(limit, queue.length); i++) {
		running.push(runNext())
	}
	await Promise.all(running)
}
