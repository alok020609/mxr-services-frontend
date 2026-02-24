<template>
  <div class="customer-segments">
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>
    
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="loadSegments" variant="primary">Retry</Button>
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="segment in segments"
        :key="segment.id"
        class="card"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-bold mb-1">{{ segment.name }}</h3>
            <p v-if="segment.description" class="text-sm text-gray-600 mb-3">
              {{ segment.description }}
            </p>
            <div class="flex items-center gap-4 text-sm">
              <div>
                <span class="text-gray-600">Customers:</span>
                <span class="font-semibold ml-1">{{ segment.customerCount }}</span>
              </div>
              <div v-if="segment.createdAt">
                <span class="text-gray-600">Created:</span>
                <span class="font-semibold ml-1">{{ formatDate(segment.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="segment.criteria && Object.keys(segment.criteria).length > 0" class="mt-4 pt-4 border-t">
          <p class="text-sm font-medium text-gray-700 mb-2">Criteria:</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(value, key) in segment.criteria"
              :key="key"
              class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {{ key }}: {{ typeof value === 'object' ? JSON.stringify(value) : value }}
            </span>
          </div>
        </div>
      </div>
      
      <p v-if="segments.length === 0" class="text-center text-gray-500 py-8">
        No customer segments found
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { crmApi } from '@/api/endpoints/crm'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import type { CustomerSegment } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref('')
const segments = ref<CustomerSegment[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadSegments = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await crmApi.getSegments()
    if (response.success && response.data) {
      segments.value = Array.isArray(response.data) ? response.data : []
    } else {
      error.value = response.error || 'Failed to load customer segments'
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred while loading customer segments'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSegments()
})
</script>

