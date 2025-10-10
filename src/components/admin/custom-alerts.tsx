'use client'

import { useState, useTransition } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { sendCustomAlertAction } from '@/actions/custom-alerts'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'

type EntityType = 'grant' | 'tender' | 'investment'

type Option = { id: string; label: string }

export function CustomAlerts({
	entityType,
	opportunities,
	clients,
}: {
	entityType: EntityType
	opportunities: Option[]
	clients: Option[]
}) {
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [entityId, setEntityId] = useState('')
	const [clientId, setClientId] = useState('')
	const [isPending, startTransition] = useTransition()

	const onSubmit = () => {
		if (!entityId || !clientId) {
			toast({
				title: 'Missing fields',
				description: 'Select an opportunity and a client',
				variant: 'destructive',
			})
			return
		}
		const fd = new FormData()
		fd.set('entityType', entityType)
		fd.set('entityId', entityId)
		fd.set('clientId', clientId)

		startTransition(async () => {
			try {
				await sendCustomAlertAction(fd)
				toast({
					title: 'Success!',
					description: 'The alert was sent successfully',
				})
				setClientId('')
				setEntityId('')
				setOpen(false)
				// keep selection or clear depending on preference
			} catch (e: unknown) {
				const message =
					e instanceof Error ? e.message : 'Failed to send alert'
				toast({
					title: 'Error',
					description: message,
					variant: 'destructive',
				})
			}
		})
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button className="bg-primary-light/30 hover:bg-primary-light/20 text-white font-jose text-base w-40 py-2 shadow-md hover:scale-[1.02] hover:shadow-xl h-full">
					Custom Alert
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[680px] bg-primary text-white border-white/10">
				<DialogHeader>
					<DialogTitle className="text-white font-jose">
						Send custom alert
					</DialogTitle>
					<DialogDescription className="text-white/70 font-jose">
						Choose an opportunity and a client to send a one-off
						alert.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
					<div className="space-y-2">
						<label className="text-white text-sm font-jose">
							Select {entityType}
						</label>
						<Select
							value={entityId}
							onValueChange={setEntityId}
						>
							<SelectTrigger className="bg-white text-primary font-jose">
								<SelectValue
									placeholder={`Choose a ${entityType}`}
								/>
							</SelectTrigger>
							<SelectContent className="bg-white text-primary font-jose">
								{opportunities.map((o) => (
									<SelectItem
										key={o.id}
										value={o.id}
									>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label className="text-white text-sm font-jose">
							Select client
						</label>
						<Select
							value={clientId}
							onValueChange={setClientId}
						>
							<SelectTrigger className="bg-white text-primary font-jose">
								<SelectValue placeholder="Choose a client" />
							</SelectTrigger>
							<SelectContent className="bg-white text-primary font-jose">
								{clients.map((c) => (
									<SelectItem
										key={c.id}
										value={c.id}
									>
										{c.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* <div className="pt-2">
					<Button
						disabled={isPending}
						onClick={onSubmit}
						className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/10 hover:bg-white/10 w-full text-white font-jose"
					>
						{isPending ? 'Sending…' : 'Send alert'}
					</Button>
				</div> */}
				<DialogFooter>
					<div className="w-2/5 grid grid-cols-2 gap-2 mt-4">
						<DialogClose asChild>
							<Button
								variant="default"
								className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5 font-jose text-base py-2"
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							disabled={isPending}
							onClick={onSubmit}
							className="bg-primary-light hover:bg-primary-light/90 text-white font-jose text-base py-2 shadow-md hover:scale-[1.02] hover:shadow-xl"
							type="submit"
						>
							{isPending ? 'Sending…' : 'Send alert'}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
