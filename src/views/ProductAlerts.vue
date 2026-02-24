<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Product Alerts</h1>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <Button @click="loadAlerts" variant="primary">Retry</Button>
      </div>
      
      <div v-else-if="alerts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p class="text-gray-600 mb-4 text-lg">No active alerts</p>
        <p class="text-gray-500 text-sm mb-4">Create alerts to get notified about price drops, restocks, and more.</p>
        <router-link to="/products" class="btn btn-primary inline-flex items-center">
          Browse Products
        </router-link>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="card"
        >
          <div class="flex items-start gap-4">
            <router-link :to="`/products/${alert.productId}`" class="flex-shrink-0">
              <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  :src="alert.product?.images?.[0] || '/placeholder.jpg'"
                  :alt="alert.product?.name || 'Product'"
                  class="w-full h-full object-cover"
                />
              </div>
            </router-link>
            
            <div class="flex-1 min-w-0">
              <router-link :to="`/products/${alert.productId}`">
                <h3 class="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors">
                  {{ alert.product?.name || 'Product' }}
                </h3>
              </router-link>
              
              <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2">
                  <span :class="getTypeBadgeClass(alert.type)" class="px-2 py-1 rounded text-xs font-semibold">
                    {{ getTypeLabel(alert.type) }}
                  </span>
                  <span :class="getStatusClass(alert.status)" class="px-2 py-1 rounded text-xs font-semibold">
                    {{ getStatusLabel(alert.status) }}
                  </span>
                </div>
                
                <div v-if="alert.currentPrice" class="text-sm">
                  <span class="text-gray-600">Current Price: </span>
                  <span class="font-semibold text-primary-600">{{ formatPrice(alert.currentPrice) }}</span>
                </div>
                
                <div v-if="alert.targetPrice" class="text-sm">
                  <span class="text-gray-600">Target Price: </span>
                  <span class="font-semibold">{{ formatPrice(alert.targetPrice) }}</span>
                </div>
                
                <div class="text-xs text-gray-500">
                  Created: {{ formatDate(alert.createdAt) }}
                  <span v-if="alert.triggeredAt"> • Triggered: {{ formatDate(alert.triggeredAt) }}</span>
                </div>
              </div>
              
              <Button
                v-if="alert.status === 'active'"
                variant="secondary"
                size="sm"
                @click="removeAlert(alert.id)"
                :loading="removingId === alert.id"
              >
                Remove Alert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { experienceApi } from '@/api/endpoints/experience'
import { useUIStore } from '@/stores/ui'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import type { ProductAlert } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const uiStore = useUIStore()
const sidebarOpen = ref(false)
const isLoading = ref(false)
const error = ref('')
const alerts = ref<ProductAlert[]>([])
const removingId = ref<string | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'price_drop': 'Price Drop',
    'back_in_stock': 'Back in Stock',
    'new_variant': 'New Variant',
    'custom': 'Custom'
  }
  return labels[type] || type
}

const getTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'price_drop': 'bg-green-100 text-green-800',
    'back_in_stock': 'bg-blue-100 text-blue-800',
    'new_variant': 'bg-purple-100 text-purple-800',
    'custom': 'bg-gray-100 text-gray-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'active': 'Active',
    'triggered': 'Triggered',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'active': 'bg-yellow-100 text-yellow-800',
    'triggered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const loadAlerts = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await experienceApi.getProductAlerts()
    if (response.success && response.data) {
      alerts.value = Array.isArray(response.data) ? response.data : []
    } else {
      error.value = response.error || 'Failed to load alerts'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load alerts'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const removeAlert = async (alertId: string) => {
  // Note: This would require a DELETE endpoint on the backend
  // For now, we'll filter it out from the list
  if (confirm('Remove this alert?')) {
    removingId.value = alertId
    try {
      // TODO: Call DELETE API when available
      alerts.value = alerts.value.filter(alert => alert.id !== alertId)
      uiStore.showNotification('success', 'Alert removed')
    } catch (error: any) {
      uiStore.showNotification('error', error.message || 'Failed to remove alert')
    } finally {
      removingId.value = null
    }
  }
}

onMounted(() => {
  loadAlerts()
})
</script>

