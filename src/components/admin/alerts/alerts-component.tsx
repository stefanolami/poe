import { columns } from './alerts-columns'
import { AlertsTable } from './alerts-table'
import { getAlerts } from '@/actions/alerts'

const AlertsComponent = async () => {
	const data = await getAlerts()

	return (
		<div className="min-h-[calc(100vh-80px)] bg-primary">
			<div className="flex flex-row items-center justify-between gap-16 mb-8">
				<h1 className="text-white font-jose text-2xl">Alerts</h1>

				<button className="invisible bg-primary-light hover:bg-primary-light/90 text-white font-jose text-base w-40 py-2 shadow-md hover:scale-[1.02] hover:shadow-xl">
					Create New
				</button>
			</div>

			<AlertsTable
				columns={columns}
				data={data}
			/>
		</div>
	)
}

export default AlertsComponent
