<template>
  <div class="user-churn-prediction">
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900 mb-2">Churn Prediction</h3>
      <p class="text-sm text-gray-600">Predict the likelihood of a user churning</p>
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
        <Button variant="primary" @click="predictChurn" :loading="isLoading">
          Predict Churn
        </Button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to predict churn</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="predictChurn">Retry</Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !churnData" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Analyzing user data...</span>
    </div>

    <!-- Results -->
    <div v-else-if="churnData" class="space-y-6">
      <!-- Churn Probability Card -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h4 class="text-lg font-semibold mb-4">Churn Probability</h4>
        <div class="flex items-center space-x-6">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">Probability Score</span>
              <span class="text-2xl font-bold" :class="getProbabilityColor(churnData.churnProbability)">
                {{ (churnData.churnProbability * 100).toFixed(1) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                :class="getProbabilityBarColor(churnData.churnProbability)"
                class="h-full transition-all duration-500"
                :style="{ width: `${churnData.churnProbability * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Risk Level -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h4 class="text-lg font-semibold mb-4">Risk Assessment</h4>
        <div class="flex items-center space-x-4">
          <span :class="getRiskBadgeClass(churnData.riskLevel)" class="px-4 py-2 rounded-full text-sm font-medium">
            {{ churnData.riskLevel }} Risk
          </span>
          <div class="text-sm text-gray-600">
            Based on user behavior and order history
          </div>
        </div>
      </div>

      <!-- User Statistics -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h4 class="text-lg font-semibold mb-4">User Statistics</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Days Since Last Order</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ churnData.daysSinceLastOrder === 999 ? 'N/A' : churnData.daysSinceLastOrder }}
            </div>
          </div>
          <div class="border rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Total Orders</div>
            <div class="text-2xl font-bold text-gray-900">{{ churnData.totalOrders }}</div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h4 class="text-lg font-semibold mb-4">Recommendations</h4>
        <div class="space-y-2">
          <div
            v-for="recommendation in recommendations"
            :key="recommendation"
            class="flex items-start space-x-2 text-sm text-gray-700"
          >
            <svg class="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{{ recommendation }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="text-lg font-medium">Enter a user ID to predict churn</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { advancedAnalyticsApi } from '@/api/endpoints/advanced-analytics'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import type { ChurnPrediction } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const userId = ref('')
const churnData = ref<ChurnPrediction | null>(null)

const recommendations = computed(() => {
  if (!churnData.value) return []
  
  const risk = churnData.value.riskLevel
  const daysSince = churnData.value.daysSinceLastOrder
  const totalOrders = churnData.value.totalOrders
  
  const recs: string[] = []
  
  if (risk === 'HIGH') {
    recs.push('Send personalized re-engagement email with special offers')
    recs.push('Consider offering a discount or loyalty reward')
    recs.push('Reach out via customer support to understand concerns')
  } else if (risk === 'MEDIUM') {
    recs.push('Send a reminder email about new products or promotions')
    recs.push('Consider offering a small incentive to encourage return')
  } else {
    recs.push('User is engaged - continue with regular marketing communications')
  }
  
  if (daysSince > 60 && daysSince !== 999) {
    recs.push('User has been inactive for a while - consider win-back campaign')
  }
  
  if (totalOrders === 0) {
    recs.push('New user - focus on first purchase incentives')
  }
  
  return recs
})

const predictChurn = async () => {
  if (!userId.value.trim()) {
    uiStore.showNotification('error', 'Please enter a user ID')
    return
  }

  isLoading.value = true
  error.value = null
  churnData.value = null

  try {
    const response = await advancedAnalyticsApi.getUserChurn(userId.value.trim())
    sendToTerminal('log', '[UserChurnPrediction] API Response:', response)

    if (response.success && response.data) {
      churnData.value = response.data
      error.value = null
    } else {
      const errorMessage = response.error || 'Failed to predict churn'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to predict churn'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[UserChurnPrediction] Error predicting churn:', err)
  } finally {
    isLoading.value = false
  }
}

const getProbabilityColor = (probability: number) => {
  if (probability > 0.7) return 'text-red-600'
  if (probability > 0.4) return 'text-yellow-600'
  return 'text-green-600'
}

const getProbabilityBarColor = (probability: number) => {
  if (probability > 0.7) return 'bg-red-500'
  if (probability > 0.4) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getRiskBadgeClass = (riskLevel: string) => {
  const classes: Record<string, string> = {
    HIGH: 'bg-red-100 text-red-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-green-100 text-green-800'
  }
  return classes[riskLevel] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.user-churn-prediction {
  @apply space-y-6;
}
</style>

