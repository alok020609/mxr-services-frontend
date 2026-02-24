<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Payment Reconciliation</h2>
      <p class="text-gray-600 mb-6">Reconcile payments and identify discrepancies</p>
      
      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            v-model="filters.endDate"
            type="date"
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.status" class="input">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reconciled">Reconciled</option>
            <option value="discrepancy">Discrepancy</option>
          </select>
        </div>
        <div class="flex items-end">
          <Button variant="primary" @click="loadReconciliation" :loading="isLoading" class="w-full">
            Load Report
          </Button>
        </div>
      </div>
      
      <!-- Summary Statistics -->
      <div v-if="report" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p class="text-sm text-gray-600 mb-1">Total Amount</p>
          <p class="text-2xl font-bold text-blue-700">{{ formatPrice(report.summary.totalAmount) }}</p>
        </div>
        <div class="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <p class="text-sm text-gray-600 mb-1">Reconciled</p>
          <p class="text-2xl font-bold text-green-700">{{ formatPrice(report.summary.reconciledAmount) }}</p>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
          <p class="text-sm text-gray-600 mb-1">Pending</p>
          <p class="text-2xl font-bold text-yellow-700">{{ formatPrice(report.summary.pendingAmount) }}</p>
        </div>
        <div class="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
          <p class="text-sm text-gray-600 mb-1">Discrepancies</p>
          <p class="text-2xl font-bold text-red-700">{{ report.summary.discrepancies }}</p>
        </div>
      </div>
      
      <!-- Error -->
      <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg mb-6">
        <p class="text-red-700">{{ error }}</p>
      </div>
      
      <!-- Reconciliation Table -->
      <div v-if="report && report.items.length > 0" class="overflow-x-auto">
        <DataTable
          :columns="columns"
          :data="report.items"
          :actions="false"
          row-key="paymentId"
        >
          <template #cell-amount="{ row }">
            <span class="font-medium">{{ formatPrice(row.amount) }}</span>
          </template>
          <template #cell-status="{ row }">
            <span 
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="getStatusClass(row.status)"
            >
              {{ row.status }}
            </span>
          </template>
          <template #cell-createdAt="{ row }">
            {{ new Date(row.createdAt).toLocaleString() }}
          </template>
          <template #cell-reconciledAt="{ row }">
            {{ row.reconciledAt ? new Date(row.reconciledAt).toLocaleString() : '-' }}
          </template>
        </DataTable>
        
        <div class="mt-4 flex justify-end">
          <Button variant="secondary" @click="exportReport" :disabled="!report">
            Export Report
          </Button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="report && report.items.length === 0" class="text-center py-12 border-2 border-dashed rounded-lg">
        <p class="text-gray-500">No reconciliation data found for the selected filters</p>
      </div>
      
      <!-- Initial State -->
      <div v-else class="text-center py-12 border-2 border-dashed rounded-lg">
        <p class="text-gray-500">Click "Load Report" to view reconciliation data</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { paymentsAdvancedApi } from '@/api/endpoints/payments-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import DataTable from '@/components/admin/DataTable.vue'
import Button from '@/components/common/Button.vue'
import type { ReconciliationReport } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const report = ref<ReconciliationReport | null>(null)

const filters = ref({
  startDate: '',
  endDate: '',
  status: ''
})

const columns = [
  { key: 'paymentId', label: 'Payment ID', sortable: true },
  { key: 'orderId', label: 'Order ID', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'processor', label: 'Processor', sortable: true },
  { key: 'transactionId', label: 'Transaction ID', sortable: false },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'reconciledAt', label: 'Reconciled', sortable: true }
]

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reconciled: 'bg-green-100 text-green-800',
    discrepancy: 'bg-red-100 text-red-800'
  }
  return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const loadReconciliation = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await paymentsAdvancedApi.reconcilePayments({
      startDate: filters.value.startDate || undefined,
      endDate: filters.value.endDate || undefined,
      status: filters.value.status || undefined
    })
    
    if (response.success && response.data) {
      report.value = response.data
      sendToTerminal('log', '[PaymentReconciliation] Success:', response.data)
    } else {
      error.value = response.error || 'Failed to load reconciliation report'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load reconciliation report'
    uiStore.showNotification('error', error.value)
    sendToTerminal('error', '[PaymentReconciliation] Error:', err)
  } finally {
    isLoading.value = false
  }
}

const exportReport = () => {
  if (!report.value) return
  
  // Create CSV content
  const headers = ['Payment ID', 'Order ID', 'Amount', 'Status', 'Processor', 'Transaction ID', 'Created', 'Reconciled']
  const rows = report.value.items.map(item => [
    item.paymentId,
    item.orderId,
    item.amount,
    item.status,
    item.processor,
    item.transactionId || '',
    new Date(item.createdAt).toLocaleString(),
    item.reconciledAt ? new Date(item.reconciledAt).toLocaleString() : ''
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reconciliation-report-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
  
  uiStore.showNotification('success', 'Report exported successfully')
}
</script>

