'use client'

import { Button } from '@/components/ui/button'
import { AlertType } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export const columns: ColumnDef<AlertType>[] = [
	{
		accessorKey: 'subject',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Subject
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: 'entity_type',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Entity Type
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ getValue }) => (
			<span className="capitalize">{String(getValue())}</span>
		),
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: 'matched_clients',
		header: 'Clients Matched',
		cell: ({ getValue }) => (
			<span
			/* className={`${getValue() == true ? 'text-green-500' : 'text-red-500'}`} */
			>
				{Number(
					Array.isArray(getValue())
						? (getValue() as string[]).length
						: 0
				)}
			</span>
		),
	},
]
