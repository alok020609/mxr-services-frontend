import apiClient from '../client'
import type { Product, Category, ProductFilters, CreateProductRequest, ApiResponse, PaginatedResponse } from '../types'

export const productsApi = {
  // Get products list
  getProducts: async (filters?: ProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const response = await apiClient.get('/products/', { params: filters })
    return response.data
  },
  
  // Search products
  searchProducts: async (query: string, filters?: ProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const response = await apiClient.get('/products/search', { params: { q: query, ...filters } })
    return response.data
  },
  
  // Get product by ID
  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  },
  
  // Create product (Admin)
  createProduct: async (product: CreateProductRequest): Promise<ApiResponse<Product>> => {
    const response = await apiClient.post('/products/', product)
    return response.data
  },
  
  // Update product (Admin)
  updateProduct: async (id: string, product: Partial<CreateProductRequest>): Promise<ApiResponse<Product>> => {
    const response = await apiClient.put(`/products/${id}`, product)
    return response.data
  },
  
  // Delete product (Admin)
  deleteProduct: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/products/${id}`)
    return response.data
  },
  
  // Categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get('/products/categories')
    return response.data
  },
  
  getCategory: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await apiClient.get(`/products/categories/${id}`)
    return response.data
  },
  
  createCategory: async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Category>> => {
    const response = await apiClient.post('/products/categories', category)
    return response.data
  },
  
  updateCategory: async (id: string, category: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response = await apiClient.put(`/products/categories/${id}`, category)
    return response.data
  },
  
  deleteCategory: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/products/categories/${id}`)
    return response.data
  },
  
  // Product Image Management
  uploadProductImages: async (
    productId: string,
    files: File[],
    setAsPrimary?: number
  ): Promise<ApiResponse<any>> => {
    const formData = new FormData()
    
    files.forEach(file => {
      formData.append('images', file)
    })
    
    if (setAsPrimary !== undefined) {
      formData.append('setAsPrimary', String(setAsPrimary))
    }
    
    const response = await apiClient.post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  
  reorderProductImages: async (
    productId: string,
    imageIds: string[]
  ): Promise<ApiResponse> => {
    const response = await apiClient.put(`/products/${productId}/images/reorder`, {
      imageIds
    })
    return response.data
  },
  
  setPrimaryImage: async (
    productId: string,
    imageId: string
  ): Promise<ApiResponse> => {
    const response = await apiClient.put(`/products/${productId}/images/${imageId}/set-primary`)
    return response.data
  },
  
  deleteProductImage: async (
    productId: string,
    imageId: string
  ): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/products/${productId}/images/${imageId}`)
    return response.data
  }
}

