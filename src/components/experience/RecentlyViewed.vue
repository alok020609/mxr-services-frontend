<template>
  <div class="recently-viewed">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">Recently Viewed</h3>
      <button
        v-if="products.length > 0"
        @click="clearHistory"
        class="text-sm text-gray-600 hover:text-gray-800"
        :disabled="isClearing"
      >
        Clear History
      </button>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="products.length === 0" class="text-center py-8 text-gray-500">
      <p>No recently viewed products</p>
    </div>
    
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <router-link
        v-for="product in products"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="group"
      >
        <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              :src="product.images?.[0] || '/placeholder.png'"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div class="p-3">
            <h4 class="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {{ product.name }}
            </h4>
            <p class="text-primary-600 font-bold">{{ formatPrice(product.price) }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { experienceApi } from '@/api/endpoints/experience'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const { formatPrice } = usePriceFormatter()
import type { Product } from '@/api/types'

const uiStore = useUIStore()
const authStore = useAuthStore()
const isLoading = ref(false)
const isClearing = ref(false)
const products = ref<Product[]>([])

const loadRecentlyViewed = async () => {
  if (!authStore.isAuthenticated) return
  
  isLoading.value = true
  try {
    const response = await experienceApi.getRecentlyViewed()
    if (response.success && response.data) {
      products.value = Array.isArray(response.data) ? response.data : []
      // Limit to 10 most recent
      products.value = products.value.slice(0, 10)
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load recently viewed')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to load recently viewed')
  } finally {
    isLoading.value = false
  }
}

const clearHistory = async () => {
  // Note: This would require a DELETE endpoint on the backend
  // For now, we'll just clear the local state
  if (confirm('Clear your recently viewed history?')) {
    isClearing.value = true
    products.value = []
    uiStore.showNotification('info', 'Recently viewed history cleared')
    isClearing.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadRecentlyViewed()
  }
})
</script>

