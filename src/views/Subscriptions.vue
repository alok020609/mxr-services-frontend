<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">My Subscriptions</h1>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>
      
      <div v-else-if="subscriptions.length === 0" class="text-center py-12">
        <p class="text-gray-500 mb-4">No active subscriptions</p>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="subscription in subscriptions"
          :key="subscription.id"
          class="card"
        >
          <SubscriptionManager :subscription="subscription" />
        </div>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { advancedProductsApi } from '@/api/endpoints/advanced-products'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SubscriptionManager from '@/components/subscriptions/SubscriptionManager.vue'
import type { Subscription } from '@/api/types'

const sidebarOpen = ref(false)
const isLoading = ref(false)
const subscriptions = ref<Subscription[]>([])

const loadSubscriptions = async () => {
  isLoading.value = true
  try {
    const response = await advancedProductsApi.getSubscriptions()
    if (response.success && response.data) {
      subscriptions.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    console.error('Failed to load subscriptions:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSubscriptions()
})
</script>

