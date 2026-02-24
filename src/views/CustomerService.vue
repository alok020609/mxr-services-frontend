<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Customer Service</h1>
      
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
        <div v-if="activeTab === 'tracking'">
          <OrderTracking />
        </div>
        
        <div v-if="activeTab === 'knowledge-base'">
          <KnowledgeBase />
        </div>
        
        <div v-if="activeTab === 'troubleshooting'">
          <TroubleshootingGuides />
        </div>
        
        <div v-if="activeTab === 'videos'">
          <VideoTutorials />
        </div>
        
        <div v-if="activeTab === 'callback'">
          <CallbackScheduler />
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
import OrderTracking from '@/components/customer-service/OrderTracking.vue'
import KnowledgeBase from '@/components/customer-service/KnowledgeBase.vue'
import TroubleshootingGuides from '@/components/customer-service/TroubleshootingGuides.vue'
import VideoTutorials from '@/components/customer-service/VideoTutorials.vue'
import CallbackScheduler from '@/components/customer-service/CallbackScheduler.vue'

const sidebarOpen = ref(false)
const activeTab = ref<'tracking' | 'knowledge-base' | 'troubleshooting' | 'videos' | 'callback'>('tracking')

const tabs = [
  { id: 'tracking', label: 'Track Order' },
  { id: 'knowledge-base', label: 'Knowledge Base' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'videos', label: 'Video Tutorials' },
  { id: 'callback', label: 'Schedule Callback' }
]
</script>

