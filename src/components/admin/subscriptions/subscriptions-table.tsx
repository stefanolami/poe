'use client'

import { useState } from 'react'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	columns as defaultColumns,
	AdminSubscription,
} from './subscriptions-columns'
import { TablePagination } from '../table-pagination'
import { useRouter } from 'next/navigation'

export function SubscriptionsTable({ data }: { data: AdminSubscription[] }) {
	const [sorting, setSorting] = useState<SortingState>([])

	const router = useRouter()

	const table = useReactTable({
		data,
		columns: defaultColumns as ColumnDef<AdminSubscription, unknown>[],
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		manualPagination: false,
	})

	// Build page array for existing pagination component (1..n)
	const pageCountArray = Array.from(
		{ length: table.getPageCount() },
		(_, i) => i + 1
	)

	return (
		<div className="flex-1 flex flex-col items-end justify-between text-white">
			<Table className="mb-8">
				<TableHeader>
					{table.getHeaderGroups().map((hg) => (
						<TableRow key={hg.id}>
							{hg.headers.map((header) => (
								<TableHead
									key={header.id}
									className="text-base"
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								className="hover:bg-primary-light cursor-pointer"
								onClick={() =>
									router.push(
										`/admin/subscriptions/${row.original.id}`
									)
								}
								data-state={row.getIsSelected() && 'selected'}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={defaultColumns.length}
								className="h-24 text-center"
							>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<TablePagination
				table={table}
				pageCountArray={pageCountArray}
			/>
		</div>
	)
}
