import apiClient from '../client'
import type { ApiResponse, Language, Translation } from '../types'

export const languagesApi = {
  getLanguages: async (): Promise<ApiResponse<Language[]>> => {
    const response = await apiClient.get('/languages')
    return response.data
  },
  
  getLanguage: async (code: string): Promise<ApiResponse<Language>> => {
    const response = await apiClient.get(`/languages/${code}`)
    return response.data
  },
  
  getTranslations: async (locale?: string): Promise<ApiResponse<Translation[]>> => {
    const response = await apiClient.get('/languages/translations', { params: { locale } })
    return response.data
  },
  
  createTranslation: async (translation: Partial<Translation>): Promise<ApiResponse<Translation>> => {
    const response = await apiClient.post('/languages/translations', translation)
    return response.data
  }
}
