<template>
  <div class="waitlist-button">
    <Button
      v-if="!isOnWaitlist"
      variant="secondary"
      class="w-full"
      @click="joinWaitlist"
      :loading="isLoading"
      :disabled="isLoading"
    >
      <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      Join Waitlist
    </Button>
    
    <div v-else class="p-3 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-medium text-green-800">You're on the waitlist</span>
        </div>
        <button
          @click="removeFromWaitlist"
          class="text-sm text-red-600 hover:text-red-800"
          :disabled="isLoading"
        >
          Remove
        </button>
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
import type { WaitlistItem } from '@/api/types'

interface Props {
  productId: string
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const authStore = useAuthStore()
const isLoading = ref(false)
const waitlistItems = ref<WaitlistItem[]>([])

const isOnWaitlist = computed(() => {
  return waitlistItems.value.some(item => item.productId === props.productId && item.status === 'waiting')
})

const loadWaitlist = async () => {
  if (!authStore.isAuthenticated) return
  
  isLoading.value = true
  try {
    const response = await experienceApi.getWaitlist()
    if (response.success && response.data) {
      waitlistItems.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    // Silently fail - not critical
    console.error('Failed to load waitlist:', error)
  } finally {
    isLoading.value = false
  }
}

const joinWaitlist = async () => {
  if (!authStore.isAuthenticated) {
    uiStore.showNotification('warning', 'Please login to join the waitlist')
    return
  }
  
  isLoading.value = true
  try {
    const response = await experienceApi.addToWaitlist(props.productId)
    if (response.success) {
      uiStore.showNotification('success', 'Added to waitlist! We\'ll notify you when this product is back in stock.')
      await loadWaitlist()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to join waitlist')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to join waitlist')
  } finally {
    isLoading.value = false
  }
}

const removeFromWaitlist = async () => {
  // Note: API might not support removal directly, this would need backend support
  // For now, we'll just show a message
  uiStore.showNotification('info', 'To remove from waitlist, please visit your waitlist page')
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadWaitlist()
  }
})
</script>

