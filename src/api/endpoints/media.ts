import apiClient from '../client'
import type { ApiResponse, MediaUpload, MediaImage, ImageVariant, PaginatedResponse } from '../types'

export const mediaApi = {
  uploadImage: async (file: File): Promise<ApiResponse<MediaImage>> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  
  uploadMultiple: async (files: File[]): Promise<ApiResponse<MediaImage[]>> => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    const response = await apiClient.post('/media/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  
  uploadChunk: async (chunk: Blob, uploadId: string, chunkNumber: number): Promise<ApiResponse> => {
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('uploadId', uploadId)
    formData.append('chunkNumber', chunkNumber.toString())
    const response = await apiClient.post('/media/upload-chunk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  
  getUploadStatus: async (uploadId: string): Promise<ApiResponse<MediaUpload>> => {
    const response = await apiClient.get(`/media/upload-status/${uploadId}`)
    return response.data
  },
  
  getImage: async (imageId: string): Promise<ApiResponse<MediaImage>> => {
    const response = await apiClient.get(`/media/${imageId}`)
    return response.data
  },
  
  deleteImage: async (imageId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/media/${imageId}`)
    return response.data
  },
  
  listImages: async (filters?: any): Promise<ApiResponse<PaginatedResponse<MediaImage>>> => {
    const response = await apiClient.get('/media', { params: filters })
    return response.data
  },
  
  optimizeImage: async (imageId: string): Promise<ApiResponse<MediaImage>> => {
    const response = await apiClient.post(`/media/${imageId}/optimize`)
    return response.data
  },
  
  resizeImage: async (imageId: string, width: number, height: number): Promise<ApiResponse<MediaImage>> => {
    const response = await apiClient.post(`/media/${imageId}/resize`, { width, height })
    return response.data
  },
  
  getImageVariants: async (imageId: string): Promise<ApiResponse<ImageVariant[]>> => {
    const response = await apiClient.get(`/media/${imageId}/variants`)
    return response.data
  }
}
