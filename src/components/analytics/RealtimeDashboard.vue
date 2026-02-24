<template>
  <div class="realtime-dashboard">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Real-time Dashboard</h2>
        <p class="text-sm text-gray-600 mt-1">Live metrics updated every 30 seconds</p>
      </div>
      <div class="flex items-center space-x-4">
        <div v-if="lastUpdate" class="text-sm text-gray-500">
          Last updated: {{ formatTime(lastUpdate) }}
        </div>
        <Button variant="secondary" size="sm" @click="loadDashboard" :loading="isLoading">
          Refresh
        </Button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load real-time dashboard</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadDashboard">Retry</Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !dashboardData" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading dashboard...</span>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboardData" class="space-y-6">
      <!-- Last Hour Metrics -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Last Hour</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Orders"
            :value="formatNumber(dashboardData.lastHour.orders)"
            icon-bg-class="bg-gradient-to-br from-blue-500 to-blue-600"
          >
            <template #icon>
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </template>
          </StatsCard>

          <StatsCard
            title="Revenue"
            :value="formatCurrency(dashboardData.lastHour.revenue)"
            icon-bg-class="bg-gradient-to-br from-green-500 to-green-600"
          >
            <template #icon>
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </StatsCard>

          <StatsCard
            title="Active Users"
            :value="formatNumber(dashboardData.lastHour.activeUsers)"
            icon-bg-class="bg-gradient-to-br from-purple-500 to-purple-600"
          >
            <template #icon>
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </template>
          </StatsCard>
        </div>
      </div>

      <!-- Last 24 Hours Metrics -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Last 24 Hours</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Orders"
            :value="formatNumber(dashboardData.last24Hours.orders)"
            icon-bg-class="bg-gradient-to-br from-orange-500 to-orange-600"
          >
            <template #icon>
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </template>
          </StatsCard>

          <StatsCard
            title="Revenue"
            :value="formatCurrency(dashboardData.last24Hours.revenue)"
            icon-bg-class="bg-gradient-to-br from-indigo-500 to-indigo-600"
          >
            <template #icon>
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </StatsCard>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="text-lg font-medium">No data available</p>
      <p class="text-sm mt-1">Real-time dashboard data will appear here</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { advancedAnalyticsApi } from '@/api/endpoints/advanced-analytics'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import type { RealtimeDashboard as RealtimeDashboardType } from '@/api/types'
import StatsCard from '@/components/admin/StatsCard.vue'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const dashboardData = ref<RealtimeDashboardType | null>(null)
const lastUpdate = ref<Date | null>(null)
let refreshInterval: number | null = null

const loadDashboard = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await advancedAnalyticsApi.getRealtimeDashboard()
    sendToTerminal('log', '[RealtimeDashboard] API Response:', response)
    
    if (response.success && response.data) {
      dashboardData.value = response.data
      lastUpdate.value = new Date()
      error.value = null
    } else {
      const errorMessage = response.error || 'Failed to load real-time dashboard'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to load real-time dashboard'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[RealtimeDashboard] Error loading dashboard:', err)
  } finally {
    isLoading.value = false
  }
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

onMounted(() => {
  loadDashboard()
  // Auto-refresh every 30 seconds
  refreshInterval = window.setInterval(() => {
    loadDashboard()
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval !== null) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.realtime-dashboard {
  @apply space-y-6;
}
</style>

