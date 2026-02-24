<template>
  <div class="ticket-list">
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="tickets.length === 0" class="text-center py-8 text-gray-500">
      <p>No support tickets</p>
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="card cursor-pointer hover:shadow-md transition-shadow"
        @click="viewTicket(ticket.id)"
      >
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-semibold">{{ ticket.subject }}</h4>
            <p class="text-sm text-gray-600 line-clamp-2">{{ ticket.description }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(ticket.createdAt) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span :class="[
              'px-2 py-1 rounded text-xs',
              ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-green-100 text-green-800' :
              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            ]">
              {{ ticket.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supportApi, type SupportTicket } from '@/api/endpoints/support'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const isLoading = ref(false)
const tickets = ref<SupportTicket[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadTickets = async () => {
  isLoading.value = true
  try {
    const response = await supportApi.getTickets()
    if (response.success && response.data) {
      const data = response.data
      tickets.value = Array.isArray(data) ? data : (data.items || [])
    }
  } catch (error) {
    console.error('Failed to load tickets:', error)
  } finally {
    isLoading.value = false
  }
}

const viewTicket = (id: string) => {
  router.push(`/support/tickets/${id}`)
}

onMounted(() => {
  loadTickets()
})
</script>

