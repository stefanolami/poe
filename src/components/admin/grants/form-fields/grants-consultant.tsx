import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { CreateGrantType } from '@/lib/types'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

const GrantsConsultant = ({
	form,
	consultants,
	isSubmitting,
}: {
	form: UseFormReturn<CreateGrantType>
	consultants: {
		id: number
		name: string
	}[]
	isSubmitting: boolean
}) => {
	return (
		<FormField
			control={form.control}
			name="consultant"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Consultant</FormLabel>
					<FormControl>
						<Select
							disabled={isSubmitting}
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							<FormControl>
								<SelectTrigger className="bg-white text-primary">
									<SelectValue placeholder="Select an option" />
								</SelectTrigger>
							</FormControl>
							<SelectContent className="bg-white text-primary font-jose">
								{consultants.map((consultant) => (
									<SelectItem
										key={consultant.id}
										value={consultant.id.toString()}
									>
										{consultant.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage className="text-red-500 text-sm" />
				</FormItem>
			)}
		/>
	)
}

export default GrantsConsultant
