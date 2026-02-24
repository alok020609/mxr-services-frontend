<template>
  <div class="product-affinity">
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900 mb-2">Product Affinity</h3>
      <p class="text-sm text-gray-600">Predict a user's affinity for a specific product</p>
    </div>

    <!-- Input Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-2">User ID <span class="text-red-500">*</span></label>
          <input
            v-model="userId"
            type="text"
            class="input"
            placeholder="Enter user ID"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Product ID <span class="text-red-500">*</span></label>
          <input
            v-model="productId"
            type="text"
            class="input"
            placeholder="Enter product ID"
          />
        </div>
      </div>
      <Button variant="primary" @click="predictAffinity" :loading="isLoading">
        Predict Affinity
      </Button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to predict affinity</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="predictAffinity">Retry</Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !affinityData" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Analyzing product affinity...</span>
    </div>

    <!-- Results -->
    <div v-else-if="affinityData" class="space-y-6">
      <!-- Affinity Score Card -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h4 class="text-lg font-semibold mb-4">Affinity Score</h4>
        <div class="flex items-center space-x-6">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">Affinity Score</span>
              <span class="text-2xl font-bold" :class="getScoreColor(affinityData.affinityScore)">
                {{ (affinityData.affinityScore * 100).toFixed(1) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                :class="getScoreBarColor(affinityData.affinityScore)"
                class="h-full transition-all duration-500"
                :style="{ width: `${affinityData.affinityScore * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendation Strength -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h4 class="text-lg font-semibold mb-4">Recommendation</h4>
        <div class="flex items-center space-x-4">
          <span :class="getRecommendationBadgeClass(affinityData.recommendation)" class="px-4 py-2 rounded-full text-sm font-medium">
            {{ affinityData.recommendation }} Recommendation
          </span>
          <div class="text-sm text-gray-600">
            Based on user behavior and product characteristics
          </div>
        </div>
      </div>

      <!-- Interpretation -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h4 class="text-lg font-semibold mb-4">Interpretation</h4>
        <div class="text-sm text-gray-700 space-y-2">
          <p v-if="affinityData.recommendation === 'STRONG'">
            <strong>Strong Recommendation:</strong> This product is highly likely to interest this user. Consider prominently featuring it in personalized recommendations, email campaigns, or on the user's homepage.
          </p>
          <p v-else-if="affinityData.recommendation === 'MODERATE'">
            <strong>Moderate Recommendation:</strong> This product may interest the user, but it's not a strong match. Consider including it in broader recommendation lists or category pages.
          </p>
          <p v-else>
            <strong>Weak Recommendation:</strong> This product is unlikely to strongly interest this user. Consider focusing on other products that better match the user's preferences.
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <p class="text-lg font-medium">Enter user and product IDs to predict affinity</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { advancedAnalyticsApi } from '@/api/endpoints/advanced-analytics'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import type { ProductAffinity } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const userId = ref('')
const productId = ref('')
const affinityData = ref<ProductAffinity | null>(null)

const predictAffinity = async () => {
  if (!userId.value.trim() || !productId.value.trim()) {
    uiStore.showNotification('error', 'Please enter both user ID and product ID')
    return
  }

  isLoading.value = true
  error.value = null
  affinityData.value = null

  try {
    const response = await advancedAnalyticsApi.getProductAffinity(userId.value.trim(), productId.value.trim())
    sendToTerminal('log', '[ProductAffinity] API Response:', response)

    if (response.success && response.data) {
      affinityData.value = response.data
      error.value = null
    } else {
      const errorMessage = response.error || 'Failed to predict product affinity'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to predict product affinity'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[ProductAffinity] Error predicting affinity:', err)
  } finally {
    isLoading.value = false
  }
}

const getScoreColor = (score: number) => {
  if (score > 0.5) return 'text-green-600'
  if (score > 0.3) return 'text-yellow-600'
  return 'text-red-600'
}

const getScoreBarColor = (score: number) => {
  if (score > 0.5) return 'bg-green-500'
  if (score > 0.3) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getRecommendationBadgeClass = (recommendation: string) => {
  const classes: Record<string, string> = {
    STRONG: 'bg-green-100 text-green-800',
    MODERATE: 'bg-yellow-100 text-yellow-800',
    WEAK: 'bg-red-100 text-red-800'
  }
  return classes[recommendation] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.product-affinity {
  @apply space-y-6;
}
</style>

