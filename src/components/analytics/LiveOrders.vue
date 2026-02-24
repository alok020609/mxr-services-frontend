<template>
  <div class="live-orders">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Live Orders</h2>
        <p class="text-sm text-gray-600 mt-1">Real-time order updates (refreshes every 15 seconds)</p>
      </div>
      <div class="flex items-center space-x-4">
        <div v-if="lastUpdate" class="text-sm text-gray-500">
          Last updated: {{ formatTime(lastUpdate) }}
        </div>
        <select
          v-model="statusFilter"
          class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PACKED">Packed</option>
          <option value="SHIPPED">Shipped</option>
        </select>
        <Button variant="secondary" size="sm" @click="loadOrders" :loading="isLoading">
          Refresh
        </Button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load live orders</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadOrders">Retry</Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !orders.length" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading live orders...</span>
    </div>

    <!-- Orders Table -->
    <div v-else-if="filteredOrders.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
      <DataTable
        :columns="columns"
        :data="filteredOrders"
        row-key="id"
        :actions="true"
      >
        <template #cell-status="{ value }">
          <span :class="getStatusClass(value)" class="px-2 py-1 rounded-full text-xs font-medium">
            {{ value }}
          </span>
        </template>
        <template #cell-total="{ value }">
          <span class="font-semibold">{{ formatCurrency(parseFloat(value)) }}</span>
        </template>
        <template #cell-user="{ row }">
          <div>
            <div class="font-medium">{{ row.user.name || 'N/A' }}</div>
            <div class="text-sm text-gray-500">{{ row.user.email }}</div>
          </div>
        </template>
        <template #cell-items="{ row }">
          <div class="text-sm">
            {{ row.items.length }} item(s)
            <div class="text-gray-500 mt-1">
              {{ row.items.map((item: any) => item.product.name).join(', ') }}
            </div>
          </div>
        </template>
        <template #cell-updatedAt="{ value }">
          <span class="text-sm text-gray-600">{{ formatDate(value) }}</span>
        </template>
        <template #actions="{ row }">
          <router-link
            :to="`/admin/orders/${row.id}`"
            class="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View
          </router-link>
        </template>
      </DataTable>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <p class="text-lg font-medium">No live orders</p>
      <p class="text-sm mt-1">Live orders will appear here as they are placed</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { advancedAnalyticsApi } from '@/api/endpoints/advanced-analytics'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { LiveOrder } from '@/api/types'
import DataTable from '@/components/admin/DataTable.vue'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const orders = ref<LiveOrder[]>([])
const statusFilter = ref<string>('')
const lastUpdate = ref<Date | null>(null)
let refreshInterval: number | null = null

const columns = [
  { key: 'orderNumber', label: 'Order #', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'total', label: 'Total', sortable: true },
  { key: 'user', label: 'Customer', sortable: false },
  { key: 'items', label: 'Items', sortable: false },
  { key: 'updatedAt', label: 'Last Updated', sortable: true }
]

const filteredOrders = computed(() => {
  if (!statusFilter.value) {
    return orders.value
  }
  return orders.value.filter(order => order.status === statusFilter.value)
})

const loadOrders = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await advancedAnalyticsApi.getLiveOrders()
    sendToTerminal('log', '[LiveOrders] API Response:', response)
    
    if (response.success && response.data) {
      orders.value = Array.isArray(response.data) ? response.data : []
      lastUpdate.value = new Date()
      error.value = null
    } else {
      const errorMessage = response.error || 'Failed to load live orders'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
      orders.value = []
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to load live orders'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[LiveOrders] Error loading orders:', err)
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    PAID: 'bg-blue-100 text-blue-800',
    PACKED: 'bg-yellow-100 text-yellow-800',
    SHIPPED: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

onMounted(() => {
  loadOrders()
  // Auto-refresh every 15 seconds
  refreshInterval = window.setInterval(() => {
    loadOrders()
  }, 15000)
})

onUnmounted(() => {
  if (refreshInterval !== null) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.live-orders {
  @apply space-y-6;
}
</style>

