import { Table } from '@tanstack/react-table'
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
	table: Table<TData>
	pageCountArray: number[]
}

export function TablePagination<TData>({
	table,
	pageCountArray,
}: DataTablePaginationProps<TData>) {
	return (
		<div className="flex items-center justify-end px-2 mb-2">
			{/* <div className="flex-1 text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of{' '}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div> */}
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2 text-white">
					<p className="text-sm font-medium">Select Page</p>
					<Select
						value={`${table.getState().pagination.pageIndex}`}
						onValueChange={(value) => {
							table.setPageIndex(Number(value))
						}}
					>
						<SelectTrigger className="h-8 w-[70px] text-white">
							<SelectValue
								placeholder={
									table.getState().pagination.pageIndex
								}
							/>
						</SelectTrigger>
						<SelectContent
							side="top"
							className="text-white bg-primary"
						>
							{pageCountArray.map((pageIndex) => (
								<SelectItem
									key={pageIndex}
									value={`${pageIndex - 1}`}
								>
									{pageIndex}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {table.getState().pagination.pageIndex + 1} of{' '}
					{table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() =>
							table.setPageIndex(table.getPageCount() - 1)
						}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	)
}
