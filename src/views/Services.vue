<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Services</h1>

      <div class="flex flex-col md:flex-row gap-6 mb-6 flex-wrap">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">Type</label>
          <select
            v-model="filterType"
            @change="loadServices"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All</option>
            <option value="CONSULTING">Consulting</option>
            <option value="REPAIR">Repair</option>
            <option value="INSTALLATION">Installation</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">Category</label>
          <select
            v-model="filterCategoryId"
            @change="loadServices"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <label class="flex items-center gap-2">
          <input
            v-model="filterActiveOnly"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            @change="loadServices"
          />
          <span class="text-sm text-gray-700">Active only</span>
        </label>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="error" class="rounded-md bg-red-50 border border-red-200 p-4 text-red-800">
        {{ error }}
      </div>

      <div v-else-if="!services.length" class="text-center py-12 text-gray-600">
        No services found.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="svc in services"
          :key="svc.id"
          class="card p-6 hover:shadow-lg transition-shadow flex flex-col"
        >
          <router-link :to="`/services/${svc.id}`" class="block flex-1 min-w-0">
            <img
              :src="svc.image || '/placeholder.jpg'"
              :alt="svc.name"
              class="w-full h-40 object-cover rounded-lg mb-4"
              @error="($event.target as HTMLImageElement).src = '/placeholder.jpg'"
            />
            <h3 class="font-semibold text-lg mb-2 text-gray-900 hover:text-primary-600">{{ svc.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ svc.description || '—' }}</p>
            <p class="text-primary-600 font-semibold mb-2">{{ formatPrice(Number(svc.price)) }} per unit</p>
            <p class="text-sm text-gray-600 mb-2">
              <template v-if="isScopedService(svc)">
                Amount: {{ formatPrice(Number(svc.price) * Math.max(1, getDerivedQty(svc))) }} (qty from cart)
              </template>
              <template v-else>
                Amount: {{ formatPrice(Number(svc.price) * getServiceQuantity(svc.id)) }} (min qty 1)
              </template>
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="px-2 py-1 bg-gray-100 rounded text-xs">{{ svc.type }}</span>
              <span v-if="svc.durationMinutes" class="text-xs text-gray-500">{{ svc.durationMinutes }} min</span>
              <span v-if="svc.category" class="text-xs text-gray-500">For: {{ svc.category.name }}</span>
              <span v-if="svc.product" class="text-xs text-gray-500">Product: {{ svc.product.name }}</span>
            </div>
          </router-link>
          <div class="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <template v-if="isScopedService(svc)">
              <span v-if="getDerivedQty(svc) >= 1" class="text-sm text-gray-600 shrink-0">Qty from cart: {{ getDerivedQty(svc) }}</span>
              <span v-else class="text-sm text-amber-700 shrink-0">Add the related product to cart first</span>
            </template>
            <template v-else>
              <label class="text-sm font-medium text-gray-700 shrink-0">Qty</label>
              <input
                v-model.number="serviceQuantities[svc.id]"
                type="number"
                min="1"
                class="w-16 text-center border border-gray-300 rounded px-2 py-1"
                @click.stop
                @input="clampServiceQuantity(svc.id)"
              />
            </template>
            <Button
              variant="primary"
              size="sm"
              class="flex-1 min-w-0"
              :loading="addingServiceId === svc.id"
              :disabled="isScopedService(svc) && getDerivedQty(svc) < 1"
              @click.stop="handleAddToCart(svc)"
            >
              Add to cart
            </Button>
            <router-link
              :to="`/services/${svc.id}`"
              class="text-sm text-primary-600 hover:underline shrink-0"
              @click.stop
            >
              View
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="pagination && pagination.pages > 1" class="mt-8 flex justify-center gap-2">
        <button
          :disabled="pagination.page <= 1"
          class="px-4 py-2 border rounded disabled:opacity-50"
          @click="goToPage(pagination.page - 1)"
        >
          Previous
        </button>
        <span class="px-4 py-2 text-gray-600">Page {{ pagination.page }} of {{ pagination.pages }}</span>
        <button
          :disabled="pagination.page >= pagination.pages"
          class="px-4 py-2 border rounded disabled:opacity-50"
          @click="goToPage(pagination.page + 1)"
        >
          Next
        </button>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { servicesApi } from '@/api/endpoints/services'
import { productsApi } from '@/api/endpoints/products'
import type { Service, Category } from '@/api/types'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import { useCart } from '@/composables/useCart'
import { getDerivedServiceQuantity, isScopedService } from '@/composables/useServiceQuantity'

const { formatPrice } = usePriceFormatter()
const { cart, loadCart, addOrUpdateServiceInCart } = useCart()
const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)
const services = ref<Service[]>([])
const pagination = ref<{ page: number; limit: number; total: number; pages: number } | null>(null)
const filterType = ref<'CONSULTING' | 'REPAIR' | 'INSTALLATION' | ''>('')
const filterCategoryId = ref('')
const filterActiveOnly = ref(true)
const categories = ref<Category[]>([])
const addingServiceId = ref<string | null>(null)
const serviceQuantities = ref<Record<string, number>>({})

function getServiceQuantity(serviceId: string): number {
  return Math.max(1, serviceQuantities.value[serviceId] ?? 1)
}

function clampServiceQuantity(serviceId: string) {
  const v = serviceQuantities.value[serviceId]
  if (v !== undefined && v < 1) serviceQuantities.value[serviceId] = 1
}

function getDerivedQty(svc: Service): number {
  const items = cart.value?.items ?? []
  const derived = getDerivedServiceQuantity(items, svc)
  return derived !== null ? Math.max(0, derived) : 1
}

async function handleAddToCart(svc: Service) {
  addingServiceId.value = svc.id
  try {
    await loadCart({ silent: true })
    const items = cart.value?.items ?? []
    const derived = getDerivedServiceQuantity(items, svc)
    const qty = isScopedService(svc)
      ? (derived === null || derived < 1 ? 0 : Math.max(1, derived))
      : getServiceQuantity(svc.id)
    if (qty < 1) return
    await addOrUpdateServiceInCart(svc.id, qty)
  } finally {
    addingServiceId.value = null
  }
}

async function loadCategories() {
  try {
    const res = await productsApi.getCategories()
    if (res.success && res.data) categories.value = res.data
  } catch {
    categories.value = []
  }
}

async function loadServices() {
  isLoading.value = true
  error.value = null
  try {
    const page = Number(route.query.page) || 1
    const res = await servicesApi.getServices({
      page,
      limit: 20,
      type: filterType.value || undefined,
      categoryId: filterCategoryId.value || undefined,
      isActive: filterActiveOnly.value
    })
    if (res.success && res.data) {
      services.value = res.data
      for (const svc of res.data) {
        if (serviceQuantities.value[svc.id] === undefined) serviceQuantities.value[svc.id] = 1
      }
      if (res.pagination) pagination.value = res.pagination
      else pagination.value = { page: 1, limit: 20, total: res.data.length, pages: 1 }
    } else {
      error.value = res.error || 'Failed to load services'
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load services'
  } finally {
    isLoading.value = false
  }
}

function goToPage(p: number) {
  if (!pagination.value || p < 1 || p > pagination.value.pages) return
  router.push({ path: route.path, query: { ...route.query, page: String(p) } })
}

onMounted(() => {
  loadCategories()
  loadServices()
})
watch(() => route.query.page, loadServices)
</script>
