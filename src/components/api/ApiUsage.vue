<template>
  <div class="api-usage">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">API Usage</h2>
        <p class="text-sm text-gray-600">Monitor API usage statistics and rate limit consumption</p>
      </div>
      <Button variant="secondary" size="sm" @click="loadUsage">
        <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading API usage...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load API usage</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadUsage">Retry</Button>
      </div>
    </div>

    <!-- Usage Display -->
    <div v-else-if="usage" class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-if="usage.totalRequests !== undefined" class="bg-white rounded-lg shadow-md p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Total Requests</label>
          <p class="text-3xl font-bold text-primary-600">{{ formatNumber(usage.totalRequests) }}</p>
        </div>
        <div v-if="usage.rateLimitUsage" class="bg-white rounded-lg shadow-md p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Rate Limit Usage</label>
          <p class="text-3xl font-bold" :class="usage.rateLimitUsage.percentage > 80 ? 'text-red-600' : 'text-green-600'">
            {{ usage.rateLimitUsage.used }} / {{ usage.rateLimitUsage.limit }}
          </p>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all"
              :class="usage.rateLimitUsage.percentage > 80 ? 'bg-red-600' : 'bg-green-600'"
              :style="{ width: `${Math.min(usage.rateLimitUsage.percentage, 100)}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ usage.rateLimitUsage.percentage.toFixed(1) }}% used</p>
        </div>
        <div v-if="usage.period" class="bg-white rounded-lg shadow-md p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <p class="text-sm text-gray-900">{{ formatDate(usage.period.start) }}</p>
          <p class="text-sm text-gray-500">to {{ formatDate(usage.period.end) }}</p>
        </div>
      </div>

      <!-- Endpoint Usage -->
      <div v-if="usage.requestsByEndpoint && usage.requestsByEndpoint.length > 0" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Endpoint Usage Breakdown</h3>
        <DataTable
          :columns="endpointColumns"
          :data="usage.requestsByEndpoint"
          :actions="false"
        >
          <template #cell-endpoint="{ value }">
            <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ value }}</code>
          </template>
          <template #cell-count="{ value }">
            <span class="font-medium">{{ formatNumber(value) }}</span>
          </template>
        </DataTable>
      </div>

      <!-- Time Series (if available) -->
      <div v-if="usage.timeSeries && usage.timeSeries.length > 0" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Usage Over Time</h3>
        <div class="space-y-2">
          <div
            v-for="(point, index) in usage.timeSeries"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <span class="text-sm text-gray-700">{{ formatDate(point.date) }}</span>
            <span class="font-medium text-gray-900">{{ formatNumber(point.requests) }} requests</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 border rounded-lg bg-gray-50">
      <p class="text-gray-500">No API usage data available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiGatewayApi } from '@/api/endpoints/api-gateway'
import { useUIStore } from '@/stores/ui'
import type { ApiUsage } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import DataTable from '@/components/admin/DataTable.vue'
import { formatDate, formatNumber } from '@/utils/formatters'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const usage = ref<ApiUsage | null>(null)

const endpointColumns = [
  { key: 'endpoint', label: 'Endpoint', sortable: true },
  { key: 'count', label: 'Requests', sortable: true }
]

const loadUsage = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiGatewayApi.getApiUsage()
    if (response.success && response.data) {
      usage.value = response.data
    } else {
      error.value = response.error || 'Failed to load API usage'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to load API usage'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUsage()
})
</script>

