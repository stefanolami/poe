'use client'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { MultiSelect } from '@/components/ui/multi-select'
import { CreateGrantType } from '@/lib/types'
import { UseFormReturn } from 'react-hook-form'

const GrantsFormEmobility = ({
	form,
}: {
	form: UseFormReturn<CreateGrantType>
}) => {
	return (
		<div className="font-jose text-white grid grid-cols-2 gap-x-3 gap-y-2 grid-rows-2 items-start h-fit">
			<FormField
				control={form.control}
				name="deployment"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Deployment</FormLabel>
						<FormControl>
							<MultiSelect
								className="bg-white text-primary hover:bg-white"
								onValueChange={field.onChange}
								variant="default"
								selectAll={false}
								options={[
									{
										value: '234Wheelers',
										label: 'Road Transport (2-/3-/4- wheelers)',
									},
									{
										value: 'hdvs',
										label: 'Road Transport (HDVs)',
									},
									{
										value: 'maritime',
										label: 'Maritime',
									},
									{
										value: 'aviation',
										label: 'Aviation',
									},
									{
										value: 'rail',
										label: 'Rail',
									},
								]}
							/>
						</FormControl>
						<FormMessage className="text-red-500 text-sm" />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="project"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Project</FormLabel>
						<FormControl>
							<MultiSelect
								className="bg-white text-primary hover:bg-white"
								onValueChange={field.onChange}
								variant="default"
								selectAll={false}
								options={[
									{
										value: '234Wheelers',
										label: 'Road Transport (2-/3-/4- wheelers)',
									},
									{
										value: 'hdvs',
										label: 'Road Transport (HDVs)',
									},
									{
										value: 'maritime',
										label: 'Maritime',
									},
									{
										value: 'aviation',
										label: 'Aviation',
									},
									{
										value: 'rail',
										label: 'Rail',
									},
								]}
							/>
						</FormControl>
						<FormMessage className="text-red-500 text-sm" />
					</FormItem>
				)}
			/>
		</div>
	)
}

export default GrantsFormEmobility
