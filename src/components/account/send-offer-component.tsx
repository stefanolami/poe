import AccountSummaryFromStore from './summaries/account-summary-store'
import SendOfferForm from './forms/send-offer-form'

const SendOfferComponent = () => {
	return (
		<div className="w-4/5 mx-auto max-w-[500px] lg:grid grid-cols-2 lg:max-w-[1000px] lg:gap-20 text-primary mb-16 lg:mb-0">
			<AccountSummaryFromStore />
			<SendOfferForm />
		</div>
	)
}

export default SendOfferComponent
