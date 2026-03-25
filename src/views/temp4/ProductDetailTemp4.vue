<template>
  <div class="min-h-screen flex flex-col bg-sgBgLight dark:bg-sgBgDark text-slate-900 dark:text-slate-100 antialiased">
    <HeaderTemp4 />
    <main class="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:px-10 lg:py-10">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="h-10 w-10 animate-spin rounded-full border-2 border-sgPrimary border-t-transparent" />
      </div>

      <template v-else-if="product">
        <nav class="mb-6 flex gap-2 text-sm font-medium text-slate-500">
          <router-link to="/" class="hover:text-sgPrimary">Home</router-link>
          <span>/</span>
          <router-link to="/products" class="hover:text-sgPrimary">Products</router-link>
          <span>/</span>
          <span class="text-slate-900 dark:text-white truncate">{{ product.name }}</span>
        </nav>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Images -->
          <div class="space-y-4">
            <div class="aspect-square overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <img
                :src="currentImage"
                :alt="product.name"
                class="h-full w-full object-cover"
                @error="(e) => (e.currentTarget as HTMLImageElement).src = '/placeholder.png'"
              />
            </div>
            <div v-if="product.images && product.images.length > 1" class="flex gap-2 overflow-x-auto pb-2">
              <button
                v-for="(img, idx) in product.images"
                :key="idx"
                type="button"
                class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors"
                :class="currentImageIndex === idx ? 'border-sgPrimary' : 'border-slate-200 dark:border-slate-700'"
                @click="currentImageIndex = idx"
              >
                <img
                  :src="imageUrl(img)"
                  :alt="`${product.name} ${idx + 1}`"
                  class="h-full w-full object-cover"
                  @error="(e) => (e.currentTarget as HTMLImageElement).src = '/placeholder.png'"
                />
              </button>
            </div>
          </div>

          <!-- Info -->
          <div>
            <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{{ product.name }}</h1>
            <p v-if="product.category" class="mt-2 text-sm font-bold uppercase tracking-wider text-sgPrimary">{{ product.category.name }}</p>
            <div class="mt-4 flex items-baseline gap-3">
              <span class="text-3xl font-black text-slate-900 dark:text-white">{{ formatPrice(product.price) }}</span>
              <span
                v-if="product.compareAtPrice != null && product.compareAtPrice > product.price"
                class="text-base sm:text-lg text-slate-400 line-through"
              >
                {{ formatPrice(product.compareAtPrice) }}
              </span>
            </div>
            <p class="mt-6 text-slate-600 dark:text-slate-400">{{ product.description }}</p>

            <!-- Stock -->
            <div class="mt-6">
              <div v-if="product.stock > 0" class="flex items-center gap-2 text-green-600 dark:text-green-400">
                <span class="material-symbols-outlined">check_circle</span>
                <span>In stock ({{ product.stock }} available)</span>
              </div>
              <div v-else class="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span class="material-symbols-outlined">cancel</span>
                <span>Out of stock</span>
              </div>
            </div>

            <!-- Quantity -->
            <div v-if="product.stock > 0" class="mt-6">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantity</label>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  :disabled="quantity <= 1"
                  class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="quantity = Math.max(1, quantity - 1)"
                >
                  <span class="material-symbols-outlined">remove</span>
                </button>
                <span class="w-12 text-center text-base sm:text-lg font-semibold">{{ quantity }}</span>
                <button
                  type="button"
                  :disabled="quantity >= product.stock"
                  class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="quantity = Math.min(product.stock, quantity + 1)"
                >
                  <span class="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>

            <!-- Add to cart -->
            <div class="mt-8 flex flex-col gap-3">
              <button
                v-if="product.stock > 0"
                type="button"
                :disabled="isAdding"
                class="w-full rounded-xl bg-sgPrimary py-3 sm:py-4 text-base sm:text-lg font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                @click="addToCart"
              >
                <span v-if="isAdding" class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span class="material-symbols-outlined">shopping_cart</span>
                {{ isAdding ? 'Adding…' : 'Add to cart' }}
              </button>
              <router-link
                to="/products"
                class="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 py-3 sm:py-4 text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center"
              >
                Back to products
              </router-link>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="py-12 text-center text-slate-600 dark:text-slate-400">
        <span class="material-symbols-outlined text-5xl mb-4 block">inventory_2</span>
        <p class="text-lg">Product not found.</p>
        <router-link to="/products" class="mt-4 inline-block text-sgPrimary font-bold hover:underline">Browse products</router-link>
      </div>
    </main>

    <FooterTemp4 />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'
import { productsApi } from '@/api/endpoints/products'
import { cartApi } from '@/api/endpoints/cart'
import { useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'
import type { Product } from '@/api/types'

const route = useRoute()
const cartStore = useCartStore()
const uiStore = useUIStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const isAdding = ref(false)
const quantity = ref(1)
const currentImageIndex = ref(0)

function imageUrl(src: string): string {
  if (!src) return '/placeholder.png'
  return src.startsWith('http') ? src : (import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || '') + src
}

const currentImage = computed(() => {
  const p = product.value
  if (!p?.images?.length) return '/placeholder.png'
  const idx = Math.min(currentImageIndex.value, p.images.length - 1)
  return imageUrl(p.images[idx])
})

function formatPrice(value: number): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)
}

async function loadProduct(id: string) {
  if (!id) return
  loading.value = true
  product.value = null
  currentImageIndex.value = 0
  quantity.value = 1
  try {
    const res = await productsApi.getProduct(id)
    if (res.success && res.data) product.value = res.data
    else uiStore.showNotification('error', res.error || 'Product not found')
  } catch {
    uiStore.showNotification('error', 'Failed to load product')
  } finally {
    loading.value = false
  }
}

async function addToCart() {
  const p = product.value
  if (!p || p.stock < 1) return
  isAdding.value = true
  try {
    const res = await cartApi.addItem({ productId: p.id, quantity: quantity.value })
    if (res.success && res.data) {
      cartStore.setCart(res.data)
      uiStore.showNotification('success', 'Added to cart')
    } else {
      uiStore.showNotification('error', res.error || 'Could not add to cart')
    }
  } catch {
    uiStore.showNotification('error', 'Could not add to cart')
  } finally {
    isAdding.value = false
  }
}

watch(() => route.params.id as string, (id) => { if (id) loadProduct(id) }, { immediate: true })
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
