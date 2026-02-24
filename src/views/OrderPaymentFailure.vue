<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Payment Failed</h1>
      <div class="card p-6 max-w-xl mx-auto text-center">
        <p class="text-red-600 font-semibold text-lg mb-2">Your payment could not be completed.</p>
        <p class="text-gray-600 mb-4">
          {{ message }}
        </p>
        <p v-if="orderId" class="text-gray-500 text-sm mb-4">
          Order ID: {{ orderId }}
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <router-link
            v-if="orderId"
            :to="{ name: 'OrderDetail', params: { id: orderId } }"
            class="btn btn-primary"
          >
            View order
          </router-link>
          <router-link to="/orders" class="btn btn-secondary">
            My orders
          </router-link>
          <router-link to="/" class="btn btn-outline">
            Home
          </router-link>
        </div>
      </div>
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'

const route = useRoute()
const sidebarOpen = ref(false)

const orderId = computed(() => (route.query.orderId as string) ?? '')
const message = computed(
  () => (route.query.message as string) || 'You can try again from your order or choose another payment method.'
)
</script>
