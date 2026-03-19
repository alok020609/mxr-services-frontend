<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <main class="container mx-auto px-4 py-8">
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="loadError" class="card p-6 text-center">
        <p class="text-red-600 mb-4">{{ loadError }}</p>
        <router-link to="/services" class="text-primary-600 hover:underline">Back to services</router-link>
      </div>

      <div v-else-if="service" class="max-w-2xl mx-auto">
        <router-link to="/services" class="text-primary-600 hover:underline text-sm mb-4 inline-block">← Back to services</router-link>
        <div class="card p-8">
          <img
            :src="service.image || '/placeholder.png'"
            :alt="service.name"
            class="w-full h-64 object-cover rounded-lg mb-6"
            @error="($event.target as HTMLImageElement).src = '/placeholder.png'"
          />
          <h1 class="text-3xl font-bold mb-4">{{ service.name }}</h1>
          <p class="text-gray-600 mb-4">{{ service.description || '—' }}</p>
          <p class="text-2xl font-semibold text-primary-600 mb-4">{{ formatPrice(Number(service.price)) }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="px-2 py-1 bg-gray-100 rounded text-sm">{{ service.type }}</span>
            <span v-if="service.durationMinutes" class="text-sm text-gray-500">{{ service.durationMinutes }} min</span>
            <span v-if="service.product" class="text-sm text-gray-500">For: {{ service.product.name }}</span>
            <span v-if="service.category" class="text-sm text-gray-500">Category: {{ service.category.name }}</span>
          </div>
          <p class="text-sm text-gray-600 mb-4">Price is per unit. Amount = price × quantity (minimum quantity 1).</p>
          <div v-if="isScopedService(service)" class="mb-6">
            <p v-if="derivedQuantity >= 1" class="text-sm text-gray-600 mb-2">Quantity is based on related product/category in your cart: <strong>{{ derivedQuantity }}</strong></p>
            <p v-else class="text-sm text-amber-700 mb-2">Add the related product to cart first.</p>
            <p class="text-sm text-gray-600">Amount: {{ formatPrice(Number(service?.price ?? 0) * Math.max(1, derivedQuantity)) }}</p>
          </div>
          <div v-else class="flex items-center gap-4 mb-6">
            <label class="text-sm font-medium text-gray-700">Quantity</label>
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              class="w-24 text-center border rounded px-3 py-2"
              @input="quantity = Math.max(1, Number(quantity) || 1)"
            />
            <span class="text-sm text-gray-600">Amount: {{ formatPrice(Number(service?.price ?? 0) * Math.max(1, quantity)) }}</span>
          </div>
          <Button
            variant="primary"
            class="w-full"
            :loading="isAdding"
            :disabled="isScopedService(service) && derivedQuantity < 1"
            @click="handleAddToCart"
          >
            Add to cart
          </Button>
        </div>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { servicesApi } from '@/api/endpoints/services'
import { useCart } from '@/composables/useCart'
import { getDerivedServiceQuantity, isScopedService } from '@/composables/useServiceQuantity'
import type { Service } from '@/api/types'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { cart, loadCart, addOrUpdateServiceInCart } = useCart()
const sidebarOpen = ref(false)
const isLoading = ref(true)
const loadError = ref<string | null>(null)
const service = ref<Service | null>(null)
const quantity = ref(1)
const isAdding = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const derivedQuantity = computed(() => {
  if (!service.value) return 0
  const items = cart.value?.items ?? []
  const d = getDerivedServiceQuantity(items, service.value)
  return d !== null ? Math.max(0, d) : 1
})

async function loadService() {
  const id = route.params.id as string
  if (!id) {
    loadError.value = 'Invalid service'
    isLoading.value = false
    return
  }
  isLoading.value = true
  loadError.value = null
  try {
    const res = await servicesApi.getService(id)
    if (res.success && res.data) {
      service.value = res.data
    } else {
      loadError.value = res.error || 'Service not found'
    }
  } catch {
    loadError.value = 'Failed to load service'
  } finally {
    isLoading.value = false
  }
}

async function handleAddToCart() {
  if (!isAuthenticated.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  if (!service.value) return
  isAdding.value = true
  try {
    await loadCart({ silent: true })
    const items = cart.value?.items ?? []
    const derived = getDerivedServiceQuantity(items, service.value)
    let qty: number
    if (isScopedService(service.value)) {
      if (derived === null || derived < 1) return
      qty = Math.max(1, derived)
    } else {
      qty = Math.max(1, quantity.value)
    }
    const result = await addOrUpdateServiceInCart(service.value.id, qty)
    if (result?.success) {
      router.push('/cart')
    }
  } finally {
    isAdding.value = false
  }
}

onMounted(loadService)
</script>
