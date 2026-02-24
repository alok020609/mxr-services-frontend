<template>
  <div class="digital-products">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Digital Products</h2>
      <p class="text-sm text-gray-600">View and manage digital products available for download</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading digital products...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load digital products</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadDigitalProducts">Retry</Button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="digitalProducts.length === 0" class="text-center py-12 border rounded-lg bg-gray-50">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p class="text-gray-500 mb-2">No digital products found</p>
      <p class="text-sm text-gray-400">Digital products will appear here once they are created</p>
    </div>

    <!-- Products List -->
    <div v-else class="space-y-4">
      <div
        v-for="product in digitalProducts"
        :key="product.id"
        class="bg-white rounded-lg shadow-md p-6 border border-gray-200"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-4">{{ product.description }}</p>
            <div class="flex flex-wrap gap-4 text-sm text-gray-500">
              <span v-if="product.fileSize">
                <strong>File Size:</strong> {{ formatFileSize(product.fileSize) }}
              </span>
              <span v-if="product.fileType">
                <strong>Type:</strong> {{ product.fileType }}
              </span>
              <span v-if="product.downloadCount !== undefined">
                <strong>Downloads:</strong> {{ product.downloadCount }}
              </span>
              <span v-if="product.maxDownloads">
                <strong>Max Downloads:</strong> {{ product.maxDownloads }}
              </span>
            </div>
          </div>
          <div class="ml-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
              <input
                v-model="downloadOrders[product.id]"
                type="text"
                class="input text-sm"
                placeholder="Enter order ID"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              @click="downloadProduct(product.id, downloadOrders[product.id])"
              :loading="downloading[product.id]"
              :disabled="!downloadOrders[product.id]"
            >
              <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { advancedProductsApi } from '@/api/endpoints/advanced-products'
import { productsApi } from '@/api/endpoints/products'
import { useUIStore } from '@/stores/ui'
import type { DigitalProduct, Product } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const digitalProducts = ref<DigitalProduct[]>([])
const downloadOrders = ref<Record<string, string>>({})
const downloading = ref<Record<string, boolean>>({})

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const loadDigitalProducts = async () => {
  isLoading.value = true
  error.value = null
  try {
    // Fetch all products and filter for digital products
    // Note: This is a simplified approach - in production, you might want a specific endpoint
    const response = await productsApi.getProducts({ limit: 1000 })
    if (response.success && response.data) {
      // Filter products that might be digital (you may need to adjust this logic)
      // For now, we'll show all products and let the user select which ones are digital
      digitalProducts.value = (response.data as any[]).map(p => ({
        ...p,
        fileSize: (p as any).fileSize,
        fileType: (p as any).fileType,
        downloadCount: (p as any).downloadCount || 0,
        maxDownloads: (p as any).maxDownloads
      })) as DigitalProduct[]
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to load digital products'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const downloadProduct = async (productId: string, orderId: string) => {
  if (!orderId) {
    uiStore.showNotification('error', 'Please enter an order ID')
    return
  }

  downloading.value[productId] = true
  try {
    const blob = await advancedProductsApi.downloadDigitalProduct(productId, orderId)
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Try to get filename from product or use default
    const product = digitalProducts.value.find(p => p.id === productId)
    link.download = product?.name || `digital-product-${productId}.zip`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    uiStore.showNotification('success', 'Download started successfully')
    
    // Refresh product to update download count
    await loadDigitalProducts()
  } catch (err: any) {
    const errorMsg = err.response?.data?.error || err.message || 'Failed to download product'
    uiStore.showNotification('error', errorMsg)
  } finally {
    downloading.value[productId] = false
  }
}

onMounted(() => {
  loadDigitalProducts()
})
</script>

