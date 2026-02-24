<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Payouts</h1>
    </div>
    
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" />
      <span class="ml-2 text-gray-600">Loading payouts...</span>
    </div>
    
    <div v-else-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg mb-6">
      <p class="text-red-700 font-medium">{{ error }}</p>
      <button 
        @click="loadPayouts" 
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
    
    <div v-else-if="payouts.length === 0" class="text-center py-12 border rounded-lg">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-500 font-medium">No payouts yet</p>
      <p class="text-sm text-gray-400 mt-1">Payouts will appear here once you start earning</p>
    </div>
    
    <div v-else class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card">
          <p class="text-sm font-medium text-gray-600 mb-2">Total Earnings</p>
          <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(totalEarnings) }}</p>
        </div>
        <div class="card">
          <p class="text-sm font-medium text-gray-600 mb-2">Pending Payouts</p>
          <p class="text-3xl font-bold text-orange-600">{{ formatCurrency(pendingAmount) }}</p>
        </div>
        <div class="card">
          <p class="text-sm font-medium text-gray-600 mb-2">Paid Out</p>
          <p class="text-3xl font-bold text-green-600">{{ formatCurrency(paidAmount) }}</p>
        </div>
      </div>
      
      <!-- Payouts Table -->
      <div class="card">
        <h2 class="text-xl font-bold mb-6">Payout History</h2>
        <DataTable
          :columns="columns"
          :data="payouts"
          row-key="id"
        >
          <template #cell-amount="{ value }">
            <span class="font-semibold">{{ formatCurrency(value) }}</span>
          </template>
          <template #cell-status="{ value }">
            <span :class="getStatusClass(value)" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ value }}
            </span>
          </template>
          <template #cell-date="{ value }">
            <span class="text-sm text-gray-600">{{ formatDate(value) }}</span>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { vendorApi } from '@/api/endpoints/vendor'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatCurrency as formatCurrencyUtil } from '@/utils/formatters'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const payouts = ref<any[]>([])
const error = ref<string | null>(null)

const formatCurrency = formatCurrencyUtil

const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'method', label: 'Payment Method', sortable: true }
]

const totalEarnings = computed(() => {
  return payouts.value.reduce((sum, payout) => sum + (payout.amount || 0), 0)
})

const pendingAmount = computed(() => {
  return payouts.value
    .filter(p => p.status?.toLowerCase() === 'pending')
    .reduce((sum, payout) => sum + (payout.amount || 0), 0)
})

const paidAmount = computed(() => {
  return payouts.value
    .filter(p => p.status?.toLowerCase() === 'paid' || p.status?.toLowerCase() === 'completed')
    .reduce((sum, payout) => sum + (payout.amount || 0), 0)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date)
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const loadPayouts = async () => {
  error.value = null
  
  try {
    isLoading.value = true
    
    const response = await vendorApi.getPayouts()
    
    sendToTerminal('log', '[Vendor Payouts] API response:', response)
    
    if (response && response.success && response.data) {
      payouts.value = Array.isArray(response.data) ? response.data : []
      sendToTerminal('log', '[Vendor Payouts] Payouts data:', payouts.value)
    } else {
      error.value = response?.error || 'Unable to load payouts'
      uiStore.showNotification('error', 'Failed to load payouts')
    }
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load payouts'
    uiStore.showNotification('error', 'Failed to load payouts')
    sendToTerminal('error', '[Vendor Payouts] Error loading payouts:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadPayouts()
})
</script>

