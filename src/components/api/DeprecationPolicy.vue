<template>
  <div class="deprecation-policy">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Deprecation Policy</h2>
      <p class="text-sm text-gray-600">View API deprecation guidelines and support periods</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading deprecation policy...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load deprecation policy</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadPolicy">Retry</Button>
      </div>
    </div>

    <!-- Policy Display -->
    <div v-else-if="policy" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Policy Overview</h3>
        <div class="space-y-4">
          <div v-if="policy.policy">
            <label class="block text-sm font-medium text-gray-700 mb-1">Policy</label>
            <p class="text-gray-900 whitespace-pre-wrap">{{ policy.policy }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-if="policy.deprecationPeriod !== undefined" class="bg-white rounded-lg shadow-md p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Deprecation Period</label>
          <p class="text-2xl font-bold text-primary-600">{{ policy.deprecationPeriod }}</p>
          <p class="text-sm text-gray-500 mt-1">days</p>
        </div>
        <div v-if="policy.supportPeriod !== undefined" class="bg-white rounded-lg shadow-md p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Support Period</label>
          <p class="text-2xl font-bold text-green-600">{{ policy.supportPeriod }}</p>
          <p class="text-sm text-gray-500 mt-1">days</p>
        </div>
        <div v-if="policy.noticePeriod !== undefined" class="bg-white rounded-lg shadow-md p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Notice Period</label>
          <p class="text-2xl font-bold text-yellow-600">{{ policy.noticePeriod }}</p>
          <p class="text-sm text-gray-500 mt-1">days</p>
        </div>
      </div>

      <div v-if="policy.guidelines && policy.guidelines.length > 0" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Guidelines</h3>
        <ul class="space-y-2">
          <li v-for="(guideline, index) in policy.guidelines" :key="index" class="flex items-start">
            <svg class="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-900">{{ guideline }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 border rounded-lg bg-gray-50">
      <p class="text-gray-500">No deprecation policy information available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiDeprecationApi } from '@/api/endpoints/api-deprecation'
import { useUIStore } from '@/stores/ui'
import type { DeprecationPolicy } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const policy = ref<DeprecationPolicy | null>(null)

const loadPolicy = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiDeprecationApi.getDeprecationPolicy()
    if (response.success && response.data) {
      policy.value = response.data
    } else {
      error.value = response.error || 'Failed to load deprecation policy'
    }
  } catch (err: any) {
    let errorMessage = 'Failed to load deprecation policy'
    
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
  loadPolicy()
})
</script>

