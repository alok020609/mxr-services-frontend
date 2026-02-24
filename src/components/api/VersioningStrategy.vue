<template>
  <div class="versioning-strategy">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Versioning Strategy</h2>
      <p class="text-sm text-gray-600">View API versioning approach and current versions</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading versioning strategy...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load versioning strategy</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadStrategy">Retry</Button>
      </div>
    </div>

    <!-- Strategy Display -->
    <div v-else-if="strategy" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Strategy Overview</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Approach</label>
            <p class="text-gray-900">{{ strategy.approach || 'Not specified' }}</p>
          </div>
          <div v-if="strategy.description">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p class="text-gray-900 whitespace-pre-wrap">{{ strategy.description }}</p>
          </div>
          <div v-if="strategy.strategy">
            <label class="block text-sm font-medium text-gray-700 mb-1">Strategy Details</label>
            <p class="text-gray-900 whitespace-pre-wrap">{{ strategy.strategy }}</p>
          </div>
        </div>
      </div>

      <div v-if="strategy.currentVersions && strategy.currentVersions.length > 0" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Current API Versions</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="version in strategy.currentVersions"
            :key="version"
            class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
          >
            v{{ version }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 border rounded-lg bg-gray-50">
      <p class="text-gray-500">No versioning strategy information available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiDeprecationApi } from '@/api/endpoints/api-deprecation'
import { useUIStore } from '@/stores/ui'
import type { VersioningStrategy } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const strategy = ref<VersioningStrategy | null>(null)

const loadStrategy = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiDeprecationApi.getVersioningStrategy()
    if (response.success && response.data) {
      strategy.value = response.data
    } else {
      error.value = response.error || 'Failed to load versioning strategy'
    }
  } catch (err: any) {
    let errorMessage = 'Failed to load versioning strategy'
    
    if (err.response) {
      if (err.response.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response.status === 500) {
        errorMessage = 'Server error: The backend service encountered an issue. Please try again later.'
      } else {
        errorMessage = `Request failed with status ${err.response.status}`
      }
    } else if (err.message) {
      errorMessage = err.message
    }
    
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadStrategy()
})
</script>

