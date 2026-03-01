<template>
  <div>
    <HeaderTemp4 />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-slate-900 dark:text-white font-display">My Orders</h1>

      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500 mb-4 block">receipt_long</span>
        <p class="text-slate-600 dark:text-slate-400 mb-4">You have no orders yet</p>
        <router-link
          to="/products"
          class="inline-flex items-center gap-2 rounded-lg bg-sgPrimary px-6 py-3 text-white font-bold hover:opacity-90 transition-opacity"
        >
          <span class="material-symbols-outlined text-xl">storefront</span>
          Start Shopping
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-sgBgDark p-6 shadow-sm"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-semibold text-lg text-slate-900 dark:text-white">Order #{{ order.orderNumber }}</h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
            </div>
            <div class="text-right">
              <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ order.status }}
              </span>
              <p class="font-bold text-lg mt-2 text-slate-900 dark:text-white">{{ formatPrice(order.total) }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <p class="text-slate-600 dark:text-slate-400">{{ order.items.length }} item(s)</p>
            <router-link
              :to="`/orders/${order.id}`"
              class="rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-transparent px-4 py-2 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <FooterTemp4 />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { ordersApi } from '@/api/endpoints/orders'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const ordersStore = useOrdersStore()
const isLoading = computed(() => ordersStore.isLoading)
const orders = computed(() => ordersStore.orders)

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
  }
  return classes[status] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
}

onMounted(async () => {
  ordersStore.setLoading(true)
  try {
    const response = await ordersApi.getOrders()
    if (response.success && response.data !== undefined) {
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
