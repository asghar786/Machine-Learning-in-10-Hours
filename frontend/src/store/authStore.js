import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      locked: false,

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true, locked: false }),

      lock: () => set({ locked: true }),
      unlock: () => set({ locked: false }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false, locked: false }),

      updateUser: (user) =>
        set({ user }),

      // Role helpers
      isAdmin: () => get().user?.role === 'admin',
      isStudent: () => get().user?.role === 'student',
      isInstructor: () => get().user?.role === 'instructor',
    }),
    {
      name: 'ml-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated, locked: state.locked }),
    }
  )
)

// UI store (sidebar, theme)
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: 'light',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}))
