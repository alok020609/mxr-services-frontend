import apiClient from '../client'

export interface MailSettingsConfig {
  triggers?: {
    orderPlaced?: boolean
    orderShipped?: boolean
    invoiceCreated?: boolean
    invoiceSent?: boolean
  }
  details?: {
    includeOrderSummary?: boolean
    includeInvoicePdf?: boolean
    includeShippingAddress?: boolean
  }
  contactNotificationEmail?: string | null
}

export interface MailSettingsData {
  id: string
  config: MailSettingsConfig
  updatedAt: string
}

export interface MailSettingsResponse {
  success: boolean
  data?: MailSettingsData
  error?: string
}

export interface MailSettingsUpdateBody {
  triggers?: MailSettingsConfig['triggers']
  details?: MailSettingsConfig['details']
  contactNotificationEmail?: string | null
}

export const adminMailSettingsApi = {
  getMailSettings: async (): Promise<MailSettingsResponse> => {
    const response = await apiClient.get('/admin/mail-settings')
    return response.data
  },

  updateMailSettings: async (body: MailSettingsUpdateBody): Promise<MailSettingsResponse> => {
    const response = await apiClient.put('/admin/mail-settings', body)
    return response.data
  }
}
