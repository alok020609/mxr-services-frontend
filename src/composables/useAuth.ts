import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/endpoints/auth'
import { useUIStore } from '@/stores/ui'
import type { LoginRequest, RegisterRequest } from '@/api/types'
import type { AxiosError } from 'axios'
import { extractErrorMessage } from '@/utils/errorHandler'

export const useAuth = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const uiStore = useUIStore()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isAdmin = computed(() => authStore.isAdmin)
  const isLoading = computed(() => authStore.isLoading)

  const login = async (credentials: LoginRequest) => {
    authStore.setLoading(true)
    try {
      const response = await authApi.login(credentials)
      if (response.success && response.data) {
        authStore.login(
          response.data.token,
          response.data.refreshToken,
          response.data.user
        )
        return { success: true }
      }
      // Show auth error if login failed
      if (response.error) {
        uiStore.showAuthError({ response: { status: 401 } } as AxiosError)
      }
      return { success: false, error: response.error }
    } catch (error: any) {
      const axiosError = error as AxiosError
      uiStore.showAuthError(axiosError)
      return { success: false, error: extractErrorMessage(axiosError) }
    } finally {
      authStore.setLoading(false)
    }
  }

  const loginWithGoogle = async (idToken: string) => {
    authStore.setLoading(true)
    try {
      const response = await authApi.loginWithGoogle(idToken)
      if (response.success && response.data) {
        authStore.login(
          response.data.token,
          response.data.refreshToken,
          response.data.user
        )
        return { success: true }
      }
      if (response.error) {
        uiStore.showAuthError({ response: { status: 401 } } as AxiosError)
      }
      return { success: false, error: response.error }
    } catch (error: any) {
      const axiosError = error as AxiosError
      uiStore.showAuthError(axiosError)
      return { success: false, error: extractErrorMessage(axiosError) }
    } finally {
      authStore.setLoading(false)
    }
  }

  const loginWithMicrosoft = async (idToken: string) => {
    authStore.setLoading(true)
    try {
      const response = await authApi.loginWithMicrosoft(idToken)
      if (response.success && response.data) {
        authStore.login(
          response.data.token,
          response.data.refreshToken,
          response.data.user
        )
        return { success: true }
      }
      if (response.error) {
        uiStore.showAuthError({ response: { status: 401 } } as AxiosError)
      }
      return { success: false, error: response.error }
    } catch (error: any) {
      const axiosError = error as AxiosError
      uiStore.showAuthError(axiosError)
      return { success: false, error: extractErrorMessage(axiosError) }
    } finally {
      authStore.setLoading(false)
    }
  }

  const logout = () => {
    authStore.logout()
    router.push({ name: 'Home' })
  }

  const register = async (userData: RegisterRequest) => {
    authStore.setLoading(true)
    try {
      const response = await authApi.register(userData)
      if (!response.success && response.error) {
        uiStore.showApiError({ response: { status: 400 } } as AxiosError, response.error)
      }
      return { success: response.success, error: response.error }
    } catch (error: any) {
      const axiosError = error as AxiosError
      uiStore.showApiError(axiosError)
      return { success: false, error: extractErrorMessage(axiosError) }
    } finally {
      authStore.setLoading(false)
    }
  }

  const loadProfile = async () => {
    try {
      const response = await authApi.getProfile()
      if (response.success && response.data) {
        authStore.updateUser(response.data)
      } else if (response.error) {
        uiStore.showApiError({ response: { status: 400 } } as AxiosError, response.error)
      }
    } catch (error) {
      const axiosError = error as AxiosError
      uiStore.showApiError(axiosError)
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    loginWithGoogle,
    loginWithMicrosoft,
    logout,
    register,
    loadProfile
  }
}

