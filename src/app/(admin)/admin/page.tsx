import type { Metadata } from 'next'
export const metadata: Metadata = {
	title: 'Admin | POE',
	description: 'POE admin dashboard overview.',
}
import { redirect } from 'next/navigation'

const AdminPage = () => {
	return redirect('/admin/dashboard')
}

export default AdminPage
