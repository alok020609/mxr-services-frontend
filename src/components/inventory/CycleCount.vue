<template>
  <div class="cycle-count">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Cycle Count</h2>
      <p class="text-sm text-gray-600">Record physical inventory count for cycle counting</p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <form @submit.prevent="recordCycleCount" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Product ID <span class="text-red-500">*</span></label>
            <input
              v-model="form.productId"
              type="text"
              class="input"
              placeholder="Enter product ID"
            />
            <p v-if="errors.productId" class="text-red-500 text-sm mt-1">{{ errors.productId }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Counted Quantity <span class="text-red-500">*</span></label>
            <input
              v-model.number="form.countedQuantity"
              type="number"
              class="input"
              placeholder="Enter counted quantity"
              min="0"
            />
            <p v-if="errors.countedQuantity" class="text-red-500 text-sm mt-1">{{ errors.countedQuantity }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Location (Optional)</label>
            <input
              v-model="form.location"
              type="text"
              class="input"
              placeholder="e.g., Warehouse A, Shelf B3"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              v-model="form.notes"
              class="input"
              rows="3"
              placeholder="Additional notes about the count"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center space-x-4 pt-4">
          <Button type="submit" variant="primary" :loading="isLoading">
            Record Cycle Count
          </Button>
          <Button type="button" variant="secondary" @click="resetForm">
            Clear
          </Button>
        </div>
      </form>
    </div>

    <!-- Results Display -->
    <div v-if="result" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Cycle Count Results</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="border rounded-lg p-4">
          <div class="text-sm text-gray-600 mb-1">System Quantity</div>
          <div class="text-2xl font-bold text-gray-900">{{ result.systemQuantity ?? 'N/A' }}</div>
        </div>
        <div class="border rounded-lg p-4">
          <div class="text-sm text-gray-600 mb-1">Counted Quantity</div>
          <div class="text-2xl font-bold text-blue-600">{{ result.countedQuantity }}</div>
        </div>
        <div class="border rounded-lg p-4">
          <div class="text-sm text-gray-600 mb-1">Variance</div>
          <div class="text-2xl font-bold" :class="getVarianceClass(result.variance || 0)">
            {{ result.variance !== undefined ? (result.variance > 0 ? '+' : '') + result.variance : 'N/A' }}
          </div>
        </div>
      </div>

      <!-- Variance Alert -->
      <div v-if="result.variance !== undefined && result.variance !== 0" :class="getVarianceAlertClass(result.variance)" class="mt-4 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              v-if="result.variance < 0"
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
            <path
              v-else
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <p class="font-medium">
              {{ result.variance < 0 ? 'Stock Shortage Detected' : 'Stock Surplus Detected' }}
            </p>
            <p class="text-sm mt-1">
              {{ result.variance < 0
                ? `Counted quantity is ${Math.abs(result.variance)} units less than system quantity.`
                : `Counted quantity is ${result.variance} units more than system quantity.` }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <p class="text-green-800">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { inventoryAdvancedApi } from '@/api/endpoints/inventory-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import type { CycleCount } from '@/api/types'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const errors = ref<Record<string, string>>({})
const result = ref<CycleCount | null>(null)

const form = ref({
  productId: '',
  countedQuantity: 0,
  location: '',
  notes: ''
})

const recordCycleCount = async () => {
  errors.value = {}
  error.value = null
  successMessage.value = null
  result.value = null

  // Validation
  if (!form.value.productId.trim()) {
    errors.value.productId = 'Product ID is required'
  }
  if (form.value.countedQuantity < 0) {
    errors.value.countedQuantity = 'Counted quantity must be 0 or greater'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  isLoading.value = true

  try {
    const response = await inventoryAdvancedApi.recordCycleCount({
      productId: form.value.productId.trim(),
      countedQuantity: form.value.countedQuantity,
      location: form.value.location.trim() || undefined,
      notes: form.value.notes.trim() || undefined
    })
    sendToTerminal('log', '[CycleCount] API Response:', response)

    if (response.success && response.data) {
      result.value = response.data
      successMessage.value = response.message || 'Cycle count recorded successfully'
      uiStore.showNotification('success', successMessage.value)
    } else {
      const errorMessage = response.error || 'Failed to record cycle count'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to record cycle count'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[CycleCount] Error recording cycle count:', err)
  } finally {
    isLoading.value = false
  }
}

const getVarianceClass = (variance: number) => {
  if (variance < 0) return 'text-red-600'
  if (variance > 0) return 'text-green-600'
  return 'text-gray-600'
}

const getVarianceAlertClass = (variance: number) => {
  if (variance < 0) {
    return 'bg-red-50 border border-red-200 text-red-800'
  }
  return 'bg-yellow-50 border border-yellow-200 text-yellow-800'
}

const resetForm = () => {
  form.value = {
    productId: '',
    countedQuantity: 0,
    location: '',
    notes: ''
  }
  errors.value = {}
  error.value = null
  successMessage.value = null
  result.value = null
}
</script>

<style scoped>
.cycle-count {
  @apply space-y-6;
}
</style>

