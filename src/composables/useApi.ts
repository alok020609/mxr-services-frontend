import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import type { ApiResponse } from '@/api/types'

export const useApi = <T = any>() => {
  const uiStore = useUIStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiCall()
      
      if (response.success && response.data) {
        return response.data
      } else {
        error.value = response.error || 'An error occurred'
        uiStore.showNotification('error', error.value)
        return null
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    execute
  }
}

