import { getUserRole, signOut } from '@/actions/auth'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const UsersLoginSection = () => {
	const [role, setRole] = useState<'client' | 'admin' | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUserRole = async () => {
			try {
				const userRole = await getUserRole()
				setRole(
					userRole === 'client' || userRole === 'admin'
						? userRole
						: null
				)
			} catch (error) {
				console.error('Failed to fetch user role:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchUserRole()
	}, [])

	const handleLogout = async () => {
		try {
			await signOut()
			setRole(null)
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<>
			{role === 'client' && (
				<div className="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-3 mt-6 lg:mt-0 mx-auto">
					<Link href="/account">
						<button className="bg-primary-light text-white font-jose w-36 lg:w-28 px-5 py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base">
							Profile
						</button>
					</Link>
					<button
						className="bg-primary-light text-white font-jose w-36 lg:w-28 px-5 py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
			)}
			{role === 'admin' && (
				<div className="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-3 mt-6 lg:mt-0 mx-auto">
					<Link href="/account">
						<button className="bg-primary-light text-white font-jose w-36 lg:w-28 px-5 py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base">
							Dashboard
						</button>
					</Link>
					<button
						className="bg-primary-light text-white font-jose w-36 lg:w-28 px-5 py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
			)}
			{!role && (
				<div className="mt-6 lg:mt-0 mx-auto">
					<Link href="/login">
						<button className="bg-primary-light text-white font-jose w-36 lg:w-28 px-5 py-[6px] shadow-md hover:scale-[1.02] hover:shadow-xl text-sm lg:text-base">
							Login
						</button>
					</Link>
				</div>
			)}
		</>
	)
}

export default UsersLoginSection
