import apiClient from '../client'
import type { ApiResponse, LegalDocument, PCIComplianceStatus, TaxCalculationRequest, TaxCalculationResponse, NexusLocation } from '../types'

export const complianceApi = {
  // Legal Documents
  getDocument: async (type: string): Promise<ApiResponse<LegalDocument>> => {
    const response = await apiClient.get(`/compliance/documents/${type}`)
    return response.data
  },
  
  // Safe version that returns null for 404s instead of throwing
  getDocumentSafe: async (type: string): Promise<ApiResponse<LegalDocument | null>> => {
    try {
      const response = await apiClient.get(`/compliance/documents/${type}`)
      return response.data
    } catch (error: any) {
      // Return null for 404s (document doesn't exist yet)
      if (error.response?.status === 404) {
        return {
          success: false,
          data: null,
          error: 'Document not found'
        }
      }
      // Re-throw other errors
      throw error
    }
  },
  
  createDocument: async (documentData: Partial<LegalDocument>): Promise<ApiResponse<LegalDocument>> => {
    const response = await apiClient.post('/compliance/documents', documentData)
    return response.data
  },
  
  // User Data Management (GDPR)
  exportUserData: async (userId: string): Promise<Blob> => {
    const response = await apiClient.get(`/compliance/users/${userId}/export`, { responseType: 'blob' })
    return response.data
  },
  
  deleteUserData: async (userId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/compliance/users/${userId}/data`)
    return response.data
  },
  
  // Document Acceptance
  recordAcceptance: async (documentType: string, version: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/compliance/acceptance', { documentType, version })
    return response.data
  },
  
  checkAcceptance: async (documentType: string): Promise<ApiResponse<{ accepted: boolean; version: string }>> => {
    const response = await apiClient.get(`/compliance/acceptance/${documentType}`)
    return response.data
  },
  
  // PCI Compliance (Admin)
  getPCIStatus: async (): Promise<ApiResponse<PCIComplianceStatus>> => {
    const response = await apiClient.get('/compliance/pci/status')
    return response.data
  },
  
  // Tax Calculations (Admin)
  calculateTaxAvalara: async (data: TaxCalculationRequest): Promise<ApiResponse<TaxCalculationResponse>> => {
    const response = await apiClient.post('/compliance/tax/avalara', data)
    return response.data
  },
  
  calculateTaxTaxJar: async (data: TaxCalculationRequest): Promise<ApiResponse<TaxCalculationResponse>> => {
    const response = await apiClient.post('/compliance/tax/taxjar', data)
    return response.data
  },
  
  calculateVATMOSS: async (data: TaxCalculationRequest): Promise<ApiResponse<TaxCalculationResponse>> => {
    const response = await apiClient.post('/compliance/tax/vat-moss', data)
    return response.data
  },
  
  calculateGST: async (data: TaxCalculationRequest): Promise<ApiResponse<TaxCalculationResponse>> => {
    const response = await apiClient.post('/compliance/tax/gst', data)
    return response.data
  },
  
  // Nexus Tracking (Admin)
  trackNexus: async (data: NexusLocation): Promise<ApiResponse<NexusLocation>> => {
    const response = await apiClient.post('/compliance/tax/nexus', data)
    return response.data
  },
  
  // Legacy methods (keeping for backward compatibility)
  exportData: async (): Promise<Blob> => {
    const response = await apiClient.get('/compliance/export', { responseType: 'blob' })
    return response.data
  },
  
  deleteData: async (userId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/compliance/users/${userId}/data`)
    return response.data
  }
}

