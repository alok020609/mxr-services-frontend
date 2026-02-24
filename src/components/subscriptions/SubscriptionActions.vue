<template>
  <div class="subscription-actions">
    <div class="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        size="sm"
        @click="pauseSubscription"
        :loading="isPausing"
      >
        Pause
      </Button>
      <Button
        variant="secondary"
        size="sm"
        @click="resumeSubscription"
        :loading="isResuming"
      >
        Resume
      </Button>
      <Button
        variant="secondary"
        size="sm"
        @click="skipNextDelivery"
        :loading="isSkipping"
      >
        Skip Next Delivery
      </Button>
      <Button
        variant="secondary"
        size="sm"
        @click="showFrequencyModal = true"
      >
        Change Frequency
      </Button>
      <Button
        variant="danger"
        size="sm"
        @click="cancelSubscription"
        :loading="isCancelling"
      >
        Cancel
      </Button>
    </div>
    
    <!-- Frequency Modal -->
    <div
      v-if="showFrequencyModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showFrequencyModal = false"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h4 class="text-lg font-bold mb-4">Change Frequency</h4>
        <select v-model="newFrequency" class="input w-full mb-4">
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
        <div class="flex gap-2 justify-end">
          <Button variant="secondary" @click="showFrequencyModal = false">Cancel</Button>
          <Button variant="primary" @click="changeFrequency" :loading="isChangingFrequency">
            Update
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { subscriptionsApi } from '@/api/endpoints/subscriptions'
import { useUIStore } from '@/stores/ui'
import Button from '@/components/common/Button.vue'

const props = defineProps<{
  subscriptionId: string
}>()

const uiStore = useUIStore()
const isPausing = ref(false)
const isResuming = ref(false)
const isSkipping = ref(false)
const isCancelling = ref(false)
const isChangingFrequency = ref(false)
const showFrequencyModal = ref(false)
const newFrequency = ref('monthly')

const pauseSubscription = async () => {
  isPausing.value = true
  try {
    const response = await subscriptionsApi.pauseSubscription(props.subscriptionId)
    if (response.success) {
      uiStore.showNotification('success', 'Subscription paused')
      emit('updated')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to pause subscription')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to pause subscription')
  } finally {
    isPausing.value = false
  }
}

const resumeSubscription = async () => {
  isResuming.value = true
  try {
    const response = await subscriptionsApi.resumeSubscription(props.subscriptionId)
    if (response.success) {
      uiStore.showNotification('success', 'Subscription resumed')
      emit('updated')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to resume subscription')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to resume subscription')
  } finally {
    isResuming.value = false
  }
}

const skipNextDelivery = async () => {
  isSkipping.value = true
  try {
    const response = await subscriptionsApi.skipNextDelivery(props.subscriptionId)
    if (response.success) {
      uiStore.showNotification('success', 'Next delivery skipped')
      emit('updated')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to skip delivery')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to skip delivery')
  } finally {
    isSkipping.value = false
  }
}

const changeFrequency = async () => {
  isChangingFrequency.value = true
  try {
    const response = await subscriptionsApi.changeFrequency(props.subscriptionId, newFrequency.value)
    if (response.success) {
      uiStore.showNotification('success', 'Frequency updated')
      showFrequencyModal.value = false
      emit('updated')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to change frequency')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to change frequency')
  } finally {
    isChangingFrequency.value = false
  }
}

const cancelSubscription = async () => {
  if (!confirm('Are you sure you want to cancel this subscription?')) return
  
  isCancelling.value = true
  try {
    const response = await subscriptionsApi.cancelSubscription(props.subscriptionId)
    if (response.success) {
      uiStore.showNotification('success', 'Subscription cancelled')
      emit('updated')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to cancel subscription')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to cancel subscription')
  } finally {
    isCancelling.value = false
  }
}

const emit = defineEmits<{
  (e: 'updated'): void
}>()
</script>

