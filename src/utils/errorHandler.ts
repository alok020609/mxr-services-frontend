import type { AxiosError } from 'axios'
import { logApiError } from './apiLogger'

/**
 * Backend API Error Response Format
 * Based on backend_apis.md, errors are returned as:
 * {
 *   "success": false,
 *   "error": "Error message",
 *   "message": "Optional additional message",
 *   "errors": { "field": ["error1", "error2"] } // For validation errors
 * }
 */
export interface ApiErrorResponse {
  success: false
  error: string
  message?: string
  errors?: Record<string, string[]> // Field-level validation errors
}

export interface FormattedApiError {
  message: string
  status: number | undefined
  statusText: string | undefined
  fieldErrors?: Record<string, string[]>
  originalError: AxiosError
  url?: string
  method?: string
}

/**
 * Extract error message from Axios error response
 * Checks backend format first (response.data.error), then falls back to other formats
 */
export function extractErrorMessage(error: AxiosError): string {
  // Check if response exists
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.'
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.'
    }
    return 'Connection failed. Please check your internet connection.'
  }

  const responseData = error.response.data as ApiErrorResponse | any

  // Check backend format: { success: false, error: "message" }
  if (responseData && typeof responseData === 'object') {
    if (responseData.error && typeof responseData.error === 'string') {
      return responseData.error
    }
    if (responseData.message && typeof responseData.message === 'string') {
      return responseData.message
    }
  }

  // Fallback to status text or generic message
  return error.response.statusText || getDefaultErrorMessage(error.response.status)
}

/**
 * Extract field-level validation errors from response
 */
export function getValidationErrors(error: AxiosError): Record<string, string[]> | null {
  if (!error.response) return null

  const responseData = error.response.data as ApiErrorResponse | any

  if (responseData && typeof responseData === 'object' && responseData.errors) {
    return responseData.errors
  }

  return null
}

/**
 * Get user-friendly error message based on HTTP status code
 */
export function getDefaultErrorMessage(status: number): string {
  const statusMessages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Authentication failed. Please check your credentials.',
    403: 'Access denied. You don\'t have permission to perform this action.',
    404: 'Resource not found.',
    409: 'Conflict. This resource already exists.',
    422: 'Validation error. Please check your input.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    502: 'Bad gateway. The server is temporarily unavailable.',
    503: 'Service unavailable. Please try again later.',
    504: 'Gateway timeout. Please try again later.',
  }

  return statusMessages[status] || `An error occurred (${status}). Please try again.`
}

/**
 * Get user-friendly message for authentication errors
 */
export function getAuthErrorMessage(error: AxiosError): string {
  const status = error.response?.status
  const extractedMessage = extractErrorMessage(error)

  // Custom messages for auth errors
  if (status === 401) {
    // If backend provides specific message, use it; otherwise use friendly default
    if (extractedMessage.toLowerCase().includes('password') || 
        extractedMessage.toLowerCase().includes('credential')) {
      return extractedMessage
    }
    return 'Invalid email or password. Please try again.'
  }

  if (status === 400) {
    // Validation error during login
    if (extractedMessage.toLowerCase().includes('validation')) {
      return 'Please check your email and password format.'
    }
    return extractedMessage || 'Invalid login information.'
  }

  if (status === 500) {
    return 'Login service is temporarily unavailable. Please try again later.'
  }

  return extractedMessage
}

/**
 * Format API error into structured object
 */
export function formatApiError(error: AxiosError): FormattedApiError {
  const message = extractErrorMessage(error)
  const fieldErrors = getValidationErrors(error)

  return {
    message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    fieldErrors: fieldErrors || undefined,
    originalError: error,
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
  }
}

/**
 * Comprehensive error logging for debugging
 * Uses API logger for consistent formatted output
 */
export function logError(error: AxiosError, context?: string): void {
  // Use API logger for formatted error logging
  // The API logger will handle all formatting and display
  logApiError(error)
  
  // Additional context-specific logging if needed
  if (context) {
    const formattedError = formatApiError(error)
    console.group(`[API Error - ${context}]`)
    console.error('Context:', context)
    console.error('Formatted Error:', formattedError)
    if (formattedError.fieldErrors) {
      console.error('Validation Errors:', formattedError.fieldErrors)
    }
    console.groupEnd()
  }
}

/**
 * Handle API error and return formatted error
 * This is the main function to use for error handling
 */
export function handleApiError(error: AxiosError, context?: string): FormattedApiError {
  logError(error, context)
  return formatApiError(error)
}

/**
 * Check if error is a network error (no response from server)
 */
export function isNetworkError(error: AxiosError): boolean {
  return !error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')
}

/**
 * Check if error is a validation error (400 with field errors)
 */
export function isValidationError(error: AxiosError): boolean {
  return error.response?.status === 400 && !!getValidationErrors(error)
}

/**
 * Check if error is an authentication error (401)
 */
export function isAuthError(error: AxiosError): boolean {
  return error.response?.status === 401
}

/**
 * Check if error is a server error (5xx)
 */
export function isServerError(error: AxiosError): boolean {
  const status = error.response?.status
  return status !== undefined && status >= 500 && status < 600
}

/**
 * Check if error is a not found error (404)
 */
export function isNotFoundError(error: AxiosError): boolean {
  return error.response?.status === 404
}

