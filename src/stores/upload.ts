import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mediaApi } from '@/api/endpoints/media'
import type { MediaImage } from '@/api/types'

export interface UploadState {
  uploadId: string
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: MediaImage
  error?: string
  uploadedBytes?: number
  totalBytes?: number
  estimatedTimeRemaining?: number
}

export const useUploadStore = defineStore('upload', () => {
  // State
  const uploads = ref<Map<string, UploadState>>(new Map())
  const uploadHistory = ref<UploadState[]>([])

  // Getters
  const activeUploads = computed(() => {
    return Array.from(uploads.value.values()).filter(
      upload => upload.status === 'pending' || upload.status === 'uploading' || upload.status === 'processing'
    )
  })

  const completedUploads = computed(() => {
    return Array.from(uploads.value.values()).filter(
      upload => upload.status === 'completed'
    )
  })

  const failedUploads = computed(() => {
    return Array.from(uploads.value.values()).filter(
      upload => upload.status === 'failed'
    )
  })

  // Actions
  function addUpload(uploadId: string, file: File) {
    const uploadState: UploadState = {
      uploadId,
      file,
      status: 'pending',
      progress: 0
    }
    uploads.value.set(uploadId, uploadState)
    return uploadState
  }

  function updateProgress(uploadId: string, progress: number, additionalData?: {
    uploadedBytes?: number
    totalBytes?: number
    estimatedTimeRemaining?: number
  }) {
    const upload = uploads.value.get(uploadId)
    if (upload) {
      upload.progress = progress
      upload.status = 'uploading'
      if (additionalData) {
        if (additionalData.uploadedBytes !== undefined) {
          upload.uploadedBytes = additionalData.uploadedBytes
        }
        if (additionalData.totalBytes !== undefined) {
          upload.totalBytes = additionalData.totalBytes
        }
        if (additionalData.estimatedTimeRemaining !== undefined) {
          upload.estimatedTimeRemaining = additionalData.estimatedTimeRemaining
        }
      }
    }
  }

  function setProcessing(uploadId: string) {
    const upload = uploads.value.get(uploadId)
    if (upload) {
      upload.status = 'processing'
    }
  }

  function completeUpload(uploadId: string, result: MediaImage) {
    const upload = uploads.value.get(uploadId)
    if (upload) {
      upload.status = 'completed'
      upload.progress = 100
      upload.result = result
      upload.error = undefined
      
      // Move to history
      uploadHistory.value.push({ ...upload })
      
      // Remove from active uploads after a delay
      setTimeout(() => {
        uploads.value.delete(uploadId)
      }, 5000)
    }
  }

  function failUpload(uploadId: string, error: string) {
    const upload = uploads.value.get(uploadId)
    if (upload) {
      upload.status = 'failed'
      upload.error = error
      
      // Move to history
      uploadHistory.value.push({ ...upload })
      
      // Remove from active uploads after a delay
      setTimeout(() => {
        uploads.value.delete(uploadId)
      }, 10000)
    }
  }

  function cancelUpload(uploadId: string) {
    const upload = uploads.value.get(uploadId)
    if (upload) {
      upload.status = 'failed'
      upload.error = 'Upload cancelled by user'
      uploads.value.delete(uploadId)
    }
  }

  async function pollUploadStatus(uploadId: string) {
    try {
      const response = await mediaApi.getUploadStatus(uploadId)
      if (response.success && response.data) {
        const status = response.data
        
        if (status.status === 'completed') {
          // Upload completed, but we need the image data
          // This might need to be handled differently based on the API response
          const upload = uploads.value.get(uploadId)
          if (upload) {
            completeUpload(uploadId, upload.result || ({} as MediaImage))
          }
        } else if (status.status === 'failed') {
          failUpload(uploadId, status.error || 'Upload failed')
        } else {
          updateProgress(uploadId, status.progress, {
            uploadedBytes: status.uploadedBytes,
            totalBytes: status.totalBytes,
            estimatedTimeRemaining: status.estimatedTimeRemaining
          })
          
          if (status.status === 'processing') {
            setProcessing(uploadId)
          }
        }
      }
    } catch (error: any) {
      failUpload(uploadId, error.message || 'Failed to get upload status')
    }
  }

  function clearHistory() {
    uploadHistory.value = []
  }

  function getUpload(uploadId: string): UploadState | undefined {
    return uploads.value.get(uploadId)
  }

  return {
    // State
    uploads: computed(() => uploads.value),
    uploadHistory,
    // Getters
    activeUploads,
    completedUploads,
    failedUploads,
    // Actions
    addUpload,
    updateProgress,
    setProcessing,
    completeUpload,
    failUpload,
    cancelUpload,
    pollUploadStatus,
    clearHistory,
    getUpload
  }
})

