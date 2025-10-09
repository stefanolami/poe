'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Grant = {
	id: string
	sent: boolean
	geography: string
	call_title: string | null
	programme_title: string | null
	internal_deadline: string | null
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
		accessorKey: 'programme_title',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Programme Title
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
		accessorKey: 'internal_deadline',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Internal Deadline
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ getValue }) => {
			const v = getValue() as string | null
			return (
				<span>
					{v ? new Date(v).toLocaleDateString('en-GB') : 'N/A'}
				</span>
			)
		},
	},
	{
		accessorKey: 'sent',
		header: 'Alert',
		cell: ({ getValue }) => (
			<span
				className={`uppercase ${getValue() == true ? 'text-green-500' : 'text-red-500'}`}
			>
				{getValue() == true ? 'Sent' : 'Not Sent'}
			</span>
		),
	},
]
