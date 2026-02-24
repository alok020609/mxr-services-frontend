<template>
  <div class="stock-transfer">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Stock Transfer</h2>
      <p class="text-sm text-gray-600">Transfer stock between locations or warehouses</p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <form @submit.prevent="transferStock" class="space-y-4">
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
              placeholder="Enter quantity"
              min="1"
            />
            <p v-if="errors.quantity" class="text-red-500 text-sm mt-1">{{ errors.quantity }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">From Location <span class="text-red-500">*</span></label>
            <input
              v-model="form.fromLocation"
              type="text"
              class="input"
              placeholder="e.g., Warehouse A, Store 1"
            />
            <p v-if="errors.fromLocation" class="text-red-500 text-sm mt-1">{{ errors.fromLocation }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">To Location <span class="text-red-500">*</span></label>
            <input
              v-model="form.toLocation"
              type="text"
              class="input"
              placeholder="e.g., Warehouse B, Store 2"
            />
            <p v-if="errors.toLocation" class="text-red-500 text-sm mt-1">{{ errors.toLocation }}</p>
            <p v-if="errors.locationMatch" class="text-red-500 text-sm mt-1">{{ errors.locationMatch }}</p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-2">Reason (Optional)</label>
            <input
              v-model="form.reason"
              type="text"
              class="input"
              placeholder="e.g., Restocking, Redistribution"
            />
          </div>
        </div>

        <div class="flex items-center space-x-4 pt-4">
          <Button type="submit" variant="primary" :loading="isLoading">
            Transfer Stock
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { inventoryAdvancedApi } from '@/api/endpoints/inventory-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const errors = ref<Record<string, string>>({})

const form = ref({
  productId: '',
  fromLocation: '',
  toLocation: '',
  quantity: 0,
  reason: ''
})

const transferStock = async () => {
  errors.value = {}
  error.value = null
  successMessage.value = null

  // Validation
  if (!form.value.productId.trim()) {
    errors.value.productId = 'Product ID is required'
  }
  if (!form.value.fromLocation.trim()) {
    errors.value.fromLocation = 'From location is required'
  }
  if (!form.value.toLocation.trim()) {
    errors.value.toLocation = 'To location is required'
  }
  if (form.value.fromLocation.trim() === form.value.toLocation.trim()) {
    errors.value.locationMatch = 'From and To locations must be different'
  }
  if (form.value.quantity <= 0) {
    errors.value.quantity = 'Quantity must be greater than 0'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  isLoading.value = true

  try {
    const response = await inventoryAdvancedApi.transferStock({
      productId: form.value.productId.trim(),
      fromLocation: form.value.fromLocation.trim(),
      toLocation: form.value.toLocation.trim(),
      quantity: form.value.quantity,
      reason: form.value.reason.trim() || undefined
    })
    sendToTerminal('log', '[StockTransfer] API Response:', response)

    if (response.success) {
      successMessage.value = response.message || 'Stock transferred successfully'
      uiStore.showNotification('success', successMessage.value)
      resetForm()
    } else {
      const errorMessage = response.error || 'Failed to transfer stock'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to transfer stock'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[StockTransfer] Error transferring stock:', err)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.value = {
    productId: '',
    fromLocation: '',
    toLocation: '',
    quantity: 0,
    reason: ''
  }
  errors.value = {}
  error.value = null
  successMessage.value = null
}
</script>

<style scoped>
.stock-transfer {
  @apply space-y-6;
}
</style>

