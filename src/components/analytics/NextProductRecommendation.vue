<template>
  <div class="next-product-recommendation">
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900 mb-2">Next Product Recommendations</h3>
      <p class="text-sm text-gray-600">Get personalized product recommendations for a user</p>
    </div>

    <!-- Input Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-end space-x-4">
        <div class="flex-1">
          <label class="block text-sm font-medium mb-2">User ID <span class="text-red-500">*</span></label>
          <input
            v-model="userId"
            type="text"
            class="input"
            placeholder="Enter user ID"
          />
        </div>
        <Button variant="primary" @click="getRecommendations" :loading="isLoading">
          Get Recommendations
        </Button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to get recommendations</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="getRecommendations">Retry</Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !products.length" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading recommendations...</span>
    </div>

    <!-- Products Grid -->
    <div v-else-if="products.length > 0" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h4 class="text-lg font-semibold mb-4">Recommended Products ({{ products.length }})</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="viewProduct(product.id)"
          >
            <div class="mb-3">
              <h5 class="font-semibold text-gray-900 mb-1">{{ product.name }}</h5>
              <p class="text-sm text-gray-600 line-clamp-2">{{ product.description }}</p>
            </div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-lg font-bold text-primary-600">{{ formatCurrency(parseFloat(product.price)) }}</span>
              <span v-if="product.category" class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {{ product.category.name }}
              </span>
            </div>
            <div v-if="product.inventory && product.inventory.length > 0" class="text-sm text-gray-600">
              Stock: {{ product.inventory[0].stock }}
            </div>
            <div class="mt-3">
              <router-link
                :to="`/products/${product.id}`"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                @click.stop
              >
                View Product →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <p class="text-lg font-medium">Enter a user ID to get product recommendations</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { advancedAnalyticsApi } from '@/api/endpoints/advanced-analytics'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatCurrency } from '@/utils/formatters'
import type { Product } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const userId = ref('')
const products = ref<Product[]>([])

const getRecommendations = async () => {
  if (!userId.value.trim()) {
    uiStore.showNotification('error', 'Please enter a user ID')
    return
  }

  isLoading.value = true
  error.value = null
  products.value = []

  try {
    const response = await advancedAnalyticsApi.getNextProduct(userId.value.trim())
    sendToTerminal('log', '[NextProductRecommendation] API Response:', response)

    if (response.success && response.data) {
      products.value = Array.isArray(response.data) ? response.data : []
      error.value = null
    } else {
      const errorMessage = response.error || 'Failed to get product recommendations'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
      products.value = []
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to get product recommendations'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[NextProductRecommendation] Error getting recommendations:', err)
    products.value = []
  } finally {
    isLoading.value = false
  }
}

const viewProduct = (productId: string) => {
  router.push(`/products/${productId}`)
}
</script>

<style scoped>
.next-product-recommendation {
  @apply space-y-6;
}
</style>

