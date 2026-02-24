import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/api/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref<boolean>(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => {
    const role = user.value?.role
    return role ? role.toLowerCase() === 'admin' : false
  })
  const isVendor = computed(() => {
    const role = user.value?.role
    return role ? role.toLowerCase() === 'vendor' : false
  })

  // Actions
  function login(authToken: string, authRefreshToken: string, userData: User | any) {
    localStorage.setItem('auth_token', authToken)
    if (authRefreshToken) {
      localStorage.setItem('refresh_token', authRefreshToken)
    }
    token.value = authToken
    refreshToken.value = authRefreshToken
    
    // Normalize user data from backend
    // Backend may return firstName/lastName instead of name, and uppercase role
    const normalizedUser: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
      role: (userData.role || 'user').toLowerCase() as 'user' | 'admin' | 'vendor',
      isVerified: userData.emailVerified || userData.isVerified || false,
      isActive: userData.isActive !== false,
      createdAt: userData.createdAt || new Date().toISOString(),
      updatedAt: userData.updatedAt || new Date().toISOString(),
    }
    
    user.value = normalizedUser
  }

  function logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    token.value = null
    refreshToken.value = null
    user.value = null
  }

  function updateUser(userData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  return {
    // State
    user,
    token,
    refreshToken,
    isLoading,
    // Getters
    isAuthenticated,
    isAdmin,
    isVendor,
    // Actions
    login,
    logout,
    updateUser,
    setLoading,
  }
}, {
  persist: {
    key: 'auth-storage',
    paths: ['user', 'token', 'refreshToken'],
  },
})
