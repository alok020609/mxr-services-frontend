import apiClient from '../client'
import type { ApiResponse, JobStats, Job } from '../types'

export const jobsApi = {
  getJobStats: async (): Promise<ApiResponse<JobStats>> => {
    const response = await apiClient.get('/jobs/stats')
    return response.data
  },
  
  getJob: async (queueName: string, jobId: string): Promise<ApiResponse<Job>> => {
    const response = await apiClient.get(`/jobs/${queueName}/jobs/${jobId}`)
    return response.data
  },
  
  removeJob: async (queueName: string, jobId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/jobs/${queueName}/jobs/${jobId}`)
    return response.data
  },
  
  retryJob: async (queueName: string, jobId: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/jobs/${queueName}/jobs/${jobId}/retry`)
    return response.data
  }
}
