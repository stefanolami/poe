'use client'

import { canEditUser } from '@/lib/permissions'
import { UserClientType, UserType } from '@/lib/types'
import { useAuthStore } from '@/store/auth-store'
import Link from 'next/link'
import { useShallow } from 'zustand/shallow'
import UserEditForm from './user-edit-form'

const UserSingle = ({
	user,
	userClients,
	clientsData,
}: {
	user: UserType
	userClients: UserClientType[] | null
	clientsData: UserClientType[]
}) => {
	const { userRole } = useAuthStore(
		useShallow((state) => ({
			userRole: state.userRole,
		}))
	)

	const { created_at, email, first_name, last_name, role } = user

	const showEdit = canEditUser(userRole, role)

	return (
		<div className="font-jose mb-20">
			<div className="flex flex-row items-center justify-between w-full">
				<h1 className="text-white font-jose text-2xl">
					User - {first_name} {last_name}{' '}
					<span className="capitalize">({role})</span>
				</h1>
				{showEdit && (
					<UserEditForm
						user={user}
						clientsData={clientsData}
					/>
				)}
			</div>
			<div className="text-white font-jose text-sm grid grid-cols-2 gap-4 mt-20 space-y-2 max-w-[800px]">
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Name</span>
					<span className="block text-base">
						{first_name} {last_name}
					</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Email</span>
					<span className="block text-base">{email}</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Role</span>
					<span className="block text-base">{role}</span>
				</div>
				<div className="flex flex-col gap-2">
					<span className="block text-xl">Registration Date</span>
					<span className="block text-base">
						{new Date(created_at).toLocaleDateString('en-GB', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
						})}
					</span>
				</div>
				{role === 'supervisor' ? (
					<div className="flex flex-col gap-2">
						<span className="block text-xl">Clients</span>
						{userClients && userClients.length > 0 ? (
							<ul className="list-disc pl-5 space-y-2">
								{userClients.map((client, index) => (
									<li key={index}>
										<Link
											href={`/admin/clients/${client.id}`}
											className="underline"
										>
											<span className="capitalize">
												{client.name}{' '}
												{client.org ? client.org : ''}
											</span>{' '}
											- {client.email}
										</Link>
									</li>
								))}
							</ul>
						) : (
							<span className="block text-base">
								No clients assigned
							</span>
						)}
					</div>
				) : null}
			</div>
		</div>
	)
}

export default UserSingle
