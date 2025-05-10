import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { CreateGrantType } from '@/lib/types'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FaFolderOpen, FaTrashAlt } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

const GrantsFurtherDetails = ({
	form,
}: {
	form: UseFormReturn<CreateGrantType>
}) => {
	return (
		<FormField
			control={form.control}
			name="further_details"
			render={({ field }) => (
				<FormItem className="col-span-2">
					<FormLabel>Further Details</FormLabel>
					<FormControl>
						<div className="space-y-4">
							{(
								(field.value ?? []) as [
									string,
									string,
									string,
									File[]?,
								][]
							).map((detail, index) => (
								<div
									className="flex flex-row justify-start items-center gap-6"
									key={index}
								>
									<div className="grid grid-cols-5 gap-4 items-center">
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="pl-3 text-left font-normal bg-white hover:bg-white text-primary hover:text-primary"
												>
													{detail[0] ? (
														new Date(
															detail[0]
														).toLocaleDateString(
															'it-IT'
														)
													) : (
														<span>Date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<Calendar
													className="bg-white text-primary"
													mode="single"
													selected={
														detail[0]
															? new Date(
																	detail[0]
																)
															: undefined
													}
													onSelect={(newDate) => {
														const updatedDeadlines =
															[
																...(field.value ??
																	[]),
															]
														updatedDeadlines[
															index
														][0] = newDate
															? newDate.toISOString()
															: ''
														field.onChange(
															updatedDeadlines
														)
													}}
													disabled={(date) =>
														date < new Date()
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<Input
											placeholder="Links"
											value={detail[1] || ''}
											onChange={(e) => {
												const updated = [
													...(field.value ?? []),
												]
												updated[index][1] =
													e.target.value
												field.onChange(updated)
											}}
											className="bg-white text-primary"
										/>
										<Input
											placeholder="Notes"
											value={detail[2] || ''}
											onChange={(e) => {
												const updated = [
													...(field.value ?? []),
												]
												updated[index][2] =
													e.target.value
												field.onChange(updated)
											}}
											className="bg-white text-primary"
										/>
										{/* <input
																type="file"
																multiple
																onChange={(
																	e
																) => {
																	const updated =
																		[
																			...(field.value ??
																				[]),
																		]
																	updated[
																		index
																	][3] = e
																		.target
																		.files
																		? Array.from(
																				e
																					.target
																					.files
																			)
																		: []
																	field.onChange(
																		updated
																	)
																}}
																className="bg-white text-primary"
															/> */}
										<div className="relative flex items-center gap-2 col-span-2">
											{/* Display selected file names or placeholder */}
											<span className="truncate block text-sm text-primary bg-white pl-3 pr-7 py-[7px] border-gray-200 min-w-[120px] w-full">
												{detail[3] &&
												detail[3].length > 0
													? detail[3]
															.map(
																(file) =>
																	file.name
															)
															.join(', ')
													: 'No files chosen'}
											</span>
											{detail[3] &&
												detail[3].length > 0 && (
													<button
														type="button"
														onClick={() => {
															const updated = [
																...(field.value ??
																	[]),
															]
															updated[index][3] =
																[]
															field.onChange(
																updated
															)
														}}
														className="absolute right-12 text-primary text-xl"
														title="Clear files"
														style={{
															top: '50%',
															transform:
																'translateY(-50%)',
														}}
													>
														<IoClose />
													</button>
												)}
											{/* Styled file input */}
											<label className="inline-flex items-center cursor-pointer">
												<input
													type="file"
													multiple
													className="hidden"
													onChange={(e) => {
														const updated = [
															...(field.value ??
																[]),
														]
														updated[index][3] = e
															.target.files
															? Array.from(
																	e.target
																		.files
																)
															: []
														field.onChange(updated)
													}}
												/>
												<span className="bg-white/5 hover:bg-white/5 px-2 py-2 shadow-md hover:shadow-xl text-white flex items-center justify-center transition-colors duration-150">
													<FaFolderOpen className="w-5 h-5" />
												</span>
											</label>
										</div>
									</div>
									<Button
										variant="destructive"
										type="button"
										onClick={() => {
											const updated = (
												field.value ?? []
											).filter(
												(
													//eslint-disable-next-line
													_: any,
													i: number
												) => i !== index
											)
											field.onChange(updated)
										}}
										className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
									>
										<FaTrashAlt className="h-4 w-4" />
									</Button>
								</div>
							))}
							<Button
								variant="default"
								type="button"
								onClick={() =>
									field.onChange([
										...(field.value ?? []),
										['', '', '', []], // default empty row
									])
								}
								className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
							>
								Add Further Details
							</Button>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export default GrantsFurtherDetails
