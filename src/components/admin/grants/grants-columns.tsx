'use client'

import { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Grant = {
	id: number
	sent: boolean
	geography: string
	call_title: string | null
	grant_programme: string | null
	value: string
}

export const columns: ColumnDef<Grant>[] = [
	{
		accessorKey: 'call_title',
		header: 'Call Title',
	},
	{
		accessorKey: 'sent',
		header: 'Sent',
	},
	{
		accessorKey: 'grant_programme',
		header: 'Grant Programme',
	},
	{
		accessorKey: 'geography',
		header: 'Geography',
	},
	{
		accessorKey: 'value',
		header: 'Value',
	},
]
