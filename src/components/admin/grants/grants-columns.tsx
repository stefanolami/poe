'use client'

import { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Tender = {
	id: number
	title: string
	location: string
	value: number
}

export const columns: ColumnDef<Tender>[] = [
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'location',
		header: 'Location',
	},
	{
		accessorKey: 'value',
		header: 'Value',
	},
]
