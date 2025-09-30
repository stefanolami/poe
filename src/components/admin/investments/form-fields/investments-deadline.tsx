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
import { Textarea } from '@/components/ui/textarea'
import { CreateInvestmentsType } from '@/lib/types'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FaTrashAlt } from 'react-icons/fa'

const InvestmentsDeadline = ({
	form,
	isSubmitting,
}: {
	form: UseFormReturn<CreateInvestmentsType>
	isSubmitting: boolean
}) => {
	return (
		<FormField
			control={form.control}
			name="deadline"
			render={({ field }) => (
				<FormItem className="col-span-2">
					<FormLabel>Deadline</FormLabel>
					<FormControl>
						<div className="space-y-4 w-full">
							{/* Render each deadline row */}
							{(field.value as [string, string, string][]).map(
								(
									deadline: [string, string, string],
									index: number
								) => (
									<div
										className="flex flex-row justify-start items-start gap-6 w-full"
										key={index}
									>
										<div className="grid grid-cols-2 grid-rows-3 gap-4 items-center w-full">
											{/* Date Picker */}
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="pl-3 text-left font-normal bg-white hover:bg-white text-primary hover:text-primary"
														disabled={isSubmitting}
													>
														{deadline[0] ? (
															new Date(
																deadline[0]
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
															deadline[0]
																? new Date(
																		deadline[0]
																	)
																: undefined
														}
														onSelect={(newDate) => {
															const updatedDeadlines =
																[...field.value]
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

											{/* Time Zone Input */}
											<Input
												disabled={isSubmitting}
												placeholder="Time"
												value={deadline[1]}
												onChange={(e) => {
													const updatedDeadlines = [
														...field.value,
													]
													updatedDeadlines[index][1] =
														e.target.value
													field.onChange(
														updatedDeadlines
													)
												}}
												className="bg-white text-primary"
											/>

											{/* Notes Input */}
											<Textarea
												disabled={isSubmitting}
												placeholder="Notes"
												value={deadline[2]}
												onChange={(e) => {
													const updatedDeadlines = [
														...field.value,
													]
													updatedDeadlines[index][2] =
														e.target.value
													field.onChange(
														updatedDeadlines
													)
												}}
												className="bg-white text-primary col-span-2 row-span-2 h-full"
											/>
										</div>
										{/* Remove Deadline */}
										<Button
											variant="destructive"
											type="button"
											onClick={() => {
												const updatedDeadlines =
													field.value.filter(
														(_, i: number) =>
															i !== index
													)
												field.onChange(updatedDeadlines)
											}}
											className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
										>
											<FaTrashAlt className="h-4 w-4" />
										</Button>
									</div>
								)
							)}

							{/* Add Deadline */}
							<Button
								variant="default"
								type="button"
								onClick={() =>
									field.onChange([
										...field.value,
										['', '', ''],
									])
								}
								className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5"
							>
								Add Deadline
							</Button>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export default InvestmentsDeadline
