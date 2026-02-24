<template>
  <div class="create-ticket">
    <h3 class="text-lg font-bold mb-4">Create Support Ticket</h3>
    <form @submit.prevent="createTicket" class="space-y-4">
      <Input
        v-model="form.subject"
        label="Subject"
        placeholder="Enter ticket subject"
        required
      />
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select v-model="form.category" class="input w-full">
          <option value="">Select category</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="order">Order</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          v-model="form.description"
          rows="6"
          class="input w-full"
          placeholder="Describe your issue..."
          required
        ></textarea>
      </div>
      <Button type="submit" variant="primary" class="w-full" :loading="isCreating">
        Create Ticket
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supportApi, type SupportTicket } from '@/api/endpoints/support'
import { useUIStore } from '@/stores/ui'
import { useRouter } from 'vue-router'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const router = useRouter()
const isCreating = ref(false)

const form = ref<Partial<SupportTicket>>({
  subject: '',
  description: '',
  category: '',
  priority: 'medium'
})

const createTicket = async () => {
  isCreating.value = true
  try {
    const response = await supportApi.createTicket(form.value)
    if (response.success && response.data) {
      uiStore.showNotification('success', 'Ticket created successfully')
      router.push(`/support/tickets/${response.data.id}`)
    } else {
      uiStore.showNotification('error', response.error || 'Failed to create ticket')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to create ticket')
  } finally {
    isCreating.value = false
  }
}
</script>

