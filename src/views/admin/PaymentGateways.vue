<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 flex items-center">
            <svg class="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Payment Gateway Management
          </h1>
          <p class="text-primary-100">Configure and manage payment gateways</p>
        </div>
        <div class="flex items-center space-x-3">
          <Button 
            variant="primary" 
            @click="showCreateModal = true"
            class="bg-white text-primary-600 hover:bg-primary-50 shadow-lg"
          >
            <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Gateway
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Gateways</p>
            <p class="text-2xl font-bold text-gray-900">{{ gateways.length }}</p>
          </div>
          <div class="bg-blue-100 rounded-full p-3">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Active Gateways</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeGatewaysCount }}</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Inactive Gateways</p>
            <p class="text-2xl font-bold text-gray-900">{{ inactiveGatewaysCount }}</p>
          </div>
          <div class="bg-purple-100 rounded-full p-3">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Gateway Types</p>
            <p class="text-2xl font-bold text-gray-900">{{ uniqueTypesCount }}</p>
          </div>
          <div class="bg-orange-100 rounded-full p-3">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filters Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Gateways</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or type..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              @input="handleSearch"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select 
            v-model="statusFilter" 
            @change="handleSearch" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
      <LoadingSpinner size="md" />
      <span class="ml-3 text-gray-600">Loading payment gateways...</span>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Error loading payment gateways</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadGateways">Retry</Button>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="filteredGateways.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
      <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-500 text-lg mb-2">No payment gateways found</p>
      <p class="text-gray-400 text-sm mb-4">Get started by adding your first payment gateway</p>
      <Button variant="primary" @click="showCreateModal = true">
        Add Payment Gateway
      </Button>
    </div>
    
    <!-- Gateways Table -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <DataTable
        :columns="columns"
        :data="filteredGateways"
        :actions="true"
        row-key="id"
      >
        <template #cell-type="{ row }">
          <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getTypeBadgeClass(row.type)">
            {{ row.type }}
          </span>
        </template>
        
        <template #cell-isActive="{ row }">
          <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
            {{ row.isActive ? 'Active' : 'Inactive' }}
          </span>
        </template>
        
        <template #actions="{ row }">
          <button 
            @click="editGateway(row)" 
            class="text-primary-600 hover:text-primary-800 mr-4 font-medium"
          >
            Edit
          </button>
          <button 
            @click="toggleGatewayStatus(row)" 
            class="text-blue-600 hover:text-blue-800 mr-4 font-medium"
          >
            {{ row.isActive ? 'Deactivate' : 'Activate' }}
          </button>
          <button 
            @click="deleteGateway(row)" 
            class="text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </template>
      </DataTable>
    </div>
    
    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingGateway"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">
            {{ editingGateway ? 'Edit Payment Gateway' : 'Create Payment Gateway' }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <PaymentGatewayForm
          :gateway="editingGateway"
          @submit="handleGatewaySubmit"
          @cancel="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { paymentGatewaysApi } from '@/api/endpoints/payment-gateways'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { extractPaginatedData } from '@/utils/dataNormalizer'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import PaymentGatewayForm from '@/components/payments/PaymentGatewayForm.vue'
import type { PaymentGateway, PaymentGatewayConfig } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)
const gateways = ref<PaymentGateway[]>([])
const showCreateModal = ref(false)
const editingGateway = ref<PaymentGateway | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'isActive', label: 'Status', sortable: true },
  { key: 'supportedCurrencies', label: 'Currencies', sortable: false },
  { key: 'supportedMethods', label: 'Methods', sortable: false }
]

const activeGatewaysCount = computed(() => 
  gateways.value.filter(g => g.isActive).length
)

const inactiveGatewaysCount = computed(() => 
  gateways.value.filter(g => !g.isActive).length
)

const uniqueTypesCount = computed(() => 
  new Set(gateways.value.map(g => g.type)).size
)

const filteredGateways = computed(() => {
  let filtered = [...gateways.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(g => 
      g.name.toLowerCase().includes(query) ||
      g.type.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(g => 
      statusFilter.value === 'active' ? g.isActive : !g.isActive
    )
  }
  
  return filtered
})

const getTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    STRIPE: 'bg-blue-100 text-blue-800',
    RAZORPAY: 'bg-indigo-100 text-indigo-800',
    PAYPAL: 'bg-yellow-100 text-yellow-800',
    PHONEPE: 'bg-purple-100 text-purple-800',
    GPAY: 'bg-green-100 text-green-800',
    PAYTM: 'bg-cyan-100 text-cyan-800',
    PAYU: 'bg-orange-100 text-orange-800',
    UPI: 'bg-teal-100 text-teal-800',
    BANK_TRANSFER: 'bg-gray-100 text-gray-800',
    COD: 'bg-red-100 text-red-800',
    CRYPTO: 'bg-pink-100 text-pink-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const loadGateways = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await paymentGatewaysApi.getPaymentGateways()
    sendToTerminal('log', '[PaymentGateways] API Response:', response)
    
    if (response.success) {
      const { data } = extractPaginatedData(response.data)
      gateways.value = Array.isArray(data) ? data : []
    } else {
      const errorMessage = response.error || 'Failed to load payment gateways'
      uiStore.showNotification('error', errorMessage)
      error.value = errorMessage
      gateways.value = []
    }
  } catch (err: any) {
    const errorMessage = err.message || 'Failed to load payment gateways'
    uiStore.showNotification('error', errorMessage)
    error.value = errorMessage
    sendToTerminal('error', '[PaymentGateways] Error loading gateways:', err)
    gateways.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  // Filtering is handled by computed property
}

const editGateway = (gateway: PaymentGateway) => {
  editingGateway.value = gateway
  showCreateModal.value = true
}

const toggleGatewayStatus = async (gateway: PaymentGateway) => {
  if (!confirm(`Are you sure you want to ${gateway.isActive ? 'deactivate' : 'activate'} this gateway?`)) {
    return
  }
  
  try {
    const response = await paymentGatewaysApi.togglePaymentGateway(gateway.id, !gateway.isActive)
    if (response.success) {
      uiStore.showNotification('success', `Gateway ${gateway.isActive ? 'deactivated' : 'activated'} successfully`)
      await loadGateways()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update gateway status')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to update gateway status')
    sendToTerminal('error', '[PaymentGateways] Error toggling gateway:', err)
  }
}

const deleteGateway = async (gateway: PaymentGateway) => {
  if (!confirm(`Are you sure you want to delete "${gateway.name}"? This action cannot be undone.`)) {
    return
  }
  
  try {
    const response = await paymentGatewaysApi.deletePaymentGateway(gateway.id)
    if (response.success) {
      uiStore.showNotification('success', 'Gateway deleted successfully')
      await loadGateways()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete gateway')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to delete gateway')
    sendToTerminal('error', '[PaymentGateways] Error deleting gateway:', err)
  }
}

const handleGatewaySubmit = async (data: PaymentGatewayConfig) => {
  isSaving.value = true
  try {
    let response
    if (editingGateway.value) {
      response = await paymentGatewaysApi.updatePaymentGateway(editingGateway.value.id, data)
    } else {
      response = await paymentGatewaysApi.createPaymentGateway(data)
    }
    
    if (response.success) {
      uiStore.showNotification('success', `Gateway ${editingGateway.value ? 'updated' : 'created'} successfully`)
      closeModal()
      await loadGateways()
    } else {
      uiStore.showNotification('error', response.error || `Failed to ${editingGateway.value ? 'update' : 'create'} gateway`)
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || `Failed to ${editingGateway.value ? 'update' : 'create'} gateway`)
    sendToTerminal('error', '[PaymentGateways] Error saving gateway:', err)
  } finally {
    isSaving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingGateway.value = null
}

onMounted(() => {
  loadGateways()
})
</script>

