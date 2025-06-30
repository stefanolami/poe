'use client'

import { Button } from '@/components/ui/button'
import { Activity } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export const columns: ColumnDef<Activity>[] = [
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
		accessorKey: 'entity_name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Entity Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: 'recipient',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Recipient
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: 'event_type',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Event
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ getValue }) => (
			<span
				className={`uppercase  ${String(getValue()) == 'sent' ? 'text-green-500' : 'text-red-500'}`}
			>
				{String(getValue()) == 'sent' ? 'sent' : 'bounced'}
			</span>
		),
	},
	{
		accessorKey: 'email_status',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="px-0"
				>
					Email Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ getValue }) => (
			<span
				className={`uppercase  ${String(getValue()) == 'rejected' ? 'text-red-500' : 'text-green-500'}`}
			>
				{String(getValue())}
			</span>
		),
	},
]
