<template>
  <div class="login-attempts">
    <h3 class="text-lg font-bold mb-4">Login Attempts</h3>
    
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="attempts.length === 0" class="text-center py-8 text-gray-500">
      <p>No login attempts found</p>
    </div>
    
    <div v-else class="space-y-2">
      <div
        v-for="attempt in attempts"
        :key="attempt.id"
        :class="[
          'card flex items-center justify-between',
          attempt.success ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
        ]"
      >
        <div>
          <div class="flex items-center gap-2">
            <span :class="[
              'px-2 py-0.5 rounded text-xs font-medium',
              attempt.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              {{ attempt.success ? 'Success' : 'Failed' }}
            </span>
            <p class="text-sm text-gray-600">{{ attempt.ipAddress }}</p>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ attempt.userAgent }} • {{ formatDate(attempt.attemptedAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { securityApi, type LoginAttempt } from '@/api/endpoints/security'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const attempts = ref<LoginAttempt[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadAttempts = async () => {
  isLoading.value = true
  try {
    const response = await securityApi.getLoginAttempts()
    if (response.success && response.data) {
      attempts.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load login attempts')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadAttempts()
})
</script>

