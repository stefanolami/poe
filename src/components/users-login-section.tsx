'use client'

import { signOut } from '@/actions/auth'
import { useStore } from '@/store/store'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ImSpinner6 } from 'react-icons/im'
import { useShallow } from 'zustand/shallow'

const UsersLoginSection = ({
	setActive,
}: {
	setActive?: (active: boolean) => void
}) => {
	const [loading, setLoading] = useState(true)

	const { userRole, isAuthenticated, setIsAuthenticated, setUserRole } =
		useStore(
			useShallow((state) => ({
				userRole: state.userRole,
				isAuthenticated: state.isAuthenticated,
				setIsAuthenticated: state.setIsAuthenticated,
				setUserRole: state.setUserRole,
			}))
		)

	useEffect(() => {
		setLoading(false)
	}, [isAuthenticated, userRole])

	const handleLogout = async () => {
		try {
			await signOut()
			setUserRole(null)
			setIsAuthenticated(false)
			if (setActive) setActive(false)
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	if (loading) {
		return (
			<button className="flex items-center justify-center bg-primary-light hover:bg-primary-light/90 text-white font-jose w-36 lg:w-28 px-5 py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base">
				<ImSpinner6
					className="animate-spin text-white"
					size={20}
				/>
			</button>
		)
	}

	return (
		<>
			{userRole === 'client' && (
				<div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-3 mt-6 lg:mt-0 mx-auto">
					<Link href="/account">
						<button
							className="bg-primary-light hover:bg-primary-light/90 text-white font-jose w-36 md:w-24 lg:w-28 py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base"
							onClick={() => setActive && setActive(false)}
						>
							Account
						</button>
					</Link>
					<button
						className="bg-primary-light hover:bg-primary-light/90 text-white font-jose w-36 md:w-24 lg:w-28 py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
			)}
			{userRole === 'admin' && (
				<div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-3 mt-6 lg:mt-0 mx-auto">
					<Link href="/admin/dashboard">
						<button
							className="bg-primary-light hover:bg-primary-light/90 text-white font-jose w-36 md:w-24 lg:w-28  py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base"
							onClick={() => setActive && setActive(false)}
						>
							Dashboard
						</button>
					</Link>
					<button
						className="bg-primary-light hover:bg-primary-light/90 text-white font-jose w-36 md:w-24 lg:w-28 py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
			)}
			{!userRole && (
				<div className="mt-6 lg:mt-0 mx-auto">
					<Link href="/login">
						<button className="bg-primary-light hover:bg-primary-light/90 text-white font-jose w-36 md:w-24 lg:w-28 py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base">
							Login
						</button>
					</Link>
				</div>
			)}
		</>
	)
}

export default UsersLoginSection
