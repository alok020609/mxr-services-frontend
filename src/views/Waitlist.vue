<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">My Waitlist</h1>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <Button @click="loadWaitlist" variant="primary">Retry</Button>
      </div>
      
      <div v-else-if="waitlistItems.length === 0" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p class="text-gray-600 mb-4 text-lg">Your waitlist is empty</p>
        <router-link to="/products" class="btn btn-primary inline-flex items-center">
          Browse Products
        </router-link>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in waitlistItems"
          :key="item.id"
          class="card"
        >
          <router-link :to="`/products/${item.productId}`" class="block mb-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
              <img
                :src="item.product?.images?.[0] || '/placeholder.png'"
                :alt="item.product?.name || 'Product'"
                class="w-full h-full object-cover"
              />
            </div>
            <h3 class="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors">
              {{ item.product?.name || 'Product' }}
            </h3>
            <p v-if="item.product?.price" class="text-primary-600 font-bold mb-2">
              {{ formatPrice(item.product.price) }}
            </p>
          </router-link>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Status:</span>
              <span :class="getStatusClass(item.status)" class="px-2 py-1 rounded text-xs font-semibold">
                {{ getStatusLabel(item.status) }}
              </span>
            </div>
            
            <div class="flex items-center justify-between text-sm text-gray-600">
              <span>Added:</span>
              <span>{{ formatDate(item.createdAt) }}</span>
            </div>
            
            <div v-if="item.notifiedAt" class="flex items-center justify-between text-sm text-green-600">
              <span>Notified:</span>
              <span>{{ formatDate(item.notifiedAt) }}</span>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              class="w-full"
              @click="removeFromWaitlist(item.id)"
              :loading="removingId === item.id"
            >
              Remove from Waitlist
            </Button>
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
import type { WaitlistItem } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const uiStore = useUIStore()
const sidebarOpen = ref(false)
const isLoading = ref(false)
const error = ref('')
const waitlistItems = ref<WaitlistItem[]>([])
const removingId = ref<string | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'waiting': 'Waiting',
    'notified': 'Notified',
    'purchased': 'Purchased',
    'removed': 'Removed'
  }
  return labels[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'waiting': 'bg-yellow-100 text-yellow-800',
    'notified': 'bg-green-100 text-green-800',
    'purchased': 'bg-blue-100 text-blue-800',
    'removed': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const loadWaitlist = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await experienceApi.getWaitlist()
    if (response.success && response.data) {
      waitlistItems.value = Array.isArray(response.data) ? response.data : []
    } else {
      error.value = response.error || 'Failed to load waitlist'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load waitlist'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const removeFromWaitlist = async (itemId: string) => {
  // Note: This would require a DELETE endpoint on the backend
  // For now, we'll filter it out from the list
  if (confirm('Remove this item from your waitlist?')) {
    removingId.value = itemId
    try {
      // TODO: Call DELETE API when available
      waitlistItems.value = waitlistItems.value.filter(item => item.id !== itemId)
      uiStore.showNotification('success', 'Removed from waitlist')
    } catch (error: any) {
      uiStore.showNotification('error', error.message || 'Failed to remove from waitlist')
    } finally {
      removingId.value = null
    }
  }
}

onMounted(() => {
  loadWaitlist()
})
</script>

