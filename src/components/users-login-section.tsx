'use client'

import { getUserRole, signOut } from '@/actions/auth'
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
	const [role, setRole] = useState<'client' | 'admin' | null>(null)
	const [loading, setLoading] = useState(true)

	const { storeUserRole, storeSetUserRole, storeRemoveUserRole } = useStore(
		useShallow((state) => ({
			storeUserRole: state.userRole,
			storeSetUserRole: state.setUserRole,
			storeRemoveUserRole: state.removeUserRole,
		}))
	)

	useEffect(() => {
		const cachedRole = localStorage.getItem('userRole')
		if (cachedRole) {
			setRole(cachedRole as 'client' | 'admin')
			console.log('User role from localStorage:', cachedRole)
			setLoading(false)
			return
		}
		if (storeUserRole) {
			setRole(storeUserRole)
			console.log('User role from store:', storeUserRole)
			localStorage.setItem('userRole', storeUserRole)
			setLoading(false)
		} else {
			const fetchUserRole = async () => {
				try {
					const userRole = await getUserRole()
					storeSetUserRole(
						userRole === 'client' || userRole === 'admin'
							? userRole
							: null
					)
					localStorage.setItem('userRole', userRole)
					console.log('Fetched user role:', userRole)
				} catch (error) {
					console.error('Failed to fetch user role:', error)
				} finally {
					setLoading(false)
				}
			}

			fetchUserRole()
		}
	}, [storeUserRole, storeSetUserRole])

	const handleLogout = async () => {
		try {
			await signOut()
			setRole(null)
			storeRemoveUserRole()
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
			{role === 'client' && (
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
			{role === 'admin' && (
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
			{!role && (
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
