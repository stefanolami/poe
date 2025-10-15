import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import {
	markSelectionChangePaid,
	commitSelectionChange,
	rollbackSelectionChange,
} from '@/actions/selection-changes'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Row = {
	id: string
	client_id: string
	status: 'pending' | 'committed' | 'rolled_back'
	price_cents: number
	pending_since: string
	due_at: string
	clients?: { id: string; email: string; org_name: string | null } | null
}

async function actionMarkPaid(formData: FormData) {
	'use server'
	const id = String(formData.get('id') || '')
	if (!id) return
	await markSelectionChangePaid(id)
	revalidatePath('/admin/selection-changes')
}

async function actionCommit(formData: FormData) {
	'use server'
	const id = String(formData.get('id') || '')
	if (!id) return
	await commitSelectionChange(id)
	revalidatePath('/admin/selection-changes')
}

async function actionRollback(formData: FormData) {
	'use server'
	const id = String(formData.get('id') || '')
	if (!id) return
	await rollbackSelectionChange(id)
	revalidatePath('/admin/selection-changes')
}

export default async function Page() {
	const supabase = await createClient()
	const { data } = await supabase
		.from('selection_changes')
		.select(
			'id, client_id, status, price_cents, pending_since, due_at, clients:client_id ( id, email, org_name )'
		)
		.order('pending_since', { ascending: true })

	const rows = (data || []) as unknown as Row[]

	return (
		<div className="p-6 space-y-6 text-white">
			<h1 className="text-2xl font-semibold">Selection Changes</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Client</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Pending Since</TableHead>
						<TableHead>Due At</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((r) => (
						<TableRow key={r.id}>
							<TableCell>
								<div className="flex flex-col">
									<Link
										className="text-blue-600 underline"
										href={`/admin/selection-changes/${r.id}`}
									>
										{r.clients?.org_name || '—'}
									</Link>
									<span className="text-xs text-muted-foreground">
										{r.clients?.email}
									</span>
								</div>
							</TableCell>
							<TableCell className="capitalize">
								{r.status.replace('_', ' ')}
							</TableCell>
							<TableCell>
								€{(r.price_cents / 100).toFixed(2)}
							</TableCell>
							<TableCell>
								{new Date(r.pending_since).toLocaleDateString()}
							</TableCell>
							<TableCell>
								{new Date(r.due_at).toLocaleDateString()}
							</TableCell>
							<TableCell className="space-x-2 text-right">
								{r.status === 'pending' ? (
									<div className="inline-flex gap-2">
										<form action={actionMarkPaid}>
											<input
												type="hidden"
												name="id"
												value={r.id}
											/>
											<Button
												variant="outline"
												size="sm"
											>
												Mark paid
											</Button>
										</form>
										<form action={actionCommit}>
											<input
												type="hidden"
												name="id"
												value={r.id}
											/>
											<Button
												variant="default"
												size="sm"
											>
												Commit
											</Button>
										</form>
										<form action={actionRollback}>
											<input
												type="hidden"
												name="id"
												value={r.id}
											/>
											<Button
												variant="destructive"
												size="sm"
											>
												Rollback
											</Button>
										</form>
									</div>
								) : (
									<span className="text-xs text-muted-foreground">
										No actions
									</span>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
