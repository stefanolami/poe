import { create } from 'zustand'
import { AuthStoreState } from './store.types'
import { devtools } from 'zustand/middleware'

export const useAuthStore = create<AuthStoreState>()(
	devtools((set) => ({
		userRole: null,
		authInitialized: false,
		setUserRole: (role) => set({ userRole: role }),
		setAuthInitialized: (initialized) =>
			set({ authInitialized: initialized }),
	}))
)
