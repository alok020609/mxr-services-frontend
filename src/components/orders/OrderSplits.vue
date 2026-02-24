<template>
  <div class="order-splits">
    <h3 class="text-lg font-bold mb-4">Order Splits</h3>
    
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="splits.length === 0" class="text-center py-8 text-gray-500">
      <p>No splits found for this order</p>
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="split in splits"
        :key="split.id"
        class="card"
      >
        <div class="flex items-center justify-between mb-2">
          <div>
            <h4 class="font-semibold capitalize">{{ split.splitType }} Split</h4>
            <p class="text-sm text-gray-600">Status: {{ split.status }}</p>
          </div>
          <span class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
            {{ split.splitType }}
          </span>
        </div>
        
        <div class="mt-3">
          <p class="text-sm font-medium mb-2">Items in this split:</p>
          <ul class="space-y-1">
            <li
              v-for="(item, index) in split.items"
              :key="index"
              class="text-sm text-gray-600"
            >
              Item {{ item.itemId }} - Quantity: {{ item.quantity }}
            </li>
          </ul>
        </div>
        
        <p class="text-xs text-gray-500 mt-3">
          Created: {{ formatDate(split.createdAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { orderEnhancementsApi } from '@/api/endpoints/order-enhancements'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { OrderSplit } from '@/api/types'

const props = defineProps<{
  orderId: string
}>()

const uiStore = useUIStore()
const isLoading = ref(false)
const splits = ref<OrderSplit[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadSplits = async () => {
  isLoading.value = true
  try {
    const response = await orderEnhancementsApi.getOrderSplits(props.orderId)
    if (response.success && response.data) {
      splits.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load order splits')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSplits()
})
</script>

