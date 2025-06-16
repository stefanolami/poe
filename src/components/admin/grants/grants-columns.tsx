'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

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
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Call Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: 'grant_programme',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Grant Programme
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: 'geography',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Geography
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: 'value',
		header: 'Value',
	},
	{
		accessorKey: 'sent',
		header: 'Sent',
		cell: ({ getValue }) => (
			<span
				className={`uppercase ${getValue() == true ? 'text-green-500' : 'text-red-500'}`}
			>
				{String(getValue())}
			</span>
		),
	},
]
