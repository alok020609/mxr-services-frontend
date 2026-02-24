<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Analytics & Reports</h1>
    
    <!-- Date Range Filter -->
    <div class="mb-6 flex items-center space-x-4">
      <Input
        v-model="dateRange.start"
        type="date"
        label="Start Date"
      />
      <Input
        v-model="dateRange.end"
        type="date"
        label="End Date"
      />
      <Button variant="primary" @click="loadAnalytics" class="mt-6" :loading="isLoading">
        Apply Filter
      </Button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load analytics</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadAnalytics">Retry</Button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading && !dashboardData" class="mb-4 flex items-center justify-center py-12 text-gray-600">
      <LoadingSpinner size="md" />
      <span class="ml-2">Loading analytics...</span>
    </div>
    
    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Dashboard Stats -->
      <div v-if="dashboardData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          :value="formatPrice(dashboardData.totalRevenue || 0)"
        />
        <StatsCard
          title="Total Orders"
          :value="dashboardData.totalOrders || 0"
        />
        <StatsCard
          title="Total Users"
          :value="dashboardData.totalUsers || 0"
        />
        <StatsCard
          title="Total Products"
          :value="dashboardData.totalProducts || 0"
        />
      </div>
      
      <!-- Empty State for Dashboard -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="text-lg font-medium text-gray-900 mb-2">No analytics data available</p>
        <p class="text-sm text-gray-600 mb-4">Analytics data will appear here once it's available</p>
        <Button variant="primary" @click="loadAnalytics">Refresh</Button>
      </div>
        
      <!-- Analytics Sections -->
      <div v-if="dashboardData" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Products -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Top Products</h2>
          <div v-if="dashboardData?.topProducts && dashboardData.topProducts.length > 0">
            <div
              v-for="product in dashboardData.topProducts.slice(0, 5)"
              :key="product.id"
              class="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <span>{{ product.name }}</span>
              <span class="font-semibold">{{ formatPrice(product.price || 0) }}</span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-4">No product data available</p>
        </div>
        
        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Recent Orders</h2>
          <div v-if="dashboardData?.recentOrders && dashboardData.recentOrders.length > 0">
            <div
              v-for="order in dashboardData.recentOrders.slice(0, 5)"
              :key="order.id"
              class="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <div>
                <span class="font-medium">{{ order.orderNumber || order.id }}</span>
                <span :class="getStatusClass(order.status)" class="ml-2 px-2 py-1 rounded text-xs">
                  {{ order.status }}
                </span>
              </div>
              <span class="font-semibold">{{ formatPrice(order.total || 0) }}</span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-4">No order data available</p>
        </div>
      </div>
      
      <!-- Additional Analytics -->
      <div v-if="dashboardData" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Customer Lifetime Value -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Customer Lifetime Value</h2>
          <div v-if="clvData" class="space-y-2">
            <div class="flex justify-between">
              <span>Average CLV:</span>
              <span class="font-semibold">{{ formatPrice(clvData.averageCLV || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Total CLV:</span>
              <span class="font-semibold">{{ formatPrice(clvData.totalCLV || 0) }}</span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-4">No CLV data available</p>
        </div>
        
        <!-- Funnel Data -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Sales Funnel</h2>
          <div v-if="funnelData" class="space-y-2">
            <div class="flex justify-between">
              <span>Visitors:</span>
              <span class="font-semibold">{{ funnelData.visitors || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span>Add to Cart:</span>
              <span class="font-semibold">{{ funnelData.addToCart || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span>Checkout:</span>
              <span class="font-semibold">{{ funnelData.checkout || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span>Completed:</span>
              <span class="font-semibold">{{ funnelData.completed || 0 }}</span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-4">No funnel data available</p>
        </div>
      </div>
      
      <!-- Export Button -->
      <div v-if="dashboardData" class="flex justify-end">
        <Button variant="primary" @click="exportAnalytics">
          Export Analytics
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { analyticsApi } from '@/api/endpoints/analytics'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { normalizeDashboard, extractDataFromResponse } from '@/utils/dataNormalizer'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import StatsCard from '@/components/admin/StatsCard.vue'

const { formatPrice } = usePriceFormatter()
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import type { AnalyticsDashboard } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const dashboardData = ref<AnalyticsDashboard | null>(null)
const clvData = ref<any>(null)
const funnelData = ref<any>(null)
const cohortData = ref<any>(null)

const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const loadAnalytics = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Load dashboard analytics
    const dashboardResponse = await analyticsApi.getDashboard()
    sendToTerminal('log', '[Analytics] Dashboard response:', dashboardResponse)
    
    if (dashboardResponse.success && dashboardResponse.data) {
      const data = extractDataFromResponse<any>(dashboardResponse)
      dashboardData.value = normalizeDashboard(data)
      error.value = null
    } else {
      const errorMessage = dashboardResponse.error || 'Failed to load analytics dashboard'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
      dashboardData.value = null
    }
    
    // Load CLV data (optional, don't fail if this fails)
    try {
      const clvResponse = await analyticsApi.getCohort()
      sendToTerminal('log', '[Analytics] Cohort response:', clvResponse)
      if (clvResponse.success && clvResponse.data) {
        clvData.value = clvResponse.data
      }
    } catch (err) {
      sendToTerminal('warn', '[Analytics] CLV data not available:', err)
      clvData.value = null
    }
    
    // Load funnel data (optional, don't fail if this fails)
    try {
      const funnelResponse = await analyticsApi.getFunnel()
      sendToTerminal('log', '[Analytics] Funnel response:', funnelResponse)
      if (funnelResponse.success && funnelResponse.data) {
        funnelData.value = funnelResponse.data
      }
    } catch (err) {
      sendToTerminal('warn', '[Analytics] Funnel data not available:', err)
      funnelData.value = null
    }
    
    // Load cohort data (optional, don't fail if this fails)
    try {
      const cohortResponse = await analyticsApi.getCohort()
      sendToTerminal('log', '[Analytics] Cohort response:', cohortResponse)
      if (cohortResponse.success && cohortResponse.data) {
        cohortData.value = cohortResponse.data
      }
    } catch (err) {
      sendToTerminal('warn', '[Analytics] Cohort data not available:', err)
      cohortData.value = null
    }
    
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to load analytics'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[Analytics] Error loading analytics:', err)
    dashboardData.value = null
  } finally {
    isLoading.value = false
  }
}

const exportAnalytics = () => {
  const data = {
    dashboard: dashboardData.value,
    clv: clvData.value,
    funnel: funnelData.value,
    cohort: cohortData.value,
    dateRange: dateRange.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  uiStore.showNotification('success', 'Analytics exported successfully')
}

onMounted(() => {
  loadAnalytics()
})
</script>
