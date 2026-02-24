import type { AxiosError } from 'axios'
import type { ApiResponse } from './types'
import { formatApiError } from '@/utils/errorHandler'

/**
 * Wrapper function for API calls that ensures errors are properly formatted
 * This can be used across all endpoint files for consistent error handling
 */
export async function handleApiCall<T>(
  apiCall: () => Promise<{ data: ApiResponse<T> }>
): Promise<ApiResponse<T>> {
  try {
    const response = await apiCall()
    return response.data
  } catch (error) {
    // Error is already logged by interceptor
    const axiosError = error as AxiosError
    const formattedError = formatApiError(axiosError)
    
    // Return error response in the same format as success response
    return {
      success: false,
      error: formattedError.message,
    } as ApiResponse<T>
  }
}

