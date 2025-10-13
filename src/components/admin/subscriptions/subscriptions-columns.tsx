'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export type AdminSubscription = {
	id: string
	client_id: string | null
	client_email?: string | null
	client_account_status?: string | null
	client_pending_since?: string | null
	period_start: string
	period_end: string
	auto_renew: boolean
	status: string
	created_at: string | null
}

export const columns: ColumnDef<AdminSubscription>[] = [
	{
		accessorKey: 'client_email',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === 'asc')
				}
				className="px-0"
			>
				Client Email
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		/* cell: ({ row, getValue }) => {
			const id = row.original.id
			const email = String(getValue() || '—')
			return (
				<Link
					href={`/admin/subscriptions/${id}`}
					className="truncate max-w-[180px] block hover:underline"
				>
					{email}
				</Link>
			)
		}, */
	},
	{
		accessorKey: 'client_account_status',
		header: 'Account Status',
		cell: ({ getValue }) => {
			const v = String(getValue() || '—').toLowerCase()
			const color =
				v === 'active'
					? 'text-green-600'
					: v === 'pending'
						? 'text-amber-500'
						: v === 'frozen'
							? 'text-red-500'
							: 'text-white'
			return (
				<span className={`uppercase font-semibold ${color}`}>
					{v === '—' ? '—' : v}
				</span>
			)
		},
	},
	{
		accessorKey: 'client_pending_since',
		header: 'Pending Since',
		cell: ({ getValue }) => (
			<span>
				{getValue()
					? new Date(String(getValue())).toLocaleDateString('en-GB')
					: '—'}
			</span>
		),
	},
	{
		accessorKey: 'period_start',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === 'asc')
				}
				className="px-0"
			>
				Start
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ getValue }) => (
			<span>{new Date(String(getValue())).toLocaleDateString()}</span>
		),
	},
	{
		accessorKey: 'period_end',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === 'asc')
				}
				className="px-0"
			>
				End
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ getValue }) => (
			<span>{new Date(String(getValue())).toLocaleDateString()}</span>
		),
	},
	{
		accessorKey: 'auto_renew',
		header: 'Auto Renew',
		cell: ({ getValue }) => (
			<span className={`capitalize`}>
				{getValue() ? 'Enabled' : 'Disabled'}
			</span>
		),
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === 'asc')
				}
				className="px-0"
			>
				Status
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ getValue }) => (
			<span
				className={`uppercase font-semibold ${getValue() == 'active' ? 'text-green-600' : 'text-red-500'}`}
			>
				{getValue() == 'active' ? 'Active' : 'Frozen'}
			</span>
		),
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === 'asc')
				}
				className="px-0"
			>
				Created
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ getValue }) => (
			<span>
				{getValue()
					? new Date(String(getValue())).toLocaleDateString('en-GB')
					: '—'}
			</span>
		),
	},
]
