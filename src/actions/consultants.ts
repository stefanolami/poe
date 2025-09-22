'use server'

import { createClient } from '@/supabase/server'

export const getConsultants = async () => {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('users')
		.select('*')
		.eq('role', 'consultant')

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export const addClientToConsultant = async (
	consultantId: string,
	clientId: string
) => {
	const supabase = await createClient()

	const { data: row, error: fetchErr } = await supabase
		.from('users')
		.select('clients')
		.eq('id', consultantId)
		.single()
	if (fetchErr) throw new Error(fetchErr.message)

	const current = Array.isArray(row?.clients) ? row!.clients! : []
	const next = current.includes(clientId) ? current : [...current, clientId]

	const { error: updateErr } = await supabase
		.from('users')
		.update({ clients: next })
		.eq('id', consultantId)
	if (updateErr) throw new Error(updateErr.message)

	return { success: true, clients: next }
}

export const removeClientFromConsultant = async (
	consultantId: string,
	clientId: string
) => {
	const supabase = await createClient()

	const { data: row, error: fetchErr } = await supabase
		.from('users')
		.select('clients')
		.eq('id', consultantId)
		.single()
	if (fetchErr) throw new Error(fetchErr.message)

	const current = Array.isArray(row?.clients) ? row!.clients! : []
	const next = current.filter((id) => id !== clientId)

	const { error: updateErr } = await supabase
		.from('users')
		.update({ clients: next })
		.eq('id', consultantId)
	if (updateErr) throw new Error(updateErr.message)

	return { success: true, clients: next }
}
