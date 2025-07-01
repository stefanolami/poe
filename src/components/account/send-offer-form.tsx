'use client'

import { useToast } from '@/hooks/use-toast'
import { CreateAccountTempType } from '@/lib/types'
import { sendOfferSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useStore } from '@/store/store'
import { useShallow } from 'zustand/shallow'
import { createClientTemp } from '@/actions/clients'
import { selectionArrayFromStoreToDB } from '@/lib/utils'

type SendOfferType = {
	email: string
}

const SendOfferForm = () => {
	const { toast } = useToast()

	const router = useRouter()

	const { storeSector, storeData } = useStore(
		useShallow((state) => ({
			storeSector: state.sector,
			storeData: state.data,
		}))
	)

	const form = useForm<SendOfferType>({
		resolver: zodResolver(sendOfferSchema),
		defaultValues: {
			email: '',
		},
	})

	const isSubmitting = form.formState.isSubmitting

	const submitHandler: SubmitHandler<CreateAccountTempType> = async (
		data: CreateAccountTempType
	) => {
		console.log('formatting data', data)
		const fullData = {
			...data,
			sector: storeSector.value,
			vehicles_type: selectionArrayFromStoreToDB(
				storeData.eMobility.typeOfVehicle
			),
			vehicles_contract:
				storeData.eMobility.typeOfVehicleContract?.map(
					(item) => item.value
				) || [],
			charging_stations_type: selectionArrayFromStoreToDB(
				storeData.eMobility.chargingStations
			),
			charging_stations_contract:
				storeData.eMobility.chargingStationsContract?.map(
					(item) => item.value
				) || [],
			pif: selectionArrayFromStoreToDB(storeData.eMobility.pif),
			deployment: selectionArrayFromStoreToDB(
				storeData.eMobility.deployment
			),
			project: selectionArrayFromStoreToDB(storeData.eMobility.project),
		}

		try {
			console.log('fullData', fullData)
			const response = await createClientTemp(fullData)

			if (response) {
				toast({
					title: 'Thank You!',
					description: 'Account created successfully',
					variant: 'default',
				})
				setTimeout(() => {
					router.push('/')
				}, 1000)
			}

			console.log('response', response)

			return response
		} catch (error) {
			if (error instanceof Error) {
				toast({
					title: 'Error',
					description: 'An error occurred while creating the account',
					variant: 'destructive',
				})
				console.error(error.message)
			} else {
				toast({
					title: 'Error',
					description: 'An unexpected error occurred',
					variant: 'destructive',
				})
				console.error(error)
			}
		}
	}

	return (
		<div className="mt-10 lg:mt-0">
			<h2 className="text-lg md:text-xl lg:text-3xl mb-4 lg:mb-10">
				Create Account
			</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(submitHandler, (e) => {
						console.log(e)
					})}
					className=""
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm md:text-base lg:text-lg">
									Email
								</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder=""
										{...field}
										className="bg-white text-primary text-sm md:text-base"
									/>
								</FormControl>
								<FormMessage className="text-red-500 text-sm md:text-base" />
							</FormItem>
						)}
					/>
					<Button
						disabled={isSubmitting}
						type="submit"
						variant="default"
						className="text-sm md:text-base lg:text-lg bg-primary-light text-white hover:bg-primary-light shadow-md hover:shadow-xl hover:scale-[1.02] mt-8 px-6 py-2"
					>
						Send Offer
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default SendOfferForm
