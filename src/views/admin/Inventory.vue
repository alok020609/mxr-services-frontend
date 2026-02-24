<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Inventory Management</h1>
      
      <div v-if="isLoading" class="mb-4 flex items-center text-gray-600">
        <LoadingSpinner size="sm" />
        <span class="ml-2">Loading inventory...</span>
      </div>
      
      <!-- Error State -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-800 font-medium mb-1">Unable to load inventory</p>
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>
          <Button variant="primary" size="sm" @click="loadInventory">Retry</Button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="inventory.length === 0 && !isLoading" class="text-center py-12 border rounded-lg bg-white">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="text-lg font-medium text-gray-900 mb-2">No inventory items found</p>
        <p class="text-sm text-gray-500">Inventory items will appear here once products are added to the system.</p>
      </div>
      
      <!-- Data Table -->
      <DataTable
        v-else-if="inventory.length > 0"
        :columns="columns"
        :data="inventory"
        :actions="true"
        row-key="productId"
      >
        <template #cell-stock="{ value, row }">
          <span :class="getStockClass(value, row.lowStockThreshold)">
            {{ value }}
          </span>
        </template>
        <template #actions="{ row }">
          <button @click="editStock(row)" class="text-primary-600 mr-4">Update Stock</button>
          <button @click="viewMovements(row.productId)" class="text-blue-600">View Movements</button>
        </template>
      </DataTable>
      
      <!-- Update Stock Modal -->
      <div
        v-if="editingItem"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">Update Stock</h2>
          <form @submit.prevent="handleStockUpdate" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Product</label>
              <input
                :value="editingItem.productName || editingItem.productId"
                class="input"
                disabled
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Current Stock</label>
              <input
                :value="editingItem.stock"
                class="input"
                disabled
              />
            </div>
            <Input
              v-model.number="stockForm.newStock"
              type="number"
              label="New Stock Quantity"
              required
              min="0"
            />
            <Input
              v-model="stockForm.reason"
              label="Reason (optional)"
              placeholder="e.g., Restock, Adjustment, Return"
            />
            <div class="flex justify-end space-x-4">
              <Button type="button" variant="secondary" @click="closeModal">Cancel</Button>
              <Button type="submit" variant="primary" :loading="isSaving">Update</Button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Movements Modal -->
      <div
        v-if="viewingMovements"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeMovementsModal"
      >
        <div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">Inventory Movements</h2>
          <div v-if="movementsLoading" class="flex justify-center py-8">
            <LoadingSpinner />
          </div>
          <div v-else-if="movements.length === 0" class="text-center py-8">
            <p class="text-gray-500">No movements found</p>
          </div>
          <DataTable
            v-else
            :columns="movementColumns"
            :data="movements"
            row-key="id"
          />
          <div class="flex justify-end mt-4">
            <Button variant="secondary" @click="closeMovementsModal">Close</Button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { inventoryApi } from '@/api/endpoints/inventory'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { extractPaginatedData } from '@/utils/dataNormalizer'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const isSaving = ref(false)
const movementsLoading = ref(false)
const inventory = ref<any[]>([])
const movements = ref<any[]>([])
const editingItem = ref<any>(null)
const viewingMovements = ref(false)
const currentProductId = ref<string | null>(null)
const error = ref<string | null>(null)

const columns = [
  { key: 'productName', label: 'Product', sortable: true },
  { key: 'productId', label: 'Product ID', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'lowStockThreshold', label: 'Low Stock Threshold', sortable: true },
  { key: 'reserved', label: 'Reserved', sortable: true },
  { key: 'available', label: 'Available', sortable: true }
]

const movementColumns = [
  { key: 'type', label: 'Type', sortable: true },
  { key: 'quantity', label: 'Quantity', sortable: true },
  { key: 'reason', label: 'Reason', sortable: true },
  { key: 'createdAt', label: 'Date', sortable: true }
]

const stockForm = ref({
  newStock: 0,
  reason: ''
})

const getStockClass = (stock: number, threshold: number = 10) => {
  if (stock <= 0) return 'text-red-600 font-bold'
  if (stock <= threshold) return 'text-yellow-600 font-semibold'
  return 'text-green-600'
}

const loadInventory = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await inventoryApi.getInventory()
    sendToTerminal('log', '[Inventory] API Response:', response)
    
    if (response.success && response.data) {
      // Handle both paginated and non-paginated responses
      const data = extractPaginatedData(response.data)
      inventory.value = Array.isArray(data) ? data : []
      error.value = null
      
      if (inventory.value.length === 0) {
        sendToTerminal('warn', '[Inventory] Empty inventory list received')
      }
    } else {
      sendToTerminal('warn', '[Inventory] Unexpected response format:', response)
      inventory.value = []
      const errorMessage = response.error || 'Failed to load inventory'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to load inventory'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[Inventory] Error loading inventory:', err)
    inventory.value = []
  } finally {
    isLoading.value = false
  }
}

const editStock = (item: any) => {
  editingItem.value = item
  stockForm.value = {
    newStock: item.stock || 0,
    reason: ''
  }
}

const closeModal = () => {
  editingItem.value = null
  stockForm.value = { newStock: 0, reason: '' }
}

const handleStockUpdate = async () => {
  if (!editingItem.value) return
  
  isSaving.value = true
  try {
    const response = await inventoryApi.updateInventory(
      editingItem.value.productId,
      stockForm.value.newStock
    )
    sendToTerminal('log', '[Inventory] Update response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Stock updated successfully')
      closeModal()
      await loadInventory()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update stock')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update stock')
    sendToTerminal('error', '[Inventory] Error updating stock:', error)
  } finally {
    isSaving.value = false
  }
}

const viewMovements = async (productId: string) => {
  currentProductId.value = productId
  viewingMovements.value = true
  movementsLoading.value = true
  
  try {
    const response = await inventoryApi.getMovements(productId)
    sendToTerminal('log', '[Inventory] Movements response:', response)
    
    if (response.success && response.data) {
      movements.value = Array.isArray(response.data) ? response.data : []
    } else {
      movements.value = []
      uiStore.showNotification('error', response.error || 'Failed to load movements')
    }
  } catch (error) {
    uiStore.showNotification('error', 'Failed to load movements')
    sendToTerminal('error', '[Inventory] Error loading movements:', error)
    movements.value = []
  } finally {
    movementsLoading.value = false
  }
}

const closeMovementsModal = () => {
  viewingMovements.value = false
  currentProductId.value = null
  movements.value = []
}

onMounted(() => {
  loadInventory()
})
</script>
