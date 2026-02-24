import apiClient from '../client'
import type { User, Address, LoginRequest, RegisterRequest, ApiResponse } from '../types'
import type { AxiosError } from 'axios'
import { extractErrorMessage, formatApiError } from '@/utils/errorHandler'

// Authentication endpoints
export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<ApiResponse<{ token: string; refreshToken: string; user: User }>> => {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      // Error is already logged by interceptor
      // Re-throw with formatted error for components to handle
      const axiosError = error as AxiosError
      const formattedError = formatApiError(axiosError)
      
      // Return error response in the same format as success response
      return {
        success: false,
        error: formattedError.message,
      } as ApiResponse<{ token: string; refreshToken: string; user: User }>
    }
  },

  // Login with Google (id_token from Google Sign-In)
  loginWithGoogle: async (idToken: string): Promise<ApiResponse<{ token: string; refreshToken: string; user: User }>> => {
    try {
      const response = await apiClient.post('/auth/google', { idToken })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const formattedError = formatApiError(axiosError)
      return {
        success: false,
        error: formattedError.message,
      } as ApiResponse<{ token: string; refreshToken: string; user: User }>
    }
  },

  // Login with Microsoft (id_token from MSAL.js)
  loginWithMicrosoft: async (idToken: string): Promise<ApiResponse<{ token: string; refreshToken: string; user: User }>> => {
    try {
      const response = await apiClient.post('/auth/microsoft', { idToken })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const formattedError = formatApiError(axiosError)
      return {
        success: false,
        error: formattedError.message,
      } as ApiResponse<{ token: string; refreshToken: string; user: User }>
    }
  },
  
  // Register (public; use isAdmin: true only when creating admin user with token)
  register: async (userData: RegisterRequest): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const formattedError = formatApiError(axiosError)
      return {
        success: false,
        error: formattedError.message,
      } as ApiResponse<User>
    }
  },
  
  // Verify Email
  verifyEmail: async (token: string): Promise<ApiResponse> => {
    const response = await apiClient.get(`/auth/verify-email/${encodeURIComponent(token)}`)
    return response.data
  },
  
  // Resend Verification
  resendVerification: async (email: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/resend-verification', { email })
    return response.data
  },
  
  // Forgot Password
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/forgot-password', { email })
    return response.data
  },
  
  // Reset Password
  resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/reset-password', { token, password })
    return response.data
  },
  
  // Refresh Token
  refresh: async (refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    return response.data
  },
  
  // Change Password
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/change-password', { currentPassword, newPassword })
    return response.data
  },
  
  // Get Profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },
  
  // Update Profile
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put('/auth/profile', userData)
    return response.data
  },
  
  // Address Management
  getAddresses: async (): Promise<ApiResponse<Address[]>> => {
    const response = await apiClient.get('/auth/addresses')
    return response.data
  },
  
  createAddress: async (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Address>> => {
    const body = { ...address } as Record<string, unknown>
    if (body.type != null && typeof body.type === 'string') {
      body.type = body.type.toUpperCase() === 'BILLING' ? 'BILLING' : 'SHIPPING'
    }
    const response = await apiClient.post('/auth/addresses', body)
    return response.data
  },
  
  getDefaultAddress: async (): Promise<ApiResponse<Address>> => {
    const response = await apiClient.get('/auth/addresses/default')
    return response.data
  },
  
  getAddress: async (id: string): Promise<ApiResponse<Address>> => {
    const response = await apiClient.get(`/auth/addresses/${id}`)
    return response.data
  },
  
  updateAddress: async (id: string, address: Partial<Address>): Promise<ApiResponse<Address>> => {
    const response = await apiClient.put(`/auth/addresses/${id}`, address)
    return response.data
  },
  
  deleteAddress: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/auth/addresses/${id}`)
    return response.data
  },
  
  setDefaultAddress: async (id: string): Promise<ApiResponse<Address>> => {
    const response = await apiClient.put(`/auth/addresses/${id}/set-default`)
    return response.data
  }
}

