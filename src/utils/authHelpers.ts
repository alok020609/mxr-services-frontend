import { useAuthStore } from '@/stores/auth'

/**
 * Check if current user is admin
 * Useful for conditional rendering and access control
 */
export function isAdmin(): boolean {
  const authStore = useAuthStore()
  return authStore.isAdmin
}

/**
 * Check if current user is authenticated
 */
export function isAuthenticated(): boolean {
  const authStore = useAuthStore()
  return authStore.isAuthenticated
}

/**
 * Get current user
 */
export function getCurrentUser() {
  const authStore = useAuthStore()
  return authStore.user
}

/**
 * Debug function to log auth state
 * Useful for troubleshooting admin access issues
 */
export function debugAuthState() {
  const authStore = useAuthStore()
  const state = {
    isAuthenticated: authStore.isAuthenticated,
    isAdmin: authStore.isAdmin,
    hasToken: !!authStore.token,
    user: authStore.user,
    userRole: authStore.user?.role,
    userEmail: authStore.user?.email,
    userData: JSON.stringify(authStore.user, null, 2),
  }
  
  console.log('[Auth Debug]', state)
  return state
}

