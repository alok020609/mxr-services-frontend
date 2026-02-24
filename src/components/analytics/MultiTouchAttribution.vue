<template>
  <div class="multi-touch-attribution">
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900 mb-2">Multi-Touch Attribution</h3>
      <p class="text-sm text-gray-600">Analyze the complete customer journey and touchpoints</p>
    </div>

    <!-- Input Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-2">User ID <span class="text-red-500">*</span></label>
          <input
            v-model="userId"
            type="text"
            class="input"
            placeholder="Enter user ID"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Start Date</label>
          <input
            v-model="dateRange.start"
            type="date"
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">End Date</label>
          <input
            v-model="dateRange.end"
            type="date"
            class="input"
          />
        </div>
      </div>
      <Button variant="primary" @click="getAttribution" :loading="isLoading">
        Get Attribution
      </Button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to get attribution data</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="getAttribution">Retry</Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !attributionData" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading attribution data...</span>
    </div>

    <!-- Results -->
    <div v-else-if="attributionData" class="space-y-6">
      <!-- First and Last Touch -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-lg font-semibold mb-4">First Touch</h4>
          <div v-if="hasUTMParams(attributionData.firstTouch)" class="space-y-2">
            <div v-if="attributionData.firstTouch.utm_source" class="text-sm">
              <span class="font-medium text-gray-600">Source:</span>
              <span class="ml-2 text-gray-900">{{ attributionData.firstTouch.utm_source }}</span>
            </div>
            <div v-if="attributionData.firstTouch.utm_medium" class="text-sm">
              <span class="font-medium text-gray-600">Medium:</span>
              <span class="ml-2 text-gray-900">{{ attributionData.firstTouch.utm_medium }}</span>
            </div>
            <div v-if="attributionData.firstTouch.utm_campaign" class="text-sm">
              <span class="font-medium text-gray-600">Campaign:</span>
              <span class="ml-2 text-gray-900">{{ attributionData.firstTouch.utm_campaign }}</span>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">No UTM parameters available</div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-lg font-semibold mb-4">Last Touch</h4>
          <div v-if="hasUTMParams(attributionData.lastTouch)" class="space-y-2">
            <div v-if="attributionData.lastTouch.utm_source" class="text-sm">
              <span class="font-medium text-gray-600">Source:</span>
              <span class="ml-2 text-gray-900">{{ attributionData.lastTouch.utm_source }}</span>
            </div>
            <div v-if="attributionData.lastTouch.utm_medium" class="text-sm">
              <span class="font-medium text-gray-600">Medium:</span>
              <span class="ml-2 text-gray-900">{{ attributionData.lastTouch.utm_medium }}</span>
            </div>
            <div v-if="attributionData.lastTouch.utm_campaign" class="text-sm">
              <span class="font-medium text-gray-600">Campaign:</span>
              <span class="ml-2 text-gray-900">{{ attributionData.lastTouch.utm_campaign }}</span>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">No UTM parameters available</div>
        </div>
      </div>

      <!-- Touchpoints Timeline -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h4 class="text-lg font-semibold mb-4">Touchpoints Timeline</h4>
        <div v-if="attributionData.touchpoints.length > 0" class="space-y-4">
          <div
            v-for="(touchpoint, index) in attributionData.touchpoints"
            :key="index"
            class="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-0"
          >
            <div :class="getEventTypeColor(touchpoint.eventType)" class="absolute left-0 top-0 w-4 h-4 rounded-full -ml-2"></div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span :class="getEventTypeBadgeClass(touchpoint.eventType)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ formatEventType(touchpoint.eventType) }}
                </span>
                <span class="text-sm text-gray-500">{{ formatDate(touchpoint.timestamp) }}</span>
              </div>
              <div v-if="hasUTMParams(touchpoint.metadata)" class="mt-2 text-sm text-gray-600">
                <div v-if="touchpoint.metadata.utm_source" class="inline-block mr-4">
                  <span class="font-medium">Source:</span> {{ touchpoint.metadata.utm_source }}
                </div>
                <div v-if="touchpoint.metadata.utm_medium" class="inline-block mr-4">
                  <span class="font-medium">Medium:</span> {{ touchpoint.metadata.utm_medium }}
                </div>
                <div v-if="touchpoint.metadata.utm_campaign" class="inline-block">
                  <span class="font-medium">Campaign:</span> {{ touchpoint.metadata.utm_campaign }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>No touchpoints found for this user</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="text-lg font-medium">Enter a user ID to view attribution data</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { advancedAnalyticsApi } from '@/api/endpoints/advanced-analytics'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatDate } from '@/utils/formatters'
import type { AttributionData } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const userId = ref('')
const attributionData = ref<AttributionData | null>(null)

const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const getAttribution = async () => {
  if (!userId.value.trim()) {
    uiStore.showNotification('error', 'Please enter a user ID')
    return
  }

  isLoading.value = true
  error.value = null
  attributionData.value = null

  try {
    const startDate = dateRange.value.start ? new Date(dateRange.value.start).toISOString() : undefined
    const endDate = dateRange.value.end ? new Date(dateRange.value.end + 'T23:59:59').toISOString() : undefined

    const response = await advancedAnalyticsApi.getAttribution(userId.value.trim(), startDate, endDate)
    sendToTerminal('log', '[MultiTouchAttribution] API Response:', response)

    if (response.success && response.data) {
      attributionData.value = response.data
      error.value = null
    } else {
      const errorMessage = response.error || 'Failed to get attribution data'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to get attribution data'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[MultiTouchAttribution] Error getting attribution:', err)
  } finally {
    isLoading.value = false
  }
}

const hasUTMParams = (obj: any): boolean => {
  if (!obj) return false
  return !!(obj.utm_source || obj.utm_medium || obj.utm_campaign || obj.utm_term || obj.utm_content)
}

const formatEventType = (eventType: string): string => {
  return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getEventTypeColor = (eventType: string): string => {
  const colors: Record<string, string> = {
    PAGE_VIEW: 'bg-blue-500',
    PRODUCT_VIEW: 'bg-purple-500',
    CART_ADD: 'bg-yellow-500',
    ORDER_PLACED: 'bg-green-500'
  }
  return colors[eventType] || 'bg-gray-500'
}

const getEventTypeBadgeClass = (eventType: string): string => {
  const classes: Record<string, string> = {
    PAGE_VIEW: 'bg-blue-100 text-blue-800',
    PRODUCT_VIEW: 'bg-purple-100 text-purple-800',
    CART_ADD: 'bg-yellow-100 text-yellow-800',
    ORDER_PLACED: 'bg-green-100 text-green-800'
  }
  return classes[eventType] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  // Set default end date to today
  dateRange.value.end = new Date().toISOString().split('T')[0]
})
</script>

<style scoped>
.multi-touch-attribution {
  @apply space-y-6;
}
</style>

