<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Saved Payment Methods</h2>
        <Button variant="primary" @click="showAddModal = true">
          + Add Payment Method
        </Button>
      </div>
      
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <LoadingSpinner size="md" />
        <span class="ml-3 text-gray-600">Loading payment methods...</span>
      </div>
      
      <div v-else-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
        <p class="text-red-700">{{ error }}</p>
        <Button variant="secondary" size="sm" @click="loadMethods" class="mt-2">
          Retry
        </Button>
      </div>
      
      <div v-else-if="methods.length === 0" class="text-center py-12 border-2 border-dashed rounded-lg">
        <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <p class="text-gray-500 mb-2">No saved payment methods</p>
        <p class="text-gray-400 text-sm mb-4">Add a payment method to use it for faster checkout</p>
        <Button variant="primary" @click="showAddModal = true">
          Add Payment Method
        </Button>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="method in methods"
          :key="method.id"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          :class="method.isDefault ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ getMethodDisplayName(method) }}</p>
                <p v-if="method.last4" class="text-sm text-gray-500">**** **** **** {{ method.last4 }}</p>
                <p v-if="method.expiryMonth && method.expiryYear" class="text-sm text-gray-500">
                  Expires {{ method.expiryMonth }}/{{ method.expiryYear }}
                </p>
              </div>
            </div>
            <div v-if="method.isDefault" class="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded">
              Default
            </div>
          </div>
          
          <div class="flex justify-end space-x-2 mt-4">
            <button
              v-if="!method.isDefault"
              @click="setDefault(method.id)"
              class="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Set as Default
            </button>
            <button
              @click="deleteMethod(method.id)"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add Payment Method Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeAddModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Add Payment Method</h3>
          <button @click="closeAddModal" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleAddMethod" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Payment Method Type <span class="text-red-500">*</span>
            </label>
            <select v-model="addForm.type" class="input" required>
              <option value="">Select type</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Token <span class="text-red-500">*</span>
            </label>
            <input
              v-model="addForm.token"
              type="text"
              placeholder="Payment method token"
              class="input"
              required
            />
            <p class="text-gray-500 text-xs mt-1">Token from payment gateway (e.g., Stripe token)</p>
          </div>
          
          <div v-if="addFormError" class="p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <p class="text-red-700 text-sm">{{ addFormError }}</p>
          </div>
          
          <div class="flex justify-end space-x-4">
            <Button type="button" variant="secondary" @click="closeAddModal">Cancel</Button>
            <Button type="submit" variant="primary" :loading="isAdding">
              Add Method
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { paymentsAdvancedApi } from '@/api/endpoints/payments-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { SavedPaymentMethod } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const isAdding = ref(false)
const error = ref<string | null>(null)
const addFormError = ref<string | null>(null)
const methods = ref<SavedPaymentMethod[]>([])
const showAddModal = ref(false)

const addForm = ref({
  type: '',
  token: '',
  metadata: {}
})

const getMethodDisplayName = (method: SavedPaymentMethod) => {
  if (method.brand) {
    return method.brand.charAt(0).toUpperCase() + method.brand.slice(1)
  }
  return method.type.charAt(0).toUpperCase() + method.type.slice(1)
}

const loadMethods = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await paymentsAdvancedApi.getSavedPaymentMethods()
    
    if (response.success && response.data) {
      methods.value = Array.isArray(response.data) ? response.data : []
      sendToTerminal('log', '[SavedPaymentMethods] Loaded:', methods.value)
    } else {
      error.value = response.error || 'Failed to load payment methods'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load payment methods'
    sendToTerminal('error', '[SavedPaymentMethods] Error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleAddMethod = async () => {
  addFormError.value = null
  isAdding.value = true
  
  try {
    const response = await paymentsAdvancedApi.savePaymentMethod({
      type: addForm.value.type,
      token: addForm.value.token,
      metadata: addForm.value.metadata
    })
    
    if (response.success && response.data) {
      uiStore.showNotification('success', 'Payment method added successfully')
      closeAddModal()
      await loadMethods()
    } else {
      addFormError.value = response.error || 'Failed to add payment method'
    }
  } catch (err: any) {
    addFormError.value = err.message || 'Failed to add payment method'
    sendToTerminal('error', '[SavedPaymentMethods] Error adding:', err)
  } finally {
    isAdding.value = false
  }
}

const setDefault = async (id: string) => {
  // Note: The API might need a separate endpoint for setting default
  // For now, we'll just show a notification
  uiStore.showNotification('info', 'Setting default payment method...')
  // In a real implementation, you'd call an API endpoint here
}

const deleteMethod = async (id: string) => {
  if (!confirm('Are you sure you want to delete this payment method?')) {
    return
  }
  
  // Note: The API might need a separate endpoint for deleting
  // For now, we'll just show a notification
  uiStore.showNotification('info', 'Deleting payment method...')
  // In a real implementation, you'd call an API endpoint here
  await loadMethods()
}

const closeAddModal = () => {
  showAddModal.value = false
  addForm.value = {
    type: '',
    token: '',
    metadata: {}
  }
  addFormError.value = null
}

onMounted(() => {
  loadMethods()
})
</script>

