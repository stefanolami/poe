'use client'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { MultiSelect } from '@/components/ui/multi-select'
import { TenderSchema } from '@/lib/tenders.schema'
import { UseFormReturn } from 'react-hook-form'

const TenderFormEmobility = ({
	form,
}: {
	form: UseFormReturn<TenderSchema>
}) => {
	return (
		<div className="font-jose text-white grid grid-cols-2 gap-x-3 gap-y-2 grid-rows-2 items-start h-fit">
			<FormField
				control={form.control}
				name="eMobility.eVehicles.typeOfVehicle"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Type of Vehicle</FormLabel>
						<FormControl>
							<MultiSelect
								className="bg-white text-primary hover:bg-white"
								onValueChange={field.onChange}
								variant="default"
								selectAll={false}
								options={[
									{
										value: 'cars',
										label: 'Cars',
									},
									{
										value: 'buses',
										label: 'Buses',
									},
									{
										value: 'trucks',
										label: 'Trucks',
									},
									{
										value: 'planes',
										label: 'Planes',
									},
									{
										value: 'boats',
										label: 'Boats',
									},
									{
										value: 'twoWheelers',
										label: 'Two Wheelers',
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
				name="eMobility.eVehicles.typeOfContract"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Type of Contract (Vehicles)</FormLabel>
						<FormControl>
							<MultiSelect
								className="bg-white text-primary hover:bg-white"
								onValueChange={field.onChange}
								variant="default"
								selectAll={false}
								options={[
									{
										value: 'purchase',
										label: 'Purchase',
									},
									{
										value: 'leasing',
										label: 'Leasing',
									},
									{
										value: 'rental',
										label: 'Rental',
									},
									{
										value: 'fleetManagement',
										label: 'Fleet Management',
									},
									{
										value: 'dataManagement',
										label: 'Data Management',
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
				name="eMobility.chargingStations.typeOfVehicle"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Type of Charging Station</FormLabel>
						<FormControl>
							<MultiSelect
								className="bg-white text-primary hover:bg-white"
								onValueChange={field.onChange}
								variant="default"
								selectAll={false}
								options={[
									{
										value: 'cars',
										label: 'Cars',
									},
									{
										value: 'buses',
										label: 'Buses',
									},
									{
										value: 'trucks',
										label: 'Trucks',
									},
									{
										value: 'planes',
										label: 'Planes',
									},
									{
										value: 'boats',
										label: 'Boats',
									},
									{
										value: 'twoWheelers',
										label: 'Two Wheelers',
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
				name="eMobility.chargingStations.typeOfContract"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Type of Contract (Charging Stations)
						</FormLabel>
						<FormControl>
							<MultiSelect
								className="bg-white text-primary hover:bg-white"
								onValueChange={field.onChange}
								variant="default"
								selectAll={false}
								options={[
									{
										value: 'exchange',
										label: 'Exchange',
									},
									{
										value: 'digitalUpdates',
										label: 'Digital Updates',
									},
									{
										value: 'purchase',
										label: 'Purchase',
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

export default TenderFormEmobility
