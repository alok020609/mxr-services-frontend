<template>
  <div class="scheduled-delivery">
    <h3 class="text-lg font-bold mb-4">Schedule Delivery</h3>
    
    <div v-if="scheduledDelivery" class="card mb-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="font-semibold">Scheduled for {{ formatDate(scheduledDelivery.scheduledDate) }}</p>
          <p v-if="scheduledDelivery.timeSlot" class="text-sm text-gray-600">
            Time Slot: {{ scheduledDelivery.timeSlot }}
          </p>
          <p v-if="scheduledDelivery.recipientName" class="text-sm text-gray-600">
            Recipient: {{ scheduledDelivery.recipientName }}
          </p>
        </div>
        <Button variant="secondary" size="sm" @click="showScheduleForm = true">
          Reschedule
        </Button>
      </div>
    </div>
    
    <form v-else @submit.prevent="scheduleDelivery" class="card space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
        <input
          v-model="form.scheduledDate"
          type="date"
          :min="minDate"
          class="input w-full"
          required
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Time Slot (Optional)</label>
        <select v-model="form.timeSlot" class="input w-full">
          <option value="">Select time slot</option>
          <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
          <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
          <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Recipient Name (Optional)</label>
        <Input
          v-model="form.recipientName"
          placeholder="Enter recipient name"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Recipient Phone (Optional)</label>
        <Input
          v-model="form.recipientPhone"
          type="tel"
          placeholder="Enter recipient phone"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions (Optional)</label>
        <textarea
          v-model="form.deliveryInstructions"
          rows="3"
          class="input w-full"
          placeholder="Special delivery instructions..."
        ></textarea>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        class="w-full"
        :loading="isScheduling"
      >
        Schedule Delivery
      </Button>
    </form>
    
    <!-- Reschedule Modal -->
    <div
      v-if="showScheduleForm && scheduledDelivery"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showScheduleForm = false"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h4 class="text-lg font-bold mb-4">Reschedule Delivery</h4>
        <form @submit.prevent="scheduleDelivery">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
              <input
                v-model="form.scheduledDate"
                type="date"
                :min="minDate"
                class="input w-full"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select v-model="form.timeSlot" class="input w-full">
                <option value="">Select time slot</option>
                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
              </select>
            </div>
          </div>
          <div class="flex gap-2 justify-end mt-4">
            <Button variant="secondary" @click="showScheduleForm = false">Cancel</Button>
            <Button type="submit" variant="primary" :loading="isScheduling">Reschedule</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { orderEnhancementsApi } from '@/api/endpoints/order-enhancements'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import type { ScheduledDelivery } from '@/api/types'

const props = defineProps<{
  orderId: string
  initialSchedule?: ScheduledDelivery | null
}>()

const uiStore = useUIStore()
const isScheduling = ref(false)
const showScheduleForm = ref(false)
const scheduledDelivery = ref<ScheduledDelivery | null>(props.initialSchedule || null)

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const form = ref<Partial<ScheduledDelivery>>({
  orderId: props.orderId,
  scheduledDate: '',
  timeSlot: '',
  deliveryInstructions: '',
  recipientName: '',
  recipientPhone: ''
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const scheduleDelivery = async () => {
  if (!form.value.scheduledDate) return
  
  isScheduling.value = true
  try {
    const response = await orderEnhancementsApi.scheduleDelivery(form.value as ScheduledDelivery)
    if (response.success) {
      uiStore.showNotification('success', 'Delivery scheduled successfully')
      scheduledDelivery.value = form.value as ScheduledDelivery
      showScheduleForm.value = false
    } else {
      uiStore.showNotification('error', response.error || 'Failed to schedule delivery')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to schedule delivery')
  } finally {
    isScheduling.value = false
  }
}
</script>

