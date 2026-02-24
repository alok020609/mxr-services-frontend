<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <div class="mb-4">
        <router-link to="/support" class="text-primary-600 hover:text-primary-700">
          ← Back to Support
        </router-link>
      </div>
      
      <div v-if="ticket" class="card">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold">{{ ticket.subject }}</h1>
            <p class="text-gray-600">Created: {{ formatDate(ticket.createdAt) }}</p>
          </div>
          <span :class="[
            'px-3 py-1 rounded-full text-sm',
            ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-green-100 text-green-800' :
            ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          ]">
            {{ ticket.status }}
          </span>
        </div>
        
        <div class="mb-6">
          <p class="text-gray-700">{{ ticket.description }}</p>
        </div>
        
        <div class="border-t pt-4">
          <h3 class="font-semibold mb-4">Messages</h3>
          <div class="space-y-4">
            <div
              v-for="message in ticket.messages"
              :key="message.id"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <p class="font-medium">{{ message.senderName || message.sender }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(message.createdAt) }}</p>
              </div>
              <p class="text-gray-700">{{ message.message }}</p>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t">
            <textarea
              v-model="newMessage"
              rows="4"
              class="input w-full mb-2"
              placeholder="Type your message..."
            ></textarea>
            <Button
              variant="primary"
              @click="addMessage"
              :loading="isAddingMessage"
              :disabled="!newMessage.trim()"
            >
              Send Message
            </Button>
          </div>
        </div>
        
        <div v-if="ticket.status !== 'closed'" class="mt-4 pt-4 border-t">
          <Button variant="secondary" @click="closeTicket" :loading="isClosing">
            Close Ticket
          </Button>
        </div>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supportApi, type SupportTicket } from '@/api/endpoints/support'
import { useUIStore } from '@/stores/ui'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import Button from '@/components/common/Button.vue'

const route = useRoute()
const uiStore = useUIStore()
const sidebarOpen = ref(false)
const ticket = ref<SupportTicket | null>(null)
const newMessage = ref('')
const isAddingMessage = ref(false)
const isClosing = ref(false)

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadTicket = async () => {
  const id = route.params.id as string
  try {
    const response = await supportApi.getTicket(id)
    if (response.success && response.data) {
      ticket.value = response.data
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load ticket')
  }
}

const addMessage = async () => {
  if (!newMessage.value.trim() || !ticket.value) return
  
  isAddingMessage.value = true
  try {
    const response = await supportApi.addTicketMessage(ticket.value.id, newMessage.value)
    if (response.success) {
      uiStore.showNotification('success', 'Message sent')
      newMessage.value = ''
      await loadTicket()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to send message')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to send message')
  } finally {
    isAddingMessage.value = false
  }
}

const closeTicket = async () => {
  if (!ticket.value) return
  
  isClosing.value = true
  try {
    const response = await supportApi.closeTicket(ticket.value.id)
    if (response.success) {
      uiStore.showNotification('success', 'Ticket closed')
      await loadTicket()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to close ticket')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to close ticket')
  } finally {
    isClosing.value = false
  }
}

onMounted(() => {
  loadTicket()
})
</script>

