import type { Metadata } from 'next'
import { getConsultants } from '@/actions/consultants'
import { InvestmentsForm } from '@/components/admin/investments/investments-form'

export const metadata: Metadata = {
	title: 'Create Investment | Admin | POE',
	description: 'Create a new investment and notify matched clients.',
}

const CreateInvestmentsPage = async () => {
	const consultantsRaw = await getConsultants()
	type ConsultantRow = {
		id: string
		first_name?: string | null
		last_name?: string | null
		email?: string | null
	}
	const consultants = (
		(consultantsRaw as ConsultantRow[] | null | undefined) || []
	).map((c: ConsultantRow) => ({
		id: c.id,
		name:
			[c.first_name, c.last_name].filter(Boolean).join(' ') ||
			c.email ||
			'Unnamed',
	}))
	return (
		<div className="w-full">
			<InvestmentsForm consultants={consultants} />
		</div>
	)
}

export default CreateInvestmentsPage
