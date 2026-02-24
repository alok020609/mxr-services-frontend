<template>
  <div class="product-alert-button">
    <Button
      v-if="!hasActiveAlert"
      variant="secondary"
      size="sm"
      @click="showAlertModal = true"
      :disabled="isLoading"
    >
      <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      Notify Me
    </Button>
    
    <div v-else class="text-sm text-green-600 flex items-center gap-1">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Alert active
    </div>
    
    <!-- Alert Modal -->
    <div
      v-if="showAlertModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAlertModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Create Product Alert</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
            <select v-model="alertType" class="input w-full">
              <option value="price_drop">Price Drop</option>
              <option value="back_in_stock">Back in Stock</option>
              <option value="new_variant">New Variant Available</option>
            </select>
          </div>
          
          <div v-if="alertType === 'price_drop'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Notify me when price drops below (optional)
            </label>
            <input
              v-model.number="targetPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter target price"
              class="input w-full"
            />
          </div>
          
          <div class="flex justify-end gap-2">
            <Button variant="secondary" size="sm" @click="showAlertModal = false">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              @click="createAlert"
              :loading="isCreating"
            >
              Create Alert
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { experienceApi } from '@/api/endpoints/experience'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/common/Button.vue'
import type { ProductAlert } from '@/api/types'

interface Props {
  productId: string
  currentPrice?: number
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const authStore = useAuthStore()
const isLoading = ref(false)
const isCreating = ref(false)
const showAlertModal = ref(false)
const alerts = ref<ProductAlert[]>([])
const alertType = ref('back_in_stock')
const targetPrice = ref<number | undefined>(undefined)

const hasActiveAlert = computed(() => {
  return alerts.value.some(
    alert => alert.productId === props.productId && alert.status === 'active'
  )
})

const loadAlerts = async () => {
  if (!authStore.isAuthenticated) return
  
  isLoading.value = true
  try {
    const response = await experienceApi.getProductAlerts()
    if (response.success && response.data) {
      alerts.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    // Silently fail
    console.error('Failed to load alerts:', error)
  } finally {
    isLoading.value = false
  }
}

const createAlert = async () => {
  if (!authStore.isAuthenticated) {
    uiStore.showNotification('warning', 'Please login to create alerts')
    return
  }
  
  isCreating.value = true
  try {
    const response = await experienceApi.createProductAlert(props.productId, alertType.value)
    if (response.success) {
      uiStore.showNotification('success', 'Alert created! We\'ll notify you when the condition is met.')
      showAlertModal.value = false
      await loadAlerts()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to create alert')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to create alert')
  } finally {
    isCreating.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadAlerts()
  }
})
</script>

