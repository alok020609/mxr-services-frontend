import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { env } from '@/config/env'
import { handleApiError } from '@/utils/errorHandler'
import { logApiRequest, logApiResponse, logApiError } from '@/utils/apiLogger'

// Get API base URL from environment configuration
// In development, use relative URL to leverage Vite proxy
// In production, use the full URL from environment
const API_BASE_URL = env.isDevelopment 
  ? '/api/v1'  // Use relative URL in dev to work with Vite proxy
  : env.apiBaseUrl  // Use full URL in production

// Log API base URL in development for debugging
if (env.isDevelopment) {
  console.log('🔧 API Configuration:', {
    baseURL: API_BASE_URL,
    backendURL: env.apiBaseUrl,
    enableApiLogging: env.enableApiLogging,
    apiLogLevel: env.apiLogLevel,
    isDevelopment: env.isDevelopment
  })
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { requestId?: string }) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request using API logger
    // This will log all request details including params and body
    const requestId = logApiRequest(config)
    
    // Store request ID for correlation
    if (!config.requestId) {
      config.requestId = requestId
    }
    
    return config
  },
  (error: AxiosError) => {
    logApiError(error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse & { config: InternalAxiosRequestConfig & { requestId?: string } }) => {
    // Log successful response using API logger
    logApiResponse(response)
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          // Use the same base URL logic for refresh endpoint
          const refreshUrl = env.isDevelopment 
            ? '/api/v1/auth/refresh'
            : `${env.apiBaseUrl}/auth/refresh`
          const response = await axios.post(refreshUrl, {
            refreshToken
          })
          // Backend may return { success, data: { token } } or { token, refreshToken }
          const payload = response.data?.data ?? response.data ?? {}
          const token = payload.token
          const newRefreshToken = payload.refreshToken

          // Update tokens
          if (token) {
            localStorage.setItem('auth_token', token)
          }
          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken)
          }
          
          // Retry original request with new token
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          }
          throw new Error('No token in refresh response')
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        
        // Log refresh error
        if (refreshError instanceof AxiosError) {
          handleApiError(refreshError, 'Token Refresh')
        }
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      }
    }
    
    // Skip error logging for expected 404s on compliance documents and experience endpoints
    // These are expected when documents/guides/videos/questions don't exist yet
    const isExpected404 = error.response?.status === 404 && (
      originalRequest.url?.includes('/compliance/documents/') ||
      (originalRequest.url?.includes('/experience/products/') && (
        originalRequest.url?.includes('/size-guide') ||
        originalRequest.url?.includes('/videos') ||
        originalRequest.url?.includes('/questions')
      ))
    )
    
    // Use centralized error handler for all errors (except expected 404s)
    // This will log the error with full details and extract the error message
    // The error handler uses the API logger for consistent formatted output
    if (!isExpected404) {
      handleApiError(error, originalRequest.url)
    }
    
    // Return the error with the formatted message attached for components to use
    // Components can access error.message or error.response.data.error
    
    return Promise.reject(error)
  }
)

// Retry logic for failed requests
const retryRequest = async (
  requestFn: () => Promise<any>,
  retries = 3,
  delay = 1000
): Promise<any> => {
  try {
    return await requestFn()
  } catch (error) {
    if (retries > 0 && (error as AxiosError).code === 'ECONNABORTED') {
      await new Promise(resolve => setTimeout(resolve, delay))
      return retryRequest(requestFn, retries - 1, delay * 2)
    }
    throw error
  }
}

// Helper function to update base URL dynamically
export const updateApiBaseUrl = (newBaseUrl: string) => {
  apiClient.defaults.baseURL = newBaseUrl
}

export default apiClient
export { retryRequest }

