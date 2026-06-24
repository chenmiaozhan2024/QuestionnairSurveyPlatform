import { create } from 'zustand'

interface AuthState {
  token: string | null
  userRole: string | null
  username: string | null

  setAuth: (data: { token: string; userRole: string; username: string }) => void
  clearAuth: () => void
  isLoggedIn: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  userRole: null,
  username: null,

  setAuth: (data) => {
    localStorage.setItem('token', data.token)
    set({
      token: data.token,
      userRole: data.userRole,
      username: data.username,
    })
  },

  clearAuth: () => {
    localStorage.removeItem('token')
    set({ token: null, userRole: null, username: null })
  },

  isLoggedIn: () => !!get().token,
}))
