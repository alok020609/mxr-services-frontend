<template>
  <div class="space-y-6">
    <!-- Modern Header Section -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 flex items-center">
            <svg class="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Order Management
          </h1>
          <p class="text-primary-100">Manage all orders, statuses, and payments</p>
        </div>
        <div class="flex items-center space-x-3">
          <Button 
            variant="secondary" 
            @click="showExportModal = true" 
            :disabled="orders.length === 0"
            class="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
            <p class="text-3xl font-bold text-gray-900">{{ pagination?.total || orders.length }}</p>
            <p class="text-xs text-gray-500 mt-1">All time</p>
          </div>
          <div class="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 shadow-md">
            <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Pending Orders</p>
            <p class="text-3xl font-bold text-gray-900">{{ pendingOrdersCount }}</p>
            <p class="text-xs text-gray-500 mt-1">Requires attention</p>
          </div>
          <div class="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-4 shadow-md">
            <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatPrice(totalRevenue) }}</p>
            <p class="text-xs text-gray-500 mt-1">From all orders</p>
          </div>
          <div class="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 shadow-md">
            <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Delivered</p>
            <p class="text-3xl font-bold text-gray-900">{{ deliveredOrdersCount }}</p>
            <p class="text-xs text-gray-500 mt-1">Completed orders</p>
          </div>
          <div class="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 shadow-md">
            <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filters and Search Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by order number, customer email..."
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            v-model="filters.status" 
            @change="loadOrders" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <!-- Payment Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment</label>
          <select 
            v-model="filters.paymentStatus" 
            @change="loadOrders" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>
      
      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
        <span class="text-sm text-gray-600 font-medium">Active filters:</span>
        <span v-if="filters.status" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
          Status: {{ filters.status }}
          <button @click="clearFilter('status')" class="hover:text-blue-900 font-bold">×</button>
        </span>
        <span v-if="filters.paymentStatus" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
          Payment: {{ filters.paymentStatus }}
          <button @click="clearFilter('paymentStatus')" class="hover:text-green-900 font-bold">×</button>
        </span>
        <span v-if="searchQuery" class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2">
          Search: {{ searchQuery }}
          <button @click="clearSearch" class="hover:text-purple-900 font-bold">×</button>
        </span>
        <button @click="clearAllFilters" class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors">
          Clear All
        </button>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
      <LoadingSpinner size="md" />
      <span class="ml-3 text-gray-600">Loading orders...</span>
    </div>
    
    <!-- Error Message -->
    <div v-if="lastError && !isLoading" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-semibold text-red-800">Error Loading Orders</p>
          <p class="text-sm text-red-600">{{ lastError }}</p>
        </div>
      </div>
    </div>
    
    <!-- Orders Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <DataTable
        :columns="columns"
        :data="orders"
        :actions="true"
        :row-key="'id'"
      >
        <template #cell-orderNumber="{ value, row }">
          <router-link 
            :to="`/admin/orders/${row.id}`" 
            class="font-semibold text-primary-600 hover:text-primary-800 transition-colors"
          >
            #{{ value || row.id }}
          </router-link>
        </template>
        
        <template #cell-total="{ value }">
          <span class="font-semibold text-gray-900">{{ formatPrice(value) }}</span>
        </template>
        
        <template #cell-status="{ value, row }">
          <div class="flex items-center gap-2">
            <select
              :value="value || ''"
              @change="updateOrderStatus(row.id, ($event.target as HTMLSelectElement).value)"
              :class="getStatusClass(value)"
              class="px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer shadow-sm transition-all"
              @click.stop
            >
              <option value="">—</option>
              <option value="created">Created</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="paid">Paid</option>
              <option value="packed">Packed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </template>
        
        <template #cell-paymentStatus="{ value }">
          <span :class="getPaymentStatusClass(value)" class="px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {{ value?.toUpperCase() || 'PENDING' }}
          </span>
        </template>
        
        <template #cell-createdAt="{ value }">
          <span class="text-sm text-gray-600">{{ formatDateTime(value) }}</span>
        </template>
        
        <template #actions="{ row }">
          <div class="flex items-center space-x-2">
            <router-link 
              :to="`/admin/orders/${row.id}`" 
              class="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
              title="View Details"
            >
              View
            </router-link>
            <button
              v-if="row.status !== 'cancelled' && row.status !== 'delivered'"
              @click="cancelOrder(row.id)"
              class="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
              title="Cancel Order"
            >
              Cancel
            </button>
            <button
              v-if="row.status === 'delivered' && row.paymentStatus === 'paid'"
              @click="showRefundModal(row)"
              class="px-3 py-1 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-sm font-medium transition-colors"
              title="Refund Order"
            >
              Refund
            </button>
          </div>
        </template>
      </DataTable>
      
      <!-- Empty State -->
      <div v-if="orders.length === 0 && !isLoading" class="text-center py-20 px-4">
        <div class="max-w-md mx-auto">
          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <svg class="relative mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
          <p class="text-gray-500 mb-6">
            <span v-if="hasActiveFilters" class="block">
              No orders match your current filters.
            </span>
            <span v-else class="block">
              Orders will appear here when customers place orders.
            </span>
          </p>
          <div v-if="hasActiveFilters" class="flex justify-center">
            <Button variant="primary" @click="clearAllFilters" class="px-6">
              <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </Button>
          </div>
          <div v-else class="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <div class="flex items-center text-sm text-gray-400">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start by creating products and setting up your store
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination && pagination.pages > 1" class="px-6 py-4 border-t bg-gradient-to-r from-gray-50 to-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-600">
          Showing <span class="font-semibold text-gray-900">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span> to 
          <span class="font-semibold text-gray-900">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> of 
          <span class="font-semibold text-gray-900">{{ pagination.total }}</span> orders
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="secondary"
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-4 w-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>
          <div class="flex items-center space-x-1 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <span class="text-sm text-gray-600">
              Page <span class="font-semibold text-gray-900">{{ pagination.page }}</span> of <span class="font-semibold text-gray-900">{{ pagination.pages }}</span>
            </span>
          </div>
          <Button
            variant="secondary"
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.pages"
            class="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <svg class="h-4 w-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Refund Modal -->
    <div
      v-if="refundingOrder"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="refundingOrder = null"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Refund Order</h2>
        <p class="mb-4 text-gray-600">Order Total: <strong class="text-gray-900">{{ formatPrice(refundingOrder.total) }}</strong></p>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Refund Amount (leave empty for full refund)</label>
          <input
            v-model.number="refundAmount"
            type="number"
            :max="refundingOrder.total"
            :min="0"
            step="0.01"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Full refund"
          />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Reason <span class="text-red-500">*</span></label>
          <textarea
            v-model="refundReason"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter reason for refund..."
            required
          />
        </div>
        <div class="flex justify-end space-x-4">
          <Button variant="secondary" @click="refundingOrder = null">Cancel</Button>
          <Button
            variant="primary"
            @click="processRefund"
            :loading="isProcessing"
            :disabled="!refundReason.trim()"
          >
            Process Refund
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Export Modal -->
    <div
      v-if="showExportModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="showExportModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Export Orders</h2>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <select v-model="exportFormat" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xlsx">Excel (XLSX)</option>
          </select>
        </div>
        <div class="flex justify-end space-x-4">
          <Button variant="secondary" @click="showExportModal = false">Cancel</Button>
          <Button variant="primary" @click="handleExport" :loading="isProcessing">
            Export
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { adminApi } from '@/api/endpoints/admin'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { normalizeOrders, extractPaginatedData } from '@/utils/dataNormalizer'
import { formatDateTime } from '@/utils/formatters'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import { extractErrorMessage } from '@/utils/errorHandler'
import DataTable from '@/components/admin/DataTable.vue'

const { formatPrice } = usePriceFormatter()
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import type { Order } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const isProcessing = ref(false)
const orders = ref<Order[]>([])
const showExportModal = ref(false)
const exportFormat = ref('csv')
const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)
const pagination = ref<any>(null)
const lastError = ref<string | null>(null)

const filters = ref({
  status: '',
  paymentStatus: ''
})

const columns = [
  { key: 'orderNumber', label: 'Order #', sortable: true },
  { key: 'total', label: 'Total', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'paymentStatus', label: 'Payment', sortable: true },
  { key: 'createdAt', label: 'Date', sortable: true }
]

const hasActiveFilters = computed(() => {
  return !!filters.value.status || !!filters.value.paymentStatus || !!searchQuery.value
})

const pendingOrdersCount = computed(() => {
  return orders.value.filter(o => o.status === 'pending').length
})

const deliveredOrdersCount = computed(() => {
  return orders.value.filter(o => o.status === 'delivered').length
})

const totalRevenue = computed(() => {
  return orders.value.reduce((sum, order) => sum + Number(order.total ?? 0), 0)
})

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    created: 'bg-gray-100 text-gray-800',
    payment_pending: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    packed: 'bg-indigo-100 text-indigo-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
    returned: 'bg-orange-100 text-orange-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
  console.log('🔴 [Orders] Component mounted')
  sendToTerminal('log', '🔴 [Orders] Component mounted, loading orders...')
  await loadOrders()
})

const loadOrders = async () => {
  isLoading.value = true
  lastError.value = null
  
  try {
    const params: any = {
      page: pagination.value?.page || 1,
      limit: 20
    }
    
    if (filters.value.status) {
      params.status = filters.value.status
    }
    
    if (filters.value.paymentStatus) {
      params.paymentStatus = filters.value.paymentStatus
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    console.log('[Orders] Loading orders with params:', params)
    sendToTerminal('log', '[Orders] Loading orders with params:', params)
    
    const response = await adminApi.getOrders(params)
    
    console.log('[Orders] Raw API Response:', response)
    console.log('[Orders] Response type:', typeof response)
    console.log('[Orders] Response.success:', response?.success)
    console.log('[Orders] Response.data type:', typeof response?.data)
    console.log('[Orders] Response.data is Array:', Array.isArray(response?.data))
    console.log('[Orders] Response.data:', response?.data)
    
    sendToTerminal('log', '[Orders] Raw API Response:', response)
    sendToTerminal('log', '[Orders] Response.data type:', typeof response?.data)
    sendToTerminal('log', '[Orders] Response.data is Array:', Array.isArray(response?.data))
    
    if (response && response.success !== false) {
      let ordersData: any[] = []
      
      console.log('[Orders] Processing response.data:', response.data)
      
      if (Array.isArray(response.data)) {
        ordersData = response.data
        console.log('[Orders] Data is direct array, length:', ordersData.length)
        sendToTerminal('log', '[Orders] Data is direct array, length:', ordersData.length)
      } else if (response.data && typeof response.data === 'object') {
        console.log('[Orders] Data is object, keys:', Object.keys(response.data))
        sendToTerminal('log', '[Orders] Data is object, keys:', Object.keys(response.data))
        
        if (Array.isArray(response.data.data)) {
          ordersData = response.data.data
          pagination.value = response.data.pagination || response.pagination
          console.log('[Orders] Data is nested in data.data, length:', ordersData.length)
          sendToTerminal('log', '[Orders] Data is nested in data.data, length:', ordersData.length)
        } else if (Array.isArray(response.data.items)) {
          ordersData = response.data.items
          pagination.value = response.data.pagination
          console.log('[Orders] Data is in data.items, length:', ordersData.length)
          sendToTerminal('log', '[Orders] Data is in data.items, length:', ordersData.length)
        } else if (Array.isArray(response.data.orders)) {
          ordersData = response.data.orders
          pagination.value = response.data.pagination
          console.log('[Orders] Data is in data.orders, length:', ordersData.length)
          sendToTerminal('log', '[Orders] Data is in data.orders, length:', ordersData.length)
        } else {
          const extracted = extractPaginatedData<Order>(response)
          ordersData = extracted.data || []
          pagination.value = extracted.pagination || response.pagination
          console.log('[Orders] Using extractPaginatedData, length:', ordersData.length)
          sendToTerminal('log', '[Orders] Using extractPaginatedData, length:', ordersData.length)
        }
      } else {
        console.warn('[Orders] Unexpected response.data format:', response.data)
        sendToTerminal('warn', '[Orders] Unexpected response.data format:', response.data)
      }
      
      console.log('[Orders] Extracted ordersData:', ordersData)
      console.log('[Orders] ordersData length:', ordersData.length)
      console.log('[Orders] ordersData is Array:', Array.isArray(ordersData))
      
      if (ordersData && ordersData.length > 0) {
        console.log('[Orders] Normalizing orders data...')
        const normalized = normalizeOrders(ordersData)
        console.log('[Orders] Normalized orders:', normalized)
        console.log('[Orders] Normalized length:', normalized.length)
        
        orders.value = [...normalized]
        
        console.log('[Orders] Orders ref set, length:', orders.value.length)
        console.log('[Orders] Orders ref is Array:', Array.isArray(orders.value))
        console.log('[Orders] First order:', orders.value[0])
        
        sendToTerminal('log', '[Orders] Normalized orders:', orders.value)
        sendToTerminal('log', '[Orders] Orders array length:', orders.value.length)
      } else {
        console.log('[Orders] No orders data found, setting empty array')
        orders.value = []
        sendToTerminal('warn', '[Orders] No orders data found in response')
      }
      
      if (response.pagination) {
        pagination.value = response.pagination
        console.log('[Orders] Pagination set:', pagination.value)
      }
    } else {
      const errorMsg = response?.error || 'Failed to load orders'
      console.error('[Orders] Response success is false:', response)
      console.error('[Orders] Error message:', errorMsg)
      lastError.value = errorMsg
      orders.value = []
      uiStore.showNotification('error', errorMsg)
      sendToTerminal('error', '[Orders] Response success is false:', response)
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Failed to load orders'
    console.error('[Orders] Exception caught:', error)
    console.error('[Orders] Error message:', errorMsg)
    console.error('[Orders] Error stack:', error?.stack)
    lastError.value = errorMsg
    uiStore.showNotification('error', errorMsg)
    sendToTerminal('error', '[Orders] Exception loading orders:', error)
    orders.value = []
  } finally {
    isLoading.value = false
    console.log('[Orders] Load complete. Final state:')
    console.log('[Orders] - isLoading:', isLoading.value)
    console.log('[Orders] - orders.length:', orders.value.length)
    console.log('[Orders] - orders:', orders.value)
    console.log('[Orders] - pagination:', pagination.value)
    sendToTerminal('log', '[Orders] Load complete. Final state:', {
      isLoading: isLoading.value,
      ordersLength: orders.value.length,
      pagination: pagination.value
    })
  }
}

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    loadOrders()
  }, 500)
}

const clearSearch = () => {
  searchQuery.value = ''
  loadOrders()
}

const clearFilter = (filterName: keyof typeof filters.value) => {
  filters.value[filterName] = ''
  loadOrders()
}

const clearAllFilters = () => {
  filters.value.status = ''
  filters.value.paymentStatus = ''
  searchQuery.value = ''
  loadOrders()
}

const changePage = (page: number) => {
  if (pagination.value) {
    pagination.value.page = page
    loadOrders()
  }
}

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  isProcessing.value = true
  try {
    const response = await adminApi.updateOrderStatus(orderId, newStatus)
    sendToTerminal('log', '[Orders] Update status response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Order status updated successfully')
      await loadOrders()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update order status')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update order status')
    sendToTerminal('error', '[Orders] Error updating order status:', error)
  } finally {
    isProcessing.value = false
  }
}

const cancelOrder = async (orderId: string) => {
  const order = orders.value.find(o => o.id === orderId)
  if (!confirm(`Are you sure you want to cancel order #${order?.orderNumber || orderId}?`)) return
  
  isProcessing.value = true
  try {
    const response = await adminApi.cancelOrder(orderId)
    sendToTerminal('log', '[Orders] Cancel response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Order cancelled successfully')
      await loadOrders()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to cancel order')
    }
  } catch (error: any) {
    uiStore.showNotification('error', extractErrorMessage(error))
    sendToTerminal('error', '[Orders] Error cancelling order:', error)
  } finally {
    isProcessing.value = false
  }
}

const refundingOrder = ref<Order | null>(null)
const refundAmount = ref<number | null>(null)
const refundReason = ref('')

const showRefundModal = (order: Order) => {
  refundingOrder.value = order
  refundAmount.value = null
  refundReason.value = ''
}

const processRefund = async () => {
  if (!refundingOrder.value || !refundReason.value.trim()) return
  
  isProcessing.value = true
  try {
    const amount = refundAmount.value ?? refundingOrder.value.total
    const response = await adminApi.refundOrder(refundingOrder.value.id, amount, refundReason.value.trim())
    sendToTerminal('log', '[Orders] Refund response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', `Refund of ${formatPrice(amount)} processed successfully`)
      refundingOrder.value = null
      refundAmount.value = null
      refundReason.value = ''
      await loadOrders()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to process refund')
    }
  } catch (error: any) {
    uiStore.showNotification('error', extractErrorMessage(error))
    sendToTerminal('error', '[Orders] Error processing refund:', error)
  } finally {
    isProcessing.value = false
  }
}

const handleExport = async () => {
  isProcessing.value = true
  try {
    const exportData = orders.value.map(order => ({
      'Order Number': order.orderNumber,
      'Total': order.total,
      'Status': order.status,
      'Payment Status': order.paymentStatus,
      'Created At': formatDateTime(order.createdAt)
    }))
    
    if (exportFormat.value === 'json') {
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `orders-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } else if (exportFormat.value === 'csv') {
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n')
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } else {
      uiStore.showNotification('info', 'XLSX export requires additional library. Exporting as CSV instead.')
      exportFormat.value = 'csv'
      handleExport()
      return
    }
    
    uiStore.showNotification('success', 'Orders exported successfully')
    showExportModal.value = false
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to export orders')
    sendToTerminal('error', '[Orders] Error exporting orders:', error)
  } finally {
    isProcessing.value = false
  }
}
</script>
