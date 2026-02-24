<template>
  <div class="rfm-analysis">
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>
    
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="loadData" variant="primary">Retry</Button>
    </div>
    
    <div v-else-if="data" class="space-y-6">
      <!-- RFM Scores Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card text-center">
          <p class="text-sm text-gray-600 mb-2">Recency Score</p>
          <div class="mb-2">
            <span class="text-4xl font-bold" :class="getScoreColor(data.recency.score)">
              {{ data.recency.score }}
            </span>
            <span class="text-gray-500">/5</span>
          </div>
          <p class="text-sm text-gray-600">{{ data.recency.daysSinceLastOrder }} days since last order</p>
          <p class="text-xs text-gray-500 mt-1">{{ data.recency.interpretation }}</p>
        </div>
        
        <div class="card text-center">
          <p class="text-sm text-gray-600 mb-2">Frequency Score</p>
          <div class="mb-2">
            <span class="text-4xl font-bold" :class="getScoreColor(data.frequency.score)">
              {{ data.frequency.score }}
            </span>
            <span class="text-gray-500">/5</span>
          </div>
          <p class="text-sm text-gray-600">{{ data.frequency.totalOrders }} total orders</p>
          <p class="text-xs text-gray-500 mt-1">{{ data.frequency.interpretation }}</p>
        </div>
        
        <div class="card text-center">
          <p class="text-sm text-gray-600 mb-2">Monetary Score</p>
          <div class="mb-2">
            <span class="text-4xl font-bold" :class="getScoreColor(data.monetary.score)">
              {{ data.monetary.score }}
            </span>
            <span class="text-gray-500">/5</span>
          </div>
          <p class="text-sm text-gray-600">{{ formatPrice(data.monetary.totalSpent) }} spent</p>
          <p class="text-xs text-gray-500 mt-1">{{ data.monetary.interpretation }}</p>
        </div>
      </div>
      
      <!-- RFM Segment -->
      <div class="card">
        <h3 class="text-lg font-bold mb-4">Customer Segment</h3>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-primary-600 mb-1">{{ data.segment }}</p>
            <p class="text-sm text-gray-600">Based on RFM analysis</p>
          </div>
          <div :class="getSegmentBadgeClass(data.segment)" class="px-4 py-2 rounded-lg">
            <span class="font-semibold">{{ data.segment }}</span>
          </div>
        </div>
      </div>
      
      <!-- Recommendations -->
      <div v-if="data.recommendations && data.recommendations.length > 0" class="card">
        <h3 class="text-lg font-bold mb-4">Recommendations</h3>
        <ul class="space-y-2">
          <li
            v-for="(recommendation, index) in data.recommendations"
            :key="index"
            class="flex items-start gap-2 p-3 bg-blue-50 rounded-lg"
          >
            <svg class="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p class="text-sm">{{ recommendation }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { crmApi } from '@/api/endpoints/crm'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import type { RFMAnalysis } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()

interface Props {
  userId: string
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref('')
const data = ref<RFMAnalysis | null>(null)

const getScoreColor = (score: number) => {
  if (score >= 4) return 'text-green-600'
  if (score >= 3) return 'text-yellow-600'
  return 'text-red-600'
}

const getSegmentBadgeClass = (segment: string) => {
  const segmentLower = segment.toLowerCase()
  if (segmentLower.includes('champion') || segmentLower.includes('loyal')) {
    return 'bg-green-100 text-green-800'
  }
  if (segmentLower.includes('at risk') || segmentLower.includes('lost')) {
    return 'bg-red-100 text-red-800'
  }
  if (segmentLower.includes('potential') || segmentLower.includes('new')) {
    return 'bg-blue-100 text-blue-800'
  }
  return 'bg-gray-100 text-gray-800'
}

const loadData = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await crmApi.getRFM(props.userId)
    if (response.success && response.data) {
      data.value = response.data
    } else {
      error.value = response.error || 'Failed to load RFM analysis'
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred while loading RFM analysis'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

