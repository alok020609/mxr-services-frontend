<template>
  <div class="min-h-screen flex flex-col bg-sgBgLight dark:bg-sgBgDark">
    <HeaderTemp4 />
    <main class="container mx-auto px-4 py-8 flex-1">
      <h1 class="text-3xl font-bold mb-8">Payment Successful</h1>
      <div v-if="loadError" class="card p-6 text-center">
        <p class="text-red-600 mb-4">{{ loadError }}</p>
        <router-link to="/orders" class="btn btn-primary">View my orders</router-link>
      </div>
      <div v-else-if="order" class="card p-6 max-w-xl mx-auto">
        <div class="text-center mb-6">
          <p class="text-green-600 font-semibold text-lg mb-2">Your payment was successful.</p>
          <p class="text-gray-600">Order confirmed. You will receive an order confirmation email if enabled.</p>
        </div>
        <div class="border-t pt-4 space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Order number</span>
            <span class="font-semibold">{{ order.orderNumber }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total</span>
            <span class="font-semibold">{{ formatPrice(order.total) }}</span>
          </div>
        </div>
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <router-link
            :to="{ name: 'OrderDetail', params: { id: order.id } }"
            class="btn btn-primary flex-1 text-center"
          >
            View order details
          </router-link>
          <router-link to="/orders" class="btn btn-secondary flex-1 text-center">
            My orders
          </router-link>
        </div>
      </div>
      <div v-else-if="!orderId" class="card p-6 text-center">
        <p class="text-gray-600 mb-4">No order specified.</p>
        <router-link to="/orders" class="btn btn-primary">View my orders</router-link>
      </div>
      <div v-else class="card p-6 text-center">
        <LoadingSpinner size="md" class="mx-auto" />
        <p class="text-gray-600 mt-3">Loading order...</p>
      </div>
    </main>
    <FooterTemp4 />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ordersApi } from '@/api/endpoints/orders'
import { extractErrorMessage } from '@/utils/errorHandler'
import { useUIStore } from '@/stores/ui'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { Order } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const route = useRoute()
const uiStore = useUIStore()
const order = ref<Order | null>(null)
const loadError = ref<string | null>(null)

const orderId = computed(() => (route.query.orderId as string) ?? '')

onMounted(async () => {
  if (!orderId.value) return
  loadError.value = null
  try {
    const response = await ordersApi.getOrder(orderId.value)
    if (response.success && response.data) {
      order.value = response.data
    } else {
      loadError.value = (response as { error?: string }).error || 'Order not found'
    }
  } catch (err) {
    loadError.value = extractErrorMessage(err as Error)
  }
})
</script>
