import apiClient from '../client'
import type { User, Order, ApiResponse, PaginatedResponse, AnalyticsDashboard } from '../types'

export const adminApi = {
  getDashboard: async (): Promise<ApiResponse<AnalyticsDashboard>> => {
    const response = await apiClient.get('/admin/dashboard')
    return response.data
  },
  
  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/stats')
    return response.data
  },
  
  // User Management
  getUsers: async (filters?: any): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await apiClient.get('/admin/users', { params: filters })
    return response.data
  },
  
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`/admin/users/${id}`)
    return response.data
  },
  
  createUser: async (userData: any): Promise<ApiResponse<User>> => {
    const response = await apiClient.post('/admin/users', userData)
    return response.data
  },
  
  updateUser: async (id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/admin/users/${id}`, userData)
    return response.data
  },
  
  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/admin/users/${id}`)
    return response.data
  },
  
  verifyUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/admin/users/${id}/verify`)
    return response.data
  },
  
  activateUser: async (id: string, active: boolean): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/admin/users/${id}/activate`, { active })
    return response.data
  },
  
  changeUserRole: async (id: string, role: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/admin/users/${id}/role`, { role })
    return response.data
  },
  
  resetUserPassword: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/admin/users/${id}/reset-password`)
    return response.data
  },
  
  // Order Management
  getOrders: async (filters?: { page?: number; limit?: number; status?: string; userId?: string; search?: string; paymentStatus?: string }): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const response = await apiClient.get('/admin/orders', { params: filters })
    return response.data
  },
  
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get(`/admin/orders/${id}`)
    return response.data
  },
  
  updateOrderStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.put(`/admin/orders/${id}/status`, { status })
    return response.data
  },
  
  cancelOrder: async (id: string, reason?: string): Promise<ApiResponse<Order>> => {
    const body = reason != null ? { reason } : undefined
    const response = await apiClient.post(`/admin/orders/${id}/cancel`, body)
    return response.data
  },
  
  refundOrder: async (id: string, amount: number, reason: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post(`/admin/orders/${id}/refund`, { amount, reason })
    return response.data
  },
  
  // Advanced Admin
  addOrderNote: async (orderId: string, note: string, isInternal: boolean = false): Promise<ApiResponse> => {
    const response = await apiClient.post(`/admin/advanced/orders/${orderId}/notes`, { note, isInternal })
    return response.data
  },
  
  getOrderNotes: async (orderId: string): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/admin/advanced/orders/${orderId}/notes`)
    return response.data
  },
  
  assignOrderTask: async (orderId: string, task: { assignedTo: string; taskType: string; priority: string }): Promise<ApiResponse> => {
    const response = await apiClient.post(`/admin/advanced/orders/${orderId}/tasks`, task)
    return response.data
  },
  
  getActivity: async (limit?: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/admin/advanced/activity', { params: limit ? { limit } : {} })
    return response.data
  },
  
  getNotifications: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/admin/advanced/notifications')
    return response.data
  },
  
  markNotificationRead: async (notificationId: string): Promise<ApiResponse> => {
    const response = await apiClient.put(`/admin/advanced/notifications/${notificationId}/read`)
    return response.data
  },
  
  getFilters: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/admin/advanced/filters')
    return response.data
  },
  
  saveFilter: async (filter: { name: string; resource: string; filters: any }): Promise<ApiResponse> => {
    const response = await apiClient.post('/admin/advanced/filters', filter)
    return response.data
  },
  
  updateFilter: async (id: string, filter: any): Promise<ApiResponse> => {
    const response = await apiClient.put(`/admin/advanced/filters/${id}`, filter)
    return response.data
  },
  
  deleteFilter: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/admin/advanced/filters/${id}`)
    return response.data
  },
  
  updateOrderNote: async (noteId: string, note: string): Promise<ApiResponse> => {
    const response = await apiClient.put(`/admin/advanced/notes/${noteId}`, { note })
    return response.data
  },
  
  deleteOrderNote: async (noteId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/admin/advanced/notes/${noteId}`)
    return response.data
  },
  
  // Settings Management
  getSettings: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/settings')
    return response.data
  },
  
  updateSettings: async (settings: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put('/admin/settings', settings)
    return response.data
  },
  
  // CMS Management (Admin)
  createPage: async (pageData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/cms/pages', pageData)
    return response.data
  },
  
  updatePage: async (slug: string, pageData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/cms/pages/${slug}`, pageData)
    return response.data
  },
  
  deletePage: async (slug: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/cms/pages/${slug}`)
    return response.data
  },
  
  createBlogPost: async (postData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/cms/blog', postData)
    return response.data
  },
  
  updateBlogPost: async (slug: string, postData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/cms/blog/${slug}`, postData)
    return response.data
  },
  
  deleteBlogPost: async (slug: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/cms/blog/${slug}`)
    return response.data
  },
  
  createBanner: async (bannerData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/cms/banners', bannerData)
    return response.data
  },
  
  updateBanner: async (id: string, bannerData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/cms/banners/${id}`, bannerData)
    return response.data
  },
  
  deleteBanner: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/cms/banners/${id}`)
    return response.data
  },
  
  // Coupons Management (Admin)
  createCoupon: async (couponData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/coupons/', couponData)
    return response.data
  },
  
  updateCoupon: async (code: string, couponData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/coupons/${code}`, couponData)
    return response.data
  },
  
  deleteCoupon: async (code: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/coupons/${code}`)
    return response.data
  },
  
  // Inventory Management (Admin)
  getInventory: async (filters?: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/inventory/', { params: filters })
    return response.data
  },
  
  updateInventoryStock: async (productId: string, stock: number): Promise<ApiResponse> => {
    const response = await apiClient.put(`/inventory/${productId}`, { stock })
    return response.data
  },
  
  getInventoryMovements: async (productId: string): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/inventory/${productId}/movements`)
    return response.data
  }
}

