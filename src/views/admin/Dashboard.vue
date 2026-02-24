<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>
      <div class="flex items-center space-x-4">
        <button 
          v-if="error" 
          @click="loadDashboard" 
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          Retry
        </button>
        <div v-if="isLoading" class="flex items-center text-gray-600">
          <LoadingSpinner size="sm" />
          <span class="ml-2 text-sm">Refreshing...</span>
        </div>
      </div>
    </div>
    
    <!-- Error message banner -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-700 font-medium">{{ error }}</p>
      </div>
    </div>
    
    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Revenue"
        :value="formatCurrency(dashboard.totalRevenue || 0)"
        :change="dashboard.revenueGrowth"
        change-type="increase"
        icon-bg-class="bg-gradient-to-br from-green-500 to-green-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        title="Total Orders"
        :value="formatNumber(dashboard.totalOrders || 0)"
        :change="dashboard.ordersGrowth"
        change-type="increase"
        icon-bg-class="bg-gradient-to-br from-blue-500 to-blue-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        title="Total Users"
        :value="formatNumber(dashboard.totalUsers || 0)"
        :change="dashboard.usersGrowth"
        change-type="increase"
        icon-bg-class="bg-gradient-to-br from-purple-500 to-purple-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        title="Total Products"
        :value="formatNumber(dashboard.totalProducts || 0)"
        icon-bg-class="bg-gradient-to-br from-orange-500 to-orange-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </template>
      </StatsCard>
    </div>
    
    <!-- Additional Stats Cards (from /admin/stats) -->
    <div v-if="dashboard.averageOrderValue > 0 || dashboard.conversionRate > 0 || dashboard.pendingOrders > 0 || dashboard.lowStockProducts > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        v-if="dashboard.averageOrderValue > 0"
        title="Average Order Value"
        :value="formatCurrency(dashboard.averageOrderValue)"
        icon-bg-class="bg-gradient-to-br from-indigo-500 to-indigo-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        v-if="dashboard.conversionRate > 0"
        title="Conversion Rate"
        :value="`${dashboard.conversionRate.toFixed(2)}%`"
        icon-bg-class="bg-gradient-to-br from-teal-500 to-teal-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        v-if="dashboard.pendingOrders > 0"
        title="Pending Orders"
        :value="formatNumber(dashboard.pendingOrders)"
        icon-bg-class="bg-gradient-to-br from-amber-500 to-amber-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        v-if="dashboard.lowStockProducts > 0"
        title="Low Stock Products"
        :value="formatNumber(dashboard.lowStockProducts)"
        icon-bg-class="bg-gradient-to-br from-red-500 to-red-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </template>
      </StatsCard>
    </div>
    
    <!-- Additional Stats Cards (from /admin/stats) -->
    <div v-if="dashboard.averageOrderValue > 0 || dashboard.conversionRate > 0 || dashboard.pendingOrders > 0 || dashboard.lowStockProducts > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        v-if="dashboard.averageOrderValue > 0"
        title="Average Order Value"
        :value="formatCurrency(dashboard.averageOrderValue)"
        icon-bg-class="bg-gradient-to-br from-indigo-500 to-indigo-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        v-if="dashboard.conversionRate > 0"
        title="Conversion Rate"
        :value="`${dashboard.conversionRate.toFixed(2)}%`"
        icon-bg-class="bg-gradient-to-br from-teal-500 to-teal-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        v-if="dashboard.pendingOrders > 0"
        title="Pending Orders"
        :value="formatNumber(dashboard.pendingOrders)"
        icon-bg-class="bg-gradient-to-br from-amber-500 to-amber-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        v-if="dashboard.lowStockProducts > 0"
        title="Low Stock Products"
        :value="formatNumber(dashboard.lowStockProducts)"
        icon-bg-class="bg-gradient-to-br from-red-500 to-red-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </template>
      </StatsCard>
    </div>
    
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders Card -->
      <div class="card hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Recent Orders</h2>
          <router-link 
            to="/admin/orders" 
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all →
          </router-link>
        </div>
        
        <div v-if="!dashboard.recentOrders || dashboard.recentOrders.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p class="mt-4 text-gray-500 font-medium">No recent orders</p>
          <p class="text-sm text-gray-400 mt-1">Orders will appear here once customers start placing them</p>
        </div>
        
        <DataTable
          v-else
          :columns="orderColumns"
          :data="dashboard.recentOrders"
          :actions="true"
          row-key="id"
        >
          <template #cell-status="{ value }">
            <span :class="getStatusClass(value)" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ value }}
            </span>
          </template>
          <template #cell-total="{ value }">
            <span class="font-semibold">{{ formatCurrency(value) }}</span>
          </template>
          <template #cell-createdAt="{ value }">
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
      
      <!-- Top Products Card -->
      <div class="card hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Top Products</h2>
          <router-link 
            to="/admin/products" 
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all →
          </router-link>
        </div>
        
        <div v-if="!dashboard.topProducts || dashboard.topProducts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p class="mt-4 text-gray-500 font-medium">No top products yet</p>
          <p class="text-sm text-gray-400 mt-1">Top selling products will appear here</p>
        </div>
        
        <DataTable
          v-else
          :columns="productColumns"
          :data="dashboard.topProducts"
          row-key="id"
        >
          <template #cell-price="{ value }">
            <span class="font-semibold text-gray-900">{{ formatCurrency(value) }}</span>
          </template>
          <template #cell-status="{ value }">
            <span :class="getProductStatusClass(value)" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ value }}
            </span>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/endpoints/admin'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { normalizeDashboard, extractDataFromResponse, mergeDashboardData } from '@/utils/dataNormalizer'
import { formatNumber as formatNumberUtil } from '@/utils/formatters'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import StatsCard from '@/components/admin/StatsCard.vue'

const { formatPrice: formatCurrency } = usePriceFormatter()
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { AnalyticsDashboard } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const dashboard = ref<AnalyticsDashboard>({
  totalRevenue: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalProducts: 0,
  revenueGrowth: 0,
  ordersGrowth: 0,
  usersGrowth: 0,
  topProducts: [],
  recentOrders: []
})
const error = ref<string | null>(null)

const orderColumns = [
  { key: 'orderNumber', label: 'Order #', sortable: true },
  { key: 'total', label: 'Total', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Date', sortable: true }
]

const productColumns = [
  { key: 'name', label: 'Product Name', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
]

const formatNumber = formatNumberUtil

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
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getProductStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    draft: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const loadDashboard = async () => {
  error.value = null
  
  try {
    isLoading.value = true
    
    // Call both endpoints in parallel for better performance
    const [dashboardResponse, statsResponse] = await Promise.allSettled([
      adminApi.getDashboard(),
      adminApi.getStats()
    ])
    
    sendToTerminal('log', '[Dashboard] Dashboard API response:', dashboardResponse)
    sendToTerminal('log', '[Dashboard] Stats API response:', statsResponse)
    
    let dashboardData: any = null
    let statsData: any = null
    
    // Extract dashboard data
    if (dashboardResponse.status === 'fulfilled' && dashboardResponse.value.success && dashboardResponse.value.data) {
      dashboardData = extractDataFromResponse<any>(dashboardResponse.value)
      sendToTerminal('log', '[Dashboard] Extracted dashboard data:', dashboardData)
    }
    
    // Extract stats data
    if (statsResponse.status === 'fulfilled' && statsResponse.value.success && statsResponse.value.data) {
      statsData = extractDataFromResponse<any>(statsResponse.value)
      sendToTerminal('log', '[Dashboard] Extracted stats data:', statsData)
    }
    
    // Merge data from both endpoints
    if (dashboardData || statsData) {
      const merged = mergeDashboardData(dashboardData || {}, statsData || {})
      
      dashboard.value = {
        totalRevenue: merged.totalRevenue || 0,
        totalOrders: merged.totalOrders || 0,
        totalUsers: merged.totalUsers || 0,
        totalProducts: merged.totalProducts || 0,
        revenueGrowth: merged.revenueGrowth || 0,
        ordersGrowth: merged.ordersGrowth || 0,
        usersGrowth: merged.usersGrowth || 0,
        topProducts: merged.topProducts || [],
        recentOrders: merged.recentOrders || [],
        // Additional stats
        averageOrderValue: merged.averageOrderValue || 0,
        conversionRate: merged.conversionRate || 0,
        pendingOrders: merged.pendingOrders || 0,
        completedOrders: merged.completedOrders || 0,
        activeUsers: merged.activeUsers || 0,
        lowStockProducts: merged.lowStockProducts || 0,
        totalCategories: merged.totalCategories || 0,
        monthlyRevenue: merged.monthlyRevenue || [],
        orderStatusBreakdown: merged.orderStatusBreakdown || {},
        salesByCategory: merged.salesByCategory || []
      }
      
      sendToTerminal('log', '[Dashboard] Merged dashboard data:', dashboard.value)
      return
    }
    
    // If both fail, show error
    error.value = 'Unable to load dashboard data'
    uiStore.showNotification('error', 'Failed to load dashboard statistics')
    sendToTerminal('error', '[Dashboard] Both dashboard and stats endpoints failed')
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load dashboard'
    uiStore.showNotification('error', 'Failed to load dashboard statistics')
    sendToTerminal('error', '[Dashboard] Error loading dashboard:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  sendToTerminal('log', '[Dashboard] Component mounted, initial dashboard state:', dashboard.value)
  loadDashboard()
})
</script>

<style scoped>
.dashboard-container {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
