<template>
  <div class="compatibility-guarantees">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Compatibility Guarantees</h2>
      <p class="text-sm text-gray-600">View backward compatibility and breaking change policies</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading compatibility guarantees...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load compatibility guarantees</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadGuarantees">Retry</Button>
      </div>
    </div>

    <!-- Guarantees Display -->
    <div v-else-if="guarantees" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Compatibility Overview</h3>
        <div v-if="guarantees.guarantees" class="prose max-w-none">
          <p class="text-gray-900 whitespace-pre-wrap">{{ guarantees.guarantees }}</p>
        </div>
      </div>

      <div v-if="guarantees.backwardCompatibility" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Backward Compatibility</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Policy</label>
            <p class="text-gray-900">{{ guarantees.backwardCompatibility.policy }}</p>
          </div>
          <div v-if="guarantees.backwardCompatibility.duration">
            <label class="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <p class="text-gray-900">{{ guarantees.backwardCompatibility.duration }}</p>
          </div>
        </div>
      </div>

      <div v-if="guarantees.breakingChanges" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Breaking Changes</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Policy</label>
            <p class="text-gray-900">{{ guarantees.breakingChanges.policy }}</p>
          </div>
          <div v-if="guarantees.breakingChanges.noticePeriod">
            <label class="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
            <p class="text-gray-900">{{ guarantees.breakingChanges.noticePeriod }}</p>
          </div>
        </div>
      </div>

      <div v-if="guarantees.versionSupport" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Version Support</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-if="guarantees.versionSupport.current && guarantees.versionSupport.current.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-2">Current</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="version in guarantees.versionSupport.current"
                :key="version"
                class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                v{{ version }}
              </span>
            </div>
          </div>
          <div v-if="guarantees.versionSupport.supported && guarantees.versionSupport.supported.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-2">Supported</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="version in guarantees.versionSupport.supported"
                :key="version"
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                v{{ version }}
              </span>
            </div>
          </div>
          <div v-if="guarantees.versionSupport.deprecated && guarantees.versionSupport.deprecated.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-2">Deprecated</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="version in guarantees.versionSupport.deprecated"
                :key="version"
                class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
              >
                v{{ version }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 border rounded-lg bg-gray-50">
      <p class="text-gray-500">No compatibility guarantees information available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiDeprecationApi } from '@/api/endpoints/api-deprecation'
import { useUIStore } from '@/stores/ui'
import type { CompatibilityGuarantees } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const guarantees = ref<CompatibilityGuarantees | null>(null)

const loadGuarantees = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiDeprecationApi.getCompatibilityGuarantees()
    if (response.success && response.data) {
      guarantees.value = response.data
    } else {
      error.value = response.error || 'Failed to load compatibility guarantees'
    }
  } catch (err: any) {
    let errorMessage = 'Failed to load compatibility guarantees'
    
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
  loadGuarantees()
})
</script>

