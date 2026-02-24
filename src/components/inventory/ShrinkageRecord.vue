<template>
  <div class="shrinkage-record">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Inventory Shrinkage</h2>
      <p class="text-sm text-gray-600">Record inventory loss due to theft, damage, expiration, or other reasons</p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <form @submit.prevent="recordShrinkage" class="space-y-4">
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
            <label class="block text-sm font-medium mb-2">Quantity <span class="text-red-500">*</span></label>
            <input
              v-model.number="form.quantity"
              type="number"
              class="input"
              placeholder="Enter quantity lost"
              min="1"
            />
            <p v-if="errors.quantity" class="text-red-500 text-sm mt-1">{{ errors.quantity }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Reason <span class="text-red-500">*</span></label>
            <select
              v-model="form.reason"
              class="input"
            >
              <option value="">Select reason...</option>
              <option value="theft">Theft</option>
              <option value="damage">Damage</option>
              <option value="expired">Expired</option>
              <option value="spoilage">Spoilage</option>
              <option value="lost">Lost</option>
              <option value="other">Other</option>
            </select>
            <p v-if="errors.reason" class="text-red-500 text-sm mt-1">{{ errors.reason }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Notes (Optional)</label>
            <input
              v-model="form.notes"
              type="text"
              class="input"
              placeholder="Additional details"
            />
          </div>
        </div>

        <div class="flex items-center space-x-4 pt-4">
          <Button type="submit" variant="primary" :loading="isLoading">
            Record Shrinkage
          </Button>
          <Button type="button" variant="secondary" @click="resetForm">
            Clear
          </Button>
        </div>
      </form>
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

    <!-- Summary Statistics (if we track history) -->
    <div v-if="summary" class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold mb-4">Shrinkage Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="border rounded-lg p-4">
          <div class="text-sm text-gray-600 mb-1">Total Shrinkage</div>
          <div class="text-2xl font-bold text-red-600">{{ formatNumber(summary.totalQuantity || 0) }} units</div>
        </div>
        <div class="border rounded-lg p-4">
          <div class="text-sm text-gray-600 mb-1">Total Value Lost</div>
          <div class="text-2xl font-bold text-red-600">{{ formatCurrency(summary.totalValue || 0) }}</div>
        </div>
        <div class="border rounded-lg p-4">
          <div class="text-sm text-gray-600 mb-1">Records This Month</div>
          <div class="text-2xl font-bold text-gray-900">{{ formatNumber(summary.recordsThisMonth || 0) }}</div>
        </div>
        <div class="border rounded-lg p-4">
          <div class="text-sm text-gray-600 mb-1">Most Common Reason</div>
          <div class="text-xl font-bold text-gray-900 capitalize">{{ summary.mostCommonReason || 'N/A' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { inventoryAdvancedApi } from '@/api/endpoints/inventory-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const errors = ref<Record<string, string>>({})
const summary = ref<any>(null)

const form = ref({
  productId: '',
  quantity: 0,
  reason: '',
  notes: ''
})

const recordShrinkage = async () => {
  errors.value = {}
  error.value = null
  successMessage.value = null

  // Validation
  if (!form.value.productId.trim()) {
    errors.value.productId = 'Product ID is required'
  }
  if (form.value.quantity <= 0) {
    errors.value.quantity = 'Quantity must be greater than 0'
  }
  if (!form.value.reason) {
    errors.value.reason = 'Reason is required'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  isLoading.value = true

  try {
    const response = await inventoryAdvancedApi.recordShrinkage({
      productId: form.value.productId.trim(),
      quantity: form.value.quantity,
      reason: form.value.reason,
      notes: form.value.notes.trim() || undefined
    })
    sendToTerminal('log', '[ShrinkageRecord] API Response:', response)

    if (response.success) {
      successMessage.value = response.message || 'Shrinkage recorded successfully'
      uiStore.showNotification('success', successMessage.value)
      
      // If response includes summary, update it
      if (response.data?.summary) {
        summary.value = response.data.summary
      }
      
      resetForm()
    } else {
      const errorMessage = response.error || 'Failed to record shrinkage'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to record shrinkage'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[ShrinkageRecord] Error recording shrinkage:', err)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.value = {
    productId: '',
    quantity: 0,
    reason: '',
    notes: ''
  }
  errors.value = {}
  error.value = null
  // Don't reset successMessage immediately to show it
  setTimeout(() => {
    successMessage.value = null
  }, 5000)
}
</script>

<style scoped>
.shrinkage-record {
  @apply space-y-6;
}
</style>

