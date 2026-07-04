import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  userRole: string | null
  username: string | null

  setAuth: (data: {
    accessToken: string
    userRole: string
    username: string
  }) => void
  clearAuth: () => void
  isLoggedIn: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken:
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  userRole:
    typeof window !== 'undefined' ? localStorage.getItem('userRole') : null,
  username:
    typeof window !== 'undefined' ? localStorage.getItem('username') : null,

  setAuth: (data) => {
    // console.log('data', data)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('userRole', data.userRole)
    localStorage.setItem('username', data.username)
    set({
      accessToken: data.accessToken,
      userRole: data.userRole,
      username: data.username,
    })
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    set({ accessToken: null, userRole: null, username: null })
  },

  isLoggedIn: () => !!get().accessToken,
}))
