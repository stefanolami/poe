import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const ButtonWithAlert = ({
	buttonText,
	dialogText,
	confirmText,
	action,
	buttonClass,
	disabled = false,
	children,
}: {
	buttonText: string
	dialogText: string
	confirmText: string
	action: () => void
	buttonClass?: string
	disabled?: boolean
	children?: React.ReactNode
}) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="default"
					type="button"
					disabled={disabled}
					className={buttonClass}
				>
					{buttonText}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="font-jose">
						{dialogText}
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="shadow-md hover:shadow-xl hover:scale-[1.02] bg-white/5 hover:bg-white/5 font-jose">
						Cancel
					</AlertDialogCancel>
					{children}
					<AlertDialogAction
						className="bg-primary-light hover:bg-primary-light shadow-md hover:shadow-xl hover:scale-[1.02] font-jose"
						onClick={action}
					>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default ButtonWithAlert
