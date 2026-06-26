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
  userRole: typeof window !== 'undefined' ? localStorage.getItem('userRole') : null,
  username: typeof window !== 'undefined' ? localStorage.getItem('username') : null,

  setAuth: (data) => {
    // console.log('data', data)
    localStorage.setItem('token', data.token)
    localStorage.setItem('userRole', data.userRole)
    localStorage.setItem('username', data.username)
    set({
      token: data.token,
      userRole: data.userRole,
      username: data.username,
    })
  },

  clearAuth: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    set({ token: null, userRole: null, username: null })
  },

  isLoggedIn: () => !!get().token,
}))
