import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AxiosError } from 'axios'
import { 
  extractErrorMessage, 
  getValidationErrors, 
  getAuthErrorMessage,
  isNetworkError,
  isServerError,
  formatApiError
} from '@/utils/errorHandler'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  persistent?: boolean // Don't auto-dismiss
}

export const useUIStore = defineStore('ui', () => {
  // State
  const isLoading = ref<boolean>(false)
  const loadingMessage = ref<string | null>(null)
  const notifications = ref<Notification[]>([])
  const modals = ref<Record<string, boolean>>({})
  const sidebarOpen = ref<boolean>(false)

  // Actions
  function setLoading(loading: boolean, message?: string) {
    isLoading.value = loading
    loadingMessage.value = message || null
  }

  function showNotification(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration = 5000,
    persistent = false
  ): string {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    notifications.value = [...notifications.value, { id, type, message, duration, persistent }]

    if (duration > 0 && !persistent) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  /**
   * Show API error notification with user-friendly message
   * Extracts error message from Axios error response
   */
  function showApiError(error: AxiosError, customMessage?: string): string {
    let message: string

    if (customMessage) {
      message = customMessage
    } else if (isNetworkError(error)) {
      message = 'Connection failed. Please check your internet connection and try again.'
    } else if (isServerError(error)) {
      message = 'Server error. Please try again later.'
    } else {
      message = extractErrorMessage(error)
    }

    // Server errors and network errors should persist longer
    const duration = (isNetworkError(error) || isServerError(error)) ? 10000 : 7000

    return showNotification('error', message, duration, false)
  }

  /**
   * Show validation errors for form fields
   * Displays a summary notification and returns field errors for inline display
   */
  function showValidationErrors(errors: Record<string, string[]>): Record<string, string[]> {
    const errorCount = Object.keys(errors).length
    const errorFields = Object.keys(errors).join(', ')
    
    if (errorCount > 0) {
      const message = errorCount === 1
        ? `Please fix the error in ${errorFields}`
        : `Please fix the errors in ${errorCount} fields: ${errorFields}`
      
      showNotification('error', message, 8000, false)
    }

    return errors
  }

  /**
   * Show API error with validation errors extracted
   * Returns field errors for inline form display
   */
  function showApiErrorWithValidation(error: AxiosError): Record<string, string[]> {
    const formattedError = formatApiError(error)
    
    // Show main error message
    showApiError(error)
    
    // Extract and return field-level validation errors
    if (formattedError.fieldErrors) {
      return showValidationErrors(formattedError.fieldErrors)
    }
    
    return {}
  }

  /**
   * Show authentication-specific error with user-friendly message
   */
  function showAuthError(error: AxiosError): string {
    const message = getAuthErrorMessage(error)
    return showNotification('error', message, 7000, false)
  }

  function removeNotification(id: string) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  function openModal(modalId: string) {
    modals.value = { ...modals.value, [modalId]: true }
  }

  function closeModal(modalId: string) {
    modals.value = { ...modals.value, [modalId]: false }
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setSidebarOpen(open: boolean) {
    sidebarOpen.value = open
  }

  return {
    // State
    isLoading,
    loadingMessage,
    notifications,
    modals,
    sidebarOpen,
    // Actions
    setLoading,
    showNotification,
    removeNotification,
    openModal,
    closeModal,
    toggleSidebar,
    setSidebarOpen,
    // Error handling
    showApiError,
    showValidationErrors,
    showApiErrorWithValidation,
    showAuthError,
  }
})
