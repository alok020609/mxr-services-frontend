<template>
  <div class="activity-feed">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Activity Feed</h3>
      <div class="flex items-center space-x-2">
        <select
          v-model="limit"
          @change="loadActivities"
          class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option :value="25">25 items</option>
          <option :value="50">50 items</option>
          <option :value="100">100 items</option>
        </select>
        <Button variant="secondary" size="sm" @click="loadActivities" :loading="isLoading">
          Refresh
        </Button>
      </div>
    </div>

    <!-- Filter -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search activities..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        @input="handleSearch"
      />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner size="sm" />
      <span class="ml-2 text-gray-600">Loading activities...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-800 font-medium mb-2">Unable to load activities</p>
        <p class="text-red-600 text-sm mb-4">{{ error }}</p>
        <Button variant="primary" size="sm" @click="loadActivities">Retry</Button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredActivities.length === 0" class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>No activities found</p>
      <p class="text-sm mt-1" v-if="searchQuery">Try adjusting your search</p>
      <p class="text-sm mt-1 text-gray-400" v-else>Activity feed will appear here as admin actions are performed</p>
    </div>

    <!-- Timeline -->
    <div v-else class="space-y-4">
      <div
        v-for="activity in filteredActivities"
        :key="activity.id"
        class="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-0"
      >
        <div class="absolute left-0 top-0 w-4 h-4 bg-primary-500 rounded-full -ml-2"></div>
        <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <span class="font-semibold text-gray-900">{{ activity.action }}</span>
                <span v-if="activity.resource" class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {{ activity.resource }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-1">
                <span class="font-medium">{{ activity.userName || activity.user }}</span>
                <span v-if="activity.resourceId" class="text-gray-500">
                  • {{ activity.resource }} #{{ activity.resourceId }}
                </span>
              </p>
              <p v-if="activity.metadata" class="text-xs text-gray-500 mt-1">
                {{ formatMetadata(activity.metadata) }}
              </p>
              <p class="text-xs text-gray-400 mt-2">
                {{ formatDate(activity.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { adminApi } from '@/api/endpoints/admin'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatDate } from '@/utils/formatters'
import type { Activity } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const activities = ref<Activity[]>([])
const limit = ref(50)
const searchQuery = ref('')

const filteredActivities = computed(() => {
  if (!searchQuery.value) {
    return activities.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return activities.value.filter(activity => 
    activity.action.toLowerCase().includes(query) ||
    activity.userName?.toLowerCase().includes(query) ||
    activity.user.toLowerCase().includes(query) ||
    activity.resource?.toLowerCase().includes(query) ||
    JSON.stringify(activity.metadata || {}).toLowerCase().includes(query)
  )
})

const loadActivities = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await adminApi.getActivity(limit.value)
    sendToTerminal('log', '[ActivityFeed] API Response:', response)
    
    if (response.success && response.data) {
      activities.value = Array.isArray(response.data) ? response.data : []
      error.value = null
    } else {
      const errorMessage = response.error || 'Failed to load activities. The activity feed may not be available yet.'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
      activities.value = []
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to load activities. The activity feed may not be available yet.'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[ActivityFeed] Error loading activities:', err)
    activities.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  // Filtering is handled by computed property
}

const formatMetadata = (metadata: any): string => {
  if (!metadata) return ''
  if (typeof metadata === 'string') return metadata
  try {
    return JSON.stringify(metadata)
  } catch {
    return String(metadata)
  }
}

onMounted(() => {
  loadActivities()
})
</script>

<style scoped>
.activity-feed {
  @apply space-y-4;
}
</style>

