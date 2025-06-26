'use client'

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
} from '@tanstack/react-table'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

import { TablePagination } from '../table-pagination'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

export function ClientsTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])

	const router = useRouter()

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	})

	const pageCount = Math.ceil(data.length / 10)
	const pageCountArray = Array.from({ length: pageCount }, (_, i) => i + 1)
	console.log(pageCountArray)

	return (
		<div className="flex-1 flex flex-col items-end justify-between text-white">
			<Table className="mb-8">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										id={`grants-table-header-${header.id}`}
										className="text-base"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext()
												)}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								onClick={() =>
									router.push(
										//@ts-expect-error id not found by TS
										`/admin/clients/${row.original.id}`
									)
								}
								data-state={row.getIsSelected() && 'selected'}
								className="hover:bg-primary-light cursor-pointer"
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
								colSpan={columns.length}
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
