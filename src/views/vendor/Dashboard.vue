<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
        <p class="text-gray-600">Welcome back! Here's what's happening with your products today.</p>
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
        title="Total Products"
        :value="formatNumber(dashboard.totalProducts || 0)"
        icon-bg-class="bg-gradient-to-br from-blue-500 to-blue-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        title="Active Products"
        :value="formatNumber(dashboard.activeProducts || 0)"
        icon-bg-class="bg-gradient-to-br from-green-500 to-green-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        title="Total Sales"
        :value="formatCurrency(dashboard.totalSales || 0)"
        icon-bg-class="bg-gradient-to-br from-purple-500 to-purple-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatsCard>
      
      <StatsCard
        title="Pending Orders"
        :value="formatNumber(dashboard.pendingOrders || 0)"
        icon-bg-class="bg-gradient-to-br from-orange-500 to-orange-600"
      >
        <template #icon>
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </template>
      </StatsCard>
    </div>
    
    <!-- Recent Activity Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders Card -->
      <div class="card hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Recent Orders</h2>
          <router-link 
            to="/vendor/products" 
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
        
        <div v-else class="space-y-4">
          <div 
            v-for="order in dashboard.recentOrders.slice(0, 5)" 
            :key="order.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div>
              <p class="font-semibold text-gray-900">Order #{{ order.orderNumber || order.id }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">{{ formatCurrency(order.total || 0) }}</p>
              <span :class="getStatusClass(order.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Top Products Card -->
      <div class="card hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Top Products</h2>
          <router-link 
            to="/vendor/products" 
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all →
          </router-link>
        </div>
        
        <div v-if="!dashboard.topProducts || dashboard.topProducts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p class="mt-4 text-gray-500 font-medium">No products yet</p>
          <p class="text-sm text-gray-400 mt-1">Add products to start selling</p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="product in dashboard.topProducts.slice(0, 5)" 
            :key="product.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div>
              <p class="font-semibold text-gray-900">{{ product.name }}</p>
              <p class="text-sm text-gray-600">Stock: {{ product.stock || 0 }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">{{ formatCurrency(product.price || 0) }}</p>
              <span :class="getProductStatusClass(product.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ product.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { vendorApi } from '@/api/endpoints/vendor'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatCurrency as formatCurrencyUtil, formatNumber as formatNumberUtil } from '@/utils/formatters'
import StatsCard from '@/components/admin/StatsCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const dashboard = ref<any>({
  totalProducts: 0,
  activeProducts: 0,
  totalSales: 0,
  pendingOrders: 0,
  recentOrders: [],
  topProducts: []
})
const error = ref<string | null>(null)

const formatCurrency = formatCurrencyUtil
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
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getProductStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    draft: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const loadDashboard = async () => {
  error.value = null
  
  try {
    isLoading.value = true
    
    const response = await vendorApi.getDashboard()
    
    sendToTerminal('log', '[Vendor Dashboard] API response:', response)
    
    if (response && response.success && response.data) {
      const data = response.data
      
      dashboard.value = {
        totalProducts: data.totalProducts || data.total_products || 0,
        activeProducts: data.activeProducts || data.active_products || 0,
        totalSales: data.totalSales || data.total_sales || data.revenue || 0,
        pendingOrders: data.pendingOrders || data.pending_orders || 0,
        recentOrders: data.recentOrders || data.recent_orders || [],
        topProducts: data.topProducts || data.top_products || []
      }
      
      sendToTerminal('log', '[Vendor Dashboard] Dashboard data:', dashboard.value)
    } else {
      error.value = response?.error || 'Unable to load dashboard data'
      uiStore.showNotification('error', 'Failed to load dashboard statistics')
    }
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load dashboard'
    uiStore.showNotification('error', 'Failed to load dashboard statistics')
    sendToTerminal('error', '[Vendor Dashboard] Error loading dashboard:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  sendToTerminal('log', '[Vendor Dashboard] Component mounted')
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

