<template>
  <div class="version-lifecycle">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Version Lifecycle</h2>
      <p class="text-sm text-gray-600">Check lifecycle status of specific API versions</p>
    </div>

    <!-- Version Input Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-end space-x-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            API Version <span class="text-red-500">*</span>
          </label>
          <input
            v-model="versionInput"
            type="text"
            class="input"
            placeholder="e.g., 1.0 or v1.0"
            @keyup.enter="loadLifecycle"
          />
        </div>
        <Button variant="primary" @click="loadLifecycle" :loading="isLoading">
          Get Lifecycle Info
        </Button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load version lifecycle</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadLifecycle">Retry</Button>
      </div>
    </div>

    <!-- Lifecycle Display -->
    <div v-else-if="lifecycle" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Version {{ lifecycle.version }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span :class="getStatusClass(lifecycle.status)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ lifecycle.status }}
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="lifecycle.releaseDate">
              <label class="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
              <p class="text-gray-900">{{ formatDate(lifecycle.releaseDate) }}</p>
            </div>
            <div v-if="lifecycle.deprecationDate">
              <label class="block text-sm font-medium text-gray-700 mb-1">Deprecation Date</label>
              <p class="text-gray-900">{{ formatDate(lifecycle.deprecationDate) }}</p>
            </div>
            <div v-if="lifecycle.sunsetDate">
              <label class="block text-sm font-medium text-gray-700 mb-1">Sunset Date</label>
              <p class="text-gray-900">{{ formatDate(lifecycle.sunsetDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="lifecycle.lifecycleStages && lifecycle.lifecycleStages.length > 0" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Lifecycle Timeline</h3>
        <div class="space-y-4">
          <div
            v-for="(stage, index) in lifecycle.lifecycleStages"
            :key="index"
            class="flex items-start border-l-4 border-primary-500 pl-4 py-2"
          >
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ stage.stage }}</div>
              <div class="text-sm text-gray-600">{{ formatDate(stage.date) }}</div>
              <div v-if="stage.description" class="text-sm text-gray-500 mt-1">{{ stage.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading" class="text-center py-12 border rounded-lg bg-gray-50">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500">Enter a version number above to view its lifecycle information</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { apiDeprecationApi } from '@/api/endpoints/api-deprecation'
import { useUIStore } from '@/stores/ui'
import type { VersionLifecycle } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import { formatDate } from '@/utils/formatters'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const lifecycle = ref<VersionLifecycle | null>(null)
const versionInput = ref('')

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    deprecated: 'bg-yellow-100 text-yellow-800',
    sunset: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const loadLifecycle = async () => {
  if (!versionInput.value.trim()) {
    uiStore.showNotification('error', 'Please enter a version number')
    return
  }

  isLoading.value = true
  error.value = null
  lifecycle.value = null
  
  // Remove 'v' prefix if present
  const version = versionInput.value.trim().replace(/^v/i, '')
  
  try {
    const response = await apiDeprecationApi.getVersionLifecycle(version)
    if (response.success && response.data) {
      lifecycle.value = response.data
    } else {
      error.value = response.error || 'Failed to load version lifecycle'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to load version lifecycle'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}
</script>

