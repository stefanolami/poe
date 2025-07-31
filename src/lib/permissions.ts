export const canEditUser = (
	currentUserRole: string | null,
	targetUserRole: string
): boolean => {
	if (!currentUserRole) {
		return false
	}

	if (currentUserRole === 'super-admin') {
		return true
	}

	if (currentUserRole === 'admin') {
		return ['supervisor', 'consultant'].includes(targetUserRole)
	}

	return false
}
