<template>
  <div class="pre-orders">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Pre-orders</h2>
        <p class="text-sm text-gray-600">Manage pre-orders for upcoming products</p>
      </div>
      <Button variant="primary" @click="showCreateModal = true">
        <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Pre-order
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading pre-orders...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load pre-orders</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadPreOrders">Retry</Button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="preOrders.length === 0" class="text-center py-12 border rounded-lg bg-gray-50">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-500 mb-2">No pre-orders found</p>
      <Button variant="primary" class="mt-4" @click="showCreateModal = true">
        Create Your First Pre-order
      </Button>
    </div>

    <!-- Pre-orders List -->
    <div v-else class="space-y-4">
      <DataTable
        :columns="columns"
        :data="preOrders"
        :actions="true"
        row-key="id"
      >
        <template #cell-product="{ row }">
          <div v-if="row.product">
            <div class="font-medium">{{ row.product.name }}</div>
            <div class="text-sm text-gray-500">{{ row.product.sku }}</div>
          </div>
          <span v-else class="text-gray-400">N/A</span>
        </template>
        <template #cell-quantity="{ value }">
          <span class="font-medium">{{ value }}</span>
        </template>
        <template #cell-status="{ value }">
          <span :class="getStatusClass(value)" class="px-2 py-1 rounded-full text-xs font-medium">
            {{ value }}
          </span>
        </template>
        <template #cell-expectedDate="{ value }">
          <span v-if="value">{{ formatDate(value) }}</span>
          <span v-else class="text-gray-400">Not set</span>
        </template>
        <template #cell-createdAt="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #actions="{ row }">
          <div class="flex items-center space-x-2">
            <button
              v-if="row.status === 'pending'"
              @click="cancelPreOrder(row.id)"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Cancel
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Create Pre-order Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Create Pre-order</h3>
          
          <form @submit.prevent="createPreOrder" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Product ID <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.productId"
                type="text"
                class="input"
                placeholder="Enter product ID"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.quantity"
                type="number"
                class="input"
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            <div v-if="apiError" class="p-3 bg-red-50 border border-red-200 rounded">
              <p class="text-red-800 text-sm">{{ apiError }}</p>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="secondary" @click="closeModal">
                Cancel
              </Button>
              <Button type="submit" variant="primary" :loading="isSubmitting">
                Create Pre-order
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { advancedProductsApi } from '@/api/endpoints/advanced-products'
import { useUIStore } from '@/stores/ui'
import type { PreOrder, CreatePreOrderRequest } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import DataTable from '@/components/admin/DataTable.vue'
import { formatDate } from '@/utils/formatters'

const uiStore = useUIStore()
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const apiError = ref<string | null>(null)
const preOrders = ref<PreOrder[]>([])
const showCreateModal = ref(false)

const form = ref<CreatePreOrderRequest>({
  productId: '',
  quantity: 1
})

const columns = [
  { key: 'product', label: 'Product', sortable: false },
  { key: 'quantity', label: 'Quantity', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'expectedDate', label: 'Expected Date', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true }
]

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    fulfilled: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const loadPreOrders = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await advancedProductsApi.getPreOrders()
    if (response.success && response.data) {
      preOrders.value = response.data
    } else {
      error.value = response.error || 'Failed to load pre-orders'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to load pre-orders'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const createPreOrder = async () => {
  isSubmitting.value = true
  apiError.value = null
  try {
    const response = await advancedProductsApi.createPreOrder(form.value)
    if (response.success) {
      uiStore.showNotification('success', 'Pre-order created successfully')
      closeModal()
      await loadPreOrders()
    } else {
      apiError.value = response.error || 'Failed to create pre-order'
    }
  } catch (err: any) {
    apiError.value = err.response?.data?.error || err.message || 'Failed to create pre-order'
    uiStore.showNotification('error', apiError.value)
  } finally {
    isSubmitting.value = false
  }
}

const cancelPreOrder = async (id: string) => {
  if (!confirm('Are you sure you want to cancel this pre-order?')) return
  
  try {
    // Note: This endpoint might not exist in the API, adjust as needed
    uiStore.showNotification('info', 'Cancel pre-order functionality needs to be implemented in the backend')
  } catch (err: any) {
    uiStore.showNotification('error', 'Failed to cancel pre-order')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  form.value = {
    productId: '',
    quantity: 1
  }
  apiError.value = null
}

onMounted(() => {
  loadPreOrders()
})
</script>

