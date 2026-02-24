<template>
  <div class="conversion-funnel">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Conversion Funnel</h2>
        <p class="text-sm text-gray-600 mt-1">Track user journey from visit to purchase</p>
      </div>
      <Button variant="secondary" size="sm" @click="loadFunnel" :loading="isLoading">
        Refresh
      </Button>
    </div>

    <!-- Date Range Filter -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <label class="block text-sm font-medium mb-2">Start Date</label>
          <input
            v-model="dateRange.start"
            type="date"
            class="input"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium mb-2">End Date</label>
          <input
            v-model="dateRange.end"
            type="date"
            class="input"
          />
        </div>
        <div class="flex items-end">
          <Button variant="primary" @click="loadFunnel" :loading="isLoading">
            Apply Filter
          </Button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load conversion funnel</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadFunnel">Retry</Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !funnelData" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading funnel data...</span>
    </div>

    <!-- Funnel Visualization -->
    <div v-else-if="funnelData" class="space-y-6">
      <!-- Visual Funnel -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-6">Funnel Overview</h3>
        <div class="space-y-4">
          <div
            v-for="stage in funnelStages"
            :key="stage.key"
            class="funnel-stage"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="font-medium text-gray-900">{{ stage.label }}</div>
              <div class="text-sm text-gray-600">
                {{ formatNumber(stage.count) }} ({{ stage.percentage.toFixed(1) }}%)
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
              <div
                :class="stage.color"
                class="h-full transition-all duration-500 flex items-center justify-end pr-2 text-white text-sm font-medium"
                :style="{ width: `${stage.percentage}%` }"
              >
                <span v-if="stage.percentage > 10">{{ formatNumber(stage.count) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversion Rates -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Conversion Rates</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            v-for="rate in conversionRates"
            :key="rate.label"
            class="border rounded-lg p-4 text-center"
          >
            <div class="text-2xl font-bold text-primary-600">{{ rate.value }}%</div>
            <div class="text-sm text-gray-600 mt-1">{{ rate.label }}</div>
          </div>
        </div>
      </div>

      <!-- Detailed Stats -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Detailed Statistics</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            v-for="stat in detailedStats"
            :key="stat.label"
            class="border rounded-lg p-4"
          >
            <div class="text-sm text-gray-600 mb-1">{{ stat.label }}</div>
            <div class="text-2xl font-bold text-gray-900">{{ formatNumber(stat.value) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="text-lg font-medium">No funnel data available</p>
      <p class="text-sm mt-1">Select a date range to view conversion funnel data</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { advancedAnalyticsApi } from '@/api/endpoints/advanced-analytics'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatNumber } from '@/utils/formatters'
import type { ConversionFunnel } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const funnelData = ref<ConversionFunnel | null>(null)

const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const funnelStages = computed(() => {
  if (!funnelData.value) return []
  
  const maxCount = funnelData.value.visitors
  return [
    {
      key: 'visitors',
      label: 'Visitors',
      count: funnelData.value.visitors,
      percentage: 100,
      color: 'bg-blue-500'
    },
    {
      key: 'productViews',
      label: 'Product Views',
      count: funnelData.value.productViews,
      percentage: (funnelData.value.productViews / maxCount) * 100,
      color: 'bg-purple-500'
    },
    {
      key: 'cartAdds',
      label: 'Cart Additions',
      count: funnelData.value.cartAdds,
      percentage: (funnelData.value.cartAdds / maxCount) * 100,
      color: 'bg-yellow-500'
    },
    {
      key: 'checkouts',
      label: 'Checkouts',
      count: funnelData.value.checkouts,
      percentage: (funnelData.value.checkouts / maxCount) * 100,
      color: 'bg-orange-500'
    },
    {
      key: 'orders',
      label: 'Orders',
      count: funnelData.value.orders,
      percentage: (funnelData.value.orders / maxCount) * 100,
      color: 'bg-green-500'
    }
  ]
})

const conversionRates = computed(() => {
  if (!funnelData.value) return []
  
  return [
    {
      label: 'Visitor to View',
      value: funnelData.value.conversionRates.visitorToView.toFixed(1)
    },
    {
      label: 'View to Cart',
      value: funnelData.value.conversionRates.viewToCart.toFixed(1)
    },
    {
      label: 'Cart to Checkout',
      value: funnelData.value.conversionRates.cartToCheckout.toFixed(1)
    },
    {
      label: 'Checkout to Order',
      value: funnelData.value.conversionRates.checkoutToOrder.toFixed(1)
    },
    {
      label: 'Overall',
      value: funnelData.value.conversionRates.overall.toFixed(1)
    }
  ]
})

const detailedStats = computed(() => {
  if (!funnelData.value) return []
  
  return [
    { label: 'Visitors', value: funnelData.value.visitors },
    { label: 'Product Views', value: funnelData.value.productViews },
    { label: 'Cart Additions', value: funnelData.value.cartAdds },
    { label: 'Checkouts', value: funnelData.value.checkouts },
    { label: 'Orders', value: funnelData.value.orders }
  ]
})

const loadFunnel = async () => {
  isLoading.value = true
  error.value = null
  try {
    const startDate = dateRange.value.start ? new Date(dateRange.value.start).toISOString() : undefined
    const endDate = dateRange.value.end ? new Date(dateRange.value.end + 'T23:59:59').toISOString() : undefined
    
    const response = await advancedAnalyticsApi.getConversionFunnel(startDate, endDate)
    sendToTerminal('log', '[ConversionFunnel] API Response:', response)
    
    if (response.success && response.data) {
      funnelData.value = response.data
      error.value = null
    } else {
      const errorMessage = response.error || 'Failed to load conversion funnel'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to load conversion funnel'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[ConversionFunnel] Error loading funnel:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadFunnel()
})
</script>

<style scoped>
.conversion-funnel {
  @apply space-y-6;
}

.funnel-stage {
  @apply w-full;
}
</style>

