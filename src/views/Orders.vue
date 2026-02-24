<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">My Orders</h1>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="orders.length === 0" class="text-center py-12">
        <p class="text-gray-600 mb-4">You have no orders yet</p>
        <router-link to="/products" class="btn btn-primary">
          Start Shopping
        </router-link>
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="order in orders" :key="order.id" class="card">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-semibold text-lg">Order #{{ order.orderNumber }}</h3>
              <p class="text-gray-600 text-sm">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
            </div>
            <div class="text-right">
              <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-sm">
                {{ order.status }}
              </span>
              <p class="font-bold text-lg mt-2">{{ formatPrice(order.total) }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <p class="text-gray-600">{{ order.items.length }} item(s)</p>
            <router-link :to="`/orders/${order.id}`" class="btn btn-secondary">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { ordersApi } from '@/api/endpoints/orders'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const ordersStore = useOrdersStore()
const sidebarOpen = ref(false)
const isLoading = computed(() => ordersStore.isLoading)
const orders = computed(() => ordersStore.orders)

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
  ordersStore.setLoading(true)
  try {
    const response = await ordersApi.getOrders()
    if (response.success && response.data !== undefined) {
      // Backend returns { success, data: Order[], pagination: { page, limit, total, pages? } }
      const list = Array.isArray(response.data) ? response.data : []
      const pagination = (response as { pagination?: { total?: number } }).pagination
      const total = pagination?.total ?? list.length
      ordersStore.setOrders(list, total)
    }
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    ordersStore.setLoading(false)
  }
})
</script>

