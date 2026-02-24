<template>
  <div class="reorder-point-calculator">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Reorder Point Calculator</h2>
      <p class="text-sm text-gray-600">Calculate optimal reorder point for a product based on demand and lead time</p>
    </div>

    <!-- Input Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-2">Product ID <span class="text-red-500">*</span></label>
          <input
            v-model="productId"
            type="text"
            class="input"
            placeholder="Enter product ID"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Lead Time (days)</label>
          <input
            v-model.number="params.leadTime"
            type="number"
            class="input"
            placeholder="Optional: Lead time in days"
            min="0"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Average Daily Demand</label>
          <input
            v-model.number="params.averageDailyDemand"
            type="number"
            class="input"
            placeholder="Optional: Average daily demand"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Safety Stock</label>
          <input
            v-model.number="params.safetyStock"
            type="number"
            class="input"
            placeholder="Optional: Safety stock quantity"
            min="0"
          />
        </div>
      </div>
      <Button variant="primary" @click="calculateReorderPoint" :loading="isLoading">
        Calculate Reorder Point
      </Button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to calculate reorder point</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="calculateReorderPoint">Retry</Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !result" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Calculating reorder point...</span>
    </div>

    <!-- Results -->
    <div v-else-if="result" class="space-y-6">
      <!-- Reorder Point Card -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Reorder Point Calculation</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="border rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Current Stock</div>
            <div class="text-2xl font-bold" :class="getStockClass(result.currentStock, result.reorderPoint)">
              {{ result.currentStock }}
            </div>
          </div>
          <div class="border rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Reorder Point</div>
            <div class="text-2xl font-bold text-primary-600">{{ result.reorderPoint }}</div>
          </div>
          <div v-if="result.recommendedOrderQuantity" class="border rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Recommended Order</div>
            <div class="text-2xl font-bold text-green-600">{{ result.recommendedOrderQuantity }}</div>
          </div>
          <div v-if="result.safetyStock !== undefined" class="border rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Safety Stock</div>
            <div class="text-2xl font-bold text-gray-900">{{ result.safetyStock }}</div>
          </div>
        </div>
      </div>

      <!-- Status Alert -->
      <div
        :class="getStatusAlertClass(result.currentStock, result.reorderPoint)"
        class="rounded-lg p-4 flex items-center"
      >
        <svg class="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            v-if="result.currentStock <= result.reorderPoint"
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
          <path
            v-else
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <p class="font-medium">
            {{ result.currentStock <= result.reorderPoint ? 'Reorder Required' : 'Stock Level OK' }}
          </p>
          <p class="text-sm mt-1">
            {{ result.currentStock <= result.reorderPoint
              ? `Current stock (${result.currentStock}) is at or below reorder point (${result.reorderPoint}). Consider placing an order.`
              : `Current stock (${result.currentStock}) is above reorder point (${result.reorderPoint}).` }}
          </p>
        </div>
      </div>

      <!-- Additional Metrics -->
      <div v-if="result.leadTime || result.averageDailyDemand" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Calculation Metrics</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="result.leadTime" class="border rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Lead Time</div>
            <div class="text-xl font-bold text-gray-900">{{ result.leadTime }} days</div>
          </div>
          <div v-if="result.averageDailyDemand" class="border rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Average Daily Demand</div>
            <div class="text-xl font-bold text-gray-900">{{ result.averageDailyDemand.toFixed(2) }} units/day</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <p class="text-lg font-medium">Enter a product ID to calculate reorder point</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { inventoryAdvancedApi } from '@/api/endpoints/inventory-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import type { ReorderPointResult } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const productId = ref('')
const params = ref({
  leadTime: undefined as number | undefined,
  averageDailyDemand: undefined as number | undefined,
  safetyStock: undefined as number | undefined
})
const result = ref<ReorderPointResult | null>(null)

const calculateReorderPoint = async () => {
  if (!productId.value.trim()) {
    uiStore.showNotification('error', 'Please enter a product ID')
    return
  }

  isLoading.value = true
  error.value = null
  result.value = null

  try {
    const requestParams: any = {}
    if (params.value.leadTime !== undefined) requestParams.leadTime = params.value.leadTime
    if (params.value.averageDailyDemand !== undefined) requestParams.averageDailyDemand = params.value.averageDailyDemand
    if (params.value.safetyStock !== undefined) requestParams.safetyStock = params.value.safetyStock

    const response = await inventoryAdvancedApi.calculateReorderPoint(productId.value.trim(), Object.keys(requestParams).length > 0 ? requestParams : undefined)
    sendToTerminal('log', '[ReorderPointCalculator] API Response:', response)

    if (response.success && response.data) {
      result.value = response.data
      error.value = null
    } else {
      const errorMessage = response.error || 'Failed to calculate reorder point'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to calculate reorder point'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[ReorderPointCalculator] Error calculating reorder point:', err)
  } finally {
    isLoading.value = false
  }
}

const getStockClass = (currentStock: number, reorderPoint: number) => {
  if (currentStock <= reorderPoint) return 'text-red-600'
  if (currentStock <= reorderPoint * 1.5) return 'text-yellow-600'
  return 'text-green-600'
}

const getStatusAlertClass = (currentStock: number, reorderPoint: number) => {
  if (currentStock <= reorderPoint) {
    return 'bg-red-50 border border-red-200 text-red-800'
  }
  return 'bg-green-50 border border-green-200 text-green-800'
}
</script>

<style scoped>
.reorder-point-calculator {
  @apply space-y-6;
}
</style>

