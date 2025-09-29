'use client'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { MultiSelect } from '@/components/ui/multi-select'
import { CreateTendersType } from '@/lib/types'
import { UseFormReturn } from 'react-hook-form'

const TendersFormEmobility = ({
	form,
}: {
	form: UseFormReturn<CreateTendersType>
}) => {
	return (
		<div className="font-jose text-white grid grid-cols-2 gap-x-3 gap-y-2 grid-rows-2 items-start h-fit">
			<FormField
				control={form.control}
				name="vehicles"
				render={({ field }) => (
					<FormItem>
						<FormLabel>E-Vehicles</FormLabel>
						<FormControl>
							<MultiSelect
								className="bg-white text-primary hover:bg-white"
								onValueChange={field.onChange}
								variant="default"
								selectAll={false}
								defaultValue={field.value}
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
										value: 'rail',
										label: 'Rail',
									},
									{
										value: 'twoThreeWheelers',
										label: '2-3 wheelers (motorbikes & scooters)',
									},
									{
										value: 'threeWheelers',
										label: '3 wheelers (rickshaws for persons or cargo)',
									},
									{
										value: 'twoWheelers',
										label: '2 wheelers (bicycles)',
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
				name="vehicles_contracts"
				render={({ field }) => (
					<FormItem>
						<FormLabel>E-Vehicles Contracts</FormLabel>
						<FormControl>
							<MultiSelect
								className="bg-white text-primary hover:bg-white"
								onValueChange={field.onChange}
								variant="default"
								selectAll={false}
								defaultValue={field.value}
								options={[
									{
										value: 'purchase',
										label: 'Purchase',
									},
									{
										value: 'leasing',
										label: 'Leasing / rental agreement',
									},
									{
										value: 'rental',
										label: 'Rental vehicle including driver',
									},
									{
										value: 'fleetManagement',
										label: 'Fleet management',
									},
									{
										value: 'dataManagement',
										label: 'Data management and software service contracts',
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
				name="stations"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Charging Stations</FormLabel>
						<FormControl>
							<MultiSelect
								className="bg-white text-primary hover:bg-white"
								onValueChange={field.onChange}
								variant="default"
								selectAll={false}
								defaultValue={field.value}
								options={[
									{
										value: 'bikesCars',
										label: 'Motorbikes and Cars (AC/DC)',
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
										value: 'planesDrones',
										label: 'Planes and Drones',
									},
									{
										value: 'boatsShips',
										label: 'Boats and Ships',
									},
									{
										value: 'rail',
										label: 'Rail',
									},
									{
										value: 'twoWheelers',
										label: '2 Wheelers (Bicycles)',
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
				name="stations_contracts"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Charging Stations Contracts</FormLabel>
						<FormControl>
							<MultiSelect
								className="bg-white text-primary hover:bg-white"
								onValueChange={field.onChange}
								variant="default"
								selectAll={false}
								defaultValue={field.value}
								options={[
									{
										value: 'exchange',
										label: 'Exchange of parts',
									},
									{
										value: 'digitalUpdates',
										label: 'Digital updates',
									},
									{
										value: 'purchase',
										label: 'Purchase of spare parts',
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

export default TendersFormEmobility
