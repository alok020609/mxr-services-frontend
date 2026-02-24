<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Security Settings</h1>
      
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
        <div v-if="activeTab === '2fa'">
          <TwoFactorAuth />
        </div>
        
        <div v-if="activeTab === 'devices'">
          <TrustedDevices />
        </div>
        
        <div v-if="activeTab === 'sessions'">
          <ActiveSessions />
        </div>
        
        <div v-if="activeTab === 'login-attempts'">
          <LoginAttempts />
        </div>
        
        <div v-if="activeTab === 'api-keys'">
          <ApiKeys />
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
import TwoFactorAuth from '@/components/security/TwoFactorAuth.vue'
import TrustedDevices from '@/components/security/TrustedDevices.vue'
import ActiveSessions from '@/components/security/ActiveSessions.vue'
import LoginAttempts from '@/components/security/LoginAttempts.vue'
import ApiKeys from '@/components/security/ApiKeys.vue'

const sidebarOpen = ref(false)
const activeTab = ref<'2fa' | 'devices' | 'sessions' | 'login-attempts' | 'api-keys'>('2fa')

const tabs = [
  { id: '2fa', label: 'Two-Factor Authentication' },
  { id: 'devices', label: 'Trusted Devices' },
  { id: 'sessions', label: 'Active Sessions' },
  { id: 'login-attempts', label: 'Login Attempts' },
  { id: 'api-keys', label: 'API Keys' }
]
</script>

