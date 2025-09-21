import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Send Offer by Email | POE',
	description: 'Send tailored offers to clients directly from POE.',
}
import SendOfferComponent from '@/components/account/send-offer-component'

const SendOfferByEmailPage = () => {
	return <SendOfferComponent />
}

export default SendOfferByEmailPage
