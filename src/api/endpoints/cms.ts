import apiClient from '../client'
import type { ApiResponse, CMSPage, BlogPost, Banner } from '../types'

export const cmsApi = {
  getPages: async (): Promise<ApiResponse<CMSPage[]>> => {
    const response = await apiClient.get('/cms/pages')
    return response.data
  },
  
  getPage: async (slug: string): Promise<ApiResponse<CMSPage>> => {
    const response = await apiClient.get(`/cms/pages/${slug}`)
    return response.data
  },
  
  getBlog: async (): Promise<ApiResponse<BlogPost[]>> => {
    const response = await apiClient.get('/cms/blog')
    return response.data
  },
  
  getBlogPost: async (slug: string): Promise<ApiResponse<BlogPost>> => {
    const response = await apiClient.get(`/cms/blog/${slug}`)
    return response.data
  },
  
  getBanners: async (): Promise<ApiResponse<Banner[]>> => {
    const response = await apiClient.get('/cms/banners')
    return response.data
  },
  
  // Admin operations
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
  }
}

