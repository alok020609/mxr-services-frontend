<template>
  <div class="api-tiers">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">API Tiers</h2>
      <p class="text-sm text-gray-600">View and manage user API rate limiting tiers</p>
    </div>

    <!-- Current Tier Display -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Current API Tier</h3>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <LoadingSpinner size="md" />
        <span class="ml-2 text-gray-600">Loading tier information...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800 text-sm">{{ error }}</p>
        <Button variant="primary" size="sm" class="mt-2" @click="loadTier">Retry</Button>
      </div>

      <!-- Tier Display -->
      <div v-else-if="currentTier" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Current Tier</label>
          <span :class="getTierClass(currentTier.tier)" class="px-3 py-1 rounded-full text-sm font-medium">
            {{ currentTier.tier.toUpperCase() }}
          </span>
        </div>

        <div v-if="currentTier.rateLimit" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-if="currentTier.rateLimit.requestsPerMinute">
            <label class="block text-sm font-medium text-gray-700 mb-1">Per Minute</label>
            <p class="text-2xl font-bold text-primary-600">{{ currentTier.rateLimit.requestsPerMinute }}</p>
          </div>
          <div v-if="currentTier.rateLimit.requestsPerHour">
            <label class="block text-sm font-medium text-gray-700 mb-1">Per Hour</label>
            <p class="text-2xl font-bold text-primary-600">{{ currentTier.rateLimit.requestsPerHour }}</p>
          </div>
          <div v-if="currentTier.rateLimit.requestsPerDay">
            <label class="block text-sm font-medium text-gray-700 mb-1">Per Day</label>
            <p class="text-2xl font-bold text-primary-600">{{ currentTier.rateLimit.requestsPerDay }}</p>
          </div>
        </div>

        <div v-if="currentTier.features && currentTier.features.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-2">Features</label>
          <ul class="space-y-1">
            <li v-for="(feature, index) in currentTier.features" :key="index" class="flex items-center text-sm text-gray-700">
              <svg class="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Set Tier Form -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold mb-4">Update API Tier</h3>
      
      <form @submit.prevent="updateTier" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tier <span class="text-red-500">*</span>
          </label>
          <select v-model="form.tier" class="input" required>
            <option value="">Select tier</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            User ID (Optional - leave empty for current user)
          </label>
          <input
            v-model="form.userId"
            type="text"
            class="input"
            placeholder="Enter user ID (admin only)"
          />
        </div>

        <div v-if="apiError" class="p-3 bg-red-50 border border-red-200 rounded">
          <p class="text-red-800 text-sm">{{ apiError }}</p>
        </div>

        <Button type="submit" variant="primary" :loading="isSubmitting" class="w-full">
          Update Tier
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiGatewayApi } from '@/api/endpoints/api-gateway'
import { useUIStore } from '@/stores/ui'
import type { ApiTier } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const apiError = ref<string | null>(null)
const currentTier = ref<ApiTier | null>(null)

const form = ref<ApiTier>({
  tier: 'free',
  userId: undefined
})

const getTierClass = (tier: string) => {
  const classes: Record<string, string> = {
    free: 'bg-gray-100 text-gray-800',
    basic: 'bg-blue-100 text-blue-800',
    premium: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-green-100 text-green-800'
  }
  return classes[tier] || 'bg-gray-100 text-gray-800'
}

const loadTier = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiGatewayApi.getUserTier()
    if (response.success && response.data) {
      currentTier.value = response.data
    } else {
      error.value = response.error || 'Failed to load API tier'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to load API tier'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const updateTier = async () => {
  isSubmitting.value = true
  apiError.value = null
  try {
    const response = await apiGatewayApi.setUserTier(form.value)
    if (response.success) {
      uiStore.showNotification('success', 'API tier updated successfully')
      await loadTier()
      form.value = {
        tier: 'free',
        userId: undefined
      }
    } else {
      apiError.value = response.error || 'Failed to update API tier'
    }
  } catch (err: any) {
    apiError.value = err.response?.data?.error || err.message || 'Failed to update API tier'
    uiStore.showNotification('error', apiError.value)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadTier()
})
</script>

