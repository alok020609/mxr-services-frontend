<template>
  <div class="order-state-history">
    <h3 class="text-lg font-bold mb-4">State History</h3>
    
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="history.length === 0" class="text-center py-8 text-gray-500">
      <p>No state history found</p>
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="(entry, index) in history"
        :key="entry.id"
        class="flex gap-4"
      >
        <div class="flex flex-col items-center">
          <div class="w-3 h-3 rounded-full bg-primary-600"></div>
          <div v-if="index < history.length - 1" class="w-0.5 h-full bg-gray-300 mt-1"></div>
        </div>
        <div class="flex-1 pb-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">{{ entry.transition }}</p>
              <p class="text-sm text-gray-600">
                {{ entry.fromState }} → {{ entry.toState }}
              </p>
            </div>
            <span class="text-xs text-gray-500">{{ formatDate(entry.createdAt) }}</span>
          </div>
          <div v-if="entry.reason" class="mt-2 text-sm text-gray-600">
            <p><strong>Reason:</strong> {{ entry.reason }}</p>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Performed by: {{ entry.performedBy }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { orderStateApi, type OrderStateHistory } from '@/api/endpoints/order-state'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps<{
  orderId: string
}>()

const uiStore = useUIStore()
const isLoading = ref(false)
const history = ref<OrderStateHistory[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadHistory = async () => {
  isLoading.value = true
  try {
    const response = await orderStateApi.getOrderStateHistory(props.orderId)
    if (response.success && response.data) {
      history.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load state history')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadHistory()
})
</script>

