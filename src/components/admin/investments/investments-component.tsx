import Link from 'next/link'
import { columns } from './investments-columns'
import { InvestmentsTable } from './investments-table'
import { getInvestments } from '@/actions/investments'
import { getClients } from '@/actions/clients'
import { CustomAlerts } from '@/components/admin/custom-alerts'

const InvestmentsComponent = async () => {
	const data = await getInvestments()
	const clients = await getClients()

	return (
		<div className="min-h-[calc(100vh-80px)] bg-primary">
			<div className="flex flex-row items-center justify-between gap-16 mb-8">
				<h1 className="text-white font-jose text-2xl">Investments</h1>

				<div className="space-x-2">
					<CustomAlerts
						entityType="investment"
						opportunities={data.map((t) => ({
							id: t.id,
							label:
								t.call_title || t.programme_title || 'Untitled',
						}))}
						clients={clients.map((c) => ({
							id: c.id,
							label: `${c.name} (${c.email})`,
						}))}
					/>
					<Link href={'/admin/investments/create'}>
						<button className="bg-primary-light hover:bg-primary-light/90 text-white font-jose text-base w-40 py-2 shadow-md hover:scale-[1.02] hover:shadow-xl">
							Create New
						</button>
					</Link>
				</div>
			</div>

			<InvestmentsTable
				columns={columns}
				data={data}
			/>
		</div>
	)
}

export default InvestmentsComponent
