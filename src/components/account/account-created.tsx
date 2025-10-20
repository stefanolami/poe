import Link from 'next/link'

const AccountCreated = () => {
	const externalHref = 'https://www.consultingontap.com/'
	const externalLabel = 'Go to Time&Place Consulting'

	return (
		<div className="w-full px-4 md:px-8 mx-auto max-w-3xl text-primary">
			<div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
				<div className="space-y-3">
					<h1 className="text-xl md:text-3xl font-semibold">
						Thank you — your account is set up
					</h1>
					<p className="text-sm sm:text-base lg:text-lg text-primary/80">
						Your account has been created successfully. In the next
						few minutes you’ll receive an email with payment details
						and further instructions. If you don’t see it, please
						check your spam folder.
					</p>
				</div>

				<div className="grid text-sm sm:text-base lg:text-lg grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 items-center gap-3 mt-4">
					<Link
						href="/account"
						className="bg-primary-light text-white px-6 py-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition"
					>
						Go to your account
					</Link>
					<Link
						href={externalHref}
						target="_blank"
						rel="noopener noreferrer"
						className="bg-white text-primary px-6 py-2 border border-primary/30 shadow-sm hover:shadow-md hover:scale-[1.02] transition"
					>
						{externalLabel}
					</Link>
				</div>
			</div>
		</div>
	)
}

export default AccountCreated
