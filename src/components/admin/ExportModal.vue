<template>
  <Modal :is-open="isOpen" @close="$emit('close')">
    <template #header>
      <h2 class="text-2xl font-bold">Export Products</h2>
    </template>
    
    <template #body>
      <div class="space-y-6">
        <!-- Format Selection -->
        <div>
          <label class="block text-sm font-medium mb-2">Export Format</label>
          <select v-model="exportFormat" class="input">
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>
        
        <!-- Filter Options -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium">Filters (Optional)</h3>
          
          <div>
            <label class="block text-sm font-medium mb-2">Status</label>
            <select v-model="filters.status" class="input">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Category</label>
            <select v-model="filters.categoryId" class="input">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Min Price</label>
              <input v-model.number="filters.minPrice" type="number" step="0.01" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Max Price</label>
              <input v-model.number="filters.maxPrice" type="number" step="0.01" class="input" />
            </div>
          </div>
        </div>
        
        <!-- Progress Indicator -->
        <div v-if="exportJobId" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium">Export Status:</span>
            <span :class="getStatusClass(exportStatus)" class="px-2 py-1 rounded">
              {{ exportStatus || 'Processing...' }}
            </span>
          </div>
          <div v-if="exportProgress > 0" class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all"
              :style="{ width: `${exportProgress}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Download Link -->
        <div v-if="downloadUrl" class="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p class="text-green-700 text-sm font-medium mb-2">Export completed!</p>
          <a
            :href="downloadUrl"
            :download="downloadFileName"
            class="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download File
          </a>
        </div>
        
        <!-- Error Display -->
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>
      </div>
    </template>
    
    <template #footer>
      <div class="flex justify-end space-x-4">
        <Button variant="secondary" @click="$emit('close')" :disabled="isProcessing">
          {{ downloadUrl ? 'Close' : 'Cancel' }}
        </Button>
        <Button
          variant="primary"
          @click="handleExport"
          :loading="isProcessing"
          :disabled="isProcessing || !!downloadUrl"
        >
          Export
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { operationalApi } from '@/api/endpoints/operational'
import { productsApi } from '@/api/endpoints/products'
import { useUIStore } from '@/stores/ui'
import Modal from '@/components/common/Modal.vue'
import Button from '@/components/common/Button.vue'
import type { Category } from '@/api/types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const uiStore = useUIStore()
const exportFormat = ref<'csv' | 'json' | 'xlsx'>('csv')
const filters = ref({
  status: '',
  categoryId: '',
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined
})
const categories = ref<Category[]>([])
const isProcessing = ref(false)
const exportJobId = ref<string | null>(null)
const exportStatus = ref<string>('')
const exportProgress = ref(0)
const downloadUrl = ref<string | null>(null)
const downloadFileName = ref<string>('')
const error = ref<string | null>(null)
let statusPollInterval: number | null = null

const loadCategories = async () => {
  try {
    const response = await productsApi.getCategories()
    if (response.success && response.data) {
      categories.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    queued: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const pollExportStatus = async () => {
  if (!exportJobId.value) return
  
  try {
    const response = await operationalApi.getExportStatus(exportJobId.value)
    
    if (response.success && response.data) {
      const data = Array.isArray(response.data) 
        ? response.data.find((job: any) => job.id === exportJobId.value)
        : response.data
      
      if (data) {
        exportStatus.value = data.status || 'processing'
        exportProgress.value = data.progress || 0
        
        if (exportStatus.value === 'completed' && data.downloadUrl) {
          stopPolling()
          downloadUrl.value = data.downloadUrl
          downloadFileName.value = `products-${new Date().toISOString().split('T')[0]}.${exportFormat.value}`
          emit('success')
        } else if (exportStatus.value === 'failed') {
          stopPolling()
          error.value = data.error || 'Export failed'
        }
      }
    }
  } catch (err: any) {
    console.error('Error polling export status:', err)
    // Try direct download if status check fails
    if (exportJobId.value) {
      try {
        const blob = await operationalApi.exportData('products', {
          format: exportFormat.value,
          ...filters.value
        })
        const url = URL.createObjectURL(blob)
        downloadUrl.value = url
        downloadFileName.value = `products-${new Date().toISOString().split('T')[0]}.${exportFormat.value}`
        stopPolling()
        emit('success')
      } catch (downloadErr) {
        stopPolling()
        error.value = err.message || 'Failed to check export status'
      }
    }
  }
}

const startPolling = () => {
  if (statusPollInterval) {
    clearInterval(statusPollInterval)
  }
  statusPollInterval = window.setInterval(pollExportStatus, 2000)
}

const stopPolling = () => {
  if (statusPollInterval) {
    clearInterval(statusPollInterval)
    statusPollInterval = null
  }
}

const handleExport = async () => {
  isProcessing.value = true
  error.value = null
  exportStatus.value = ''
  exportProgress.value = 0
  downloadUrl.value = null
  
  try {
    // Prepare filters
    const exportFilters: any = {
      format: exportFormat.value
    }
    
    if (filters.value.status) {
      exportFilters.status = filters.value.status
    }
    if (filters.value.categoryId) {
      exportFilters.categoryId = filters.value.categoryId
    }
    if (filters.value.minPrice !== undefined) {
      exportFilters.minPrice = filters.value.minPrice
    }
    if (filters.value.maxPrice !== undefined) {
      exportFilters.maxPrice = filters.value.maxPrice
    }
    
    // Try to get export job ID first
    try {
      const response = await operationalApi.exportData('products', exportFilters)
      
      // If response is a blob, download directly
      if (response instanceof Blob) {
        const url = URL.createObjectURL(response)
        downloadUrl.value = url
        downloadFileName.value = `products-${new Date().toISOString().split('T')[0]}.${exportFormat.value}`
        isProcessing.value = false
        emit('success')
        return
      }
      
      // If response has jobId, poll for status
      if (response && typeof response === 'object' && 'jobId' in response) {
        exportJobId.value = (response as any).jobId
        exportStatus.value = 'queued'
        startPolling()
      }
    } catch (err: any) {
      // Fallback: try direct export
      const blob = await operationalApi.exportData('products', exportFilters)
      const url = URL.createObjectURL(blob)
      downloadUrl.value = url
      downloadFileName.value = `products-${new Date().toISOString().split('T')[0]}.${exportFormat.value}`
      isProcessing.value = false
      emit('success')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to export products'
    isProcessing.value = false
    uiStore.showNotification('error', 'Failed to export products')
  }
}

// Cleanup on close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    stopPolling()
    exportJobId.value = null
    exportStatus.value = ''
    exportProgress.value = 0
    downloadUrl.value = null
    error.value = null
  }
})

onMounted(() => {
  loadCategories()
})
</script>

