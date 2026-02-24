<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Support Center</h1>
      
      <div class="card">
        <!-- Tabs -->
        <div class="border-b mb-6">
          <div class="flex space-x-1 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        
        <!-- Tab Content -->
        <div v-if="activeTab === 'faqs'">
          <FAQs />
        </div>
        
        <div v-if="activeTab === 'tickets'">
          <TicketList />
        </div>
        
        <div v-if="activeTab === 'create'">
          <CreateTicket />
        </div>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import FAQs from '@/components/support/FAQs.vue'
import TicketList from '@/components/support/TicketList.vue'
import CreateTicket from '@/components/support/CreateTicket.vue'

const sidebarOpen = ref(false)
const activeTab = ref<'faqs' | 'tickets' | 'create'>('faqs')

const tabs = [
  { id: 'faqs', label: 'FAQs' },
  { id: 'tickets', label: 'My Tickets' },
  { id: 'create', label: 'Create Ticket' }
]
</script>

