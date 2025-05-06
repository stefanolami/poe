'use client'

//import { useStore } from '@/store/store'
import Link from 'next/link'
/* import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { getClientAccount } from '@/actions/clientsAccount' */

const ClientsLoginComponent = () => {
	/* const [clientAuthenticated, setClientAuthenticated] = useState(false)

	const { storeClientSession, removeClientSession } = useStore(
		useShallow((state) => ({
			storeCreateClientSession: state.clientSession,
			removeClientSession: state.removeClientSession,
		}))
	)

	useEffect(() => {
		if (storeClientSession.id !== 0) {
			const clientAccount = async () => {
				const response = await getClientAccount(storeClientSession.id)
				if (response) {
					storeClientSession(response)
				}
			}
		}
	}, []) */

	return (
		<Link
			href="/login"
			className="absolute z-10 right-10 -top-16 hidden lg:block"
		>
			<button className="bg-primary-light text-white font-jose px-10 py-3 shadow-md hover:scale-[1.02] hover:shadow-xl text-lg">
				Login
			</button>
		</Link>
	)
}

export default ClientsLoginComponent
