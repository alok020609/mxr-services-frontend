<template>
  <div class="min-h-screen flex flex-col bg-sgBgLight dark:bg-sgBgDark text-slate-900 dark:text-slate-100 antialiased">
    <HeaderTemp4 />
    <main class="mx-auto flex w-full max-w-7xl flex-1 gap-8 p-4 sm:p-6 lg:px-10 lg:py-10">
      <!-- Sidebar -->
      <aside class="hidden w-64 shrink-0 flex-col gap-8 lg:flex">
        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Categories</h3>
          <div class="flex flex-col gap-1">
            <button
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left"
              :class="!selectedCategoryId ? 'bg-sgPrimary/10 text-sgPrimary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
              @click="selectedCategoryId = ''"
            >
              <span class="material-symbols-outlined text-xl">grid_view</span>
              All Products
            </button>
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              :class="selectedCategoryId === cat.id ? 'bg-sgPrimary/10 text-sgPrimary' : 'text-slate-600 dark:text-slate-400'"
              @click="selectedCategoryId = cat.id"
            >
              <span class="material-symbols-outlined text-xl">category</span>
              {{ cat.name }}
            </button>
          </div>
        </div>
        <div v-if="categories.length === 0 && !categoriesLoading" class="text-sm text-slate-500">
          No categories yet.
        </div>
        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Camera Resolution</h3>
          <div class="flex flex-col gap-2">
            <label v-for="opt in resolutionOptions" :key="opt.value" class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
              <input v-model="selectedResolutions" type="checkbox" :value="opt.value" class="rounded border-slate-300 text-sgPrimary focus:ring-sgPrimary" />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </div>
        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Lock Type</h3>
          <div class="flex flex-col gap-2">
            <label v-for="opt in lockTypeOptions" :key="opt.value" class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
              <input v-model="selectedLockTypes" type="checkbox" :value="opt.value" class="rounded border-slate-300 text-sgPrimary focus:ring-sgPrimary" />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </div>
        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Price Range</h3>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <input
                v-model.number="minPrice"
                type="number"
                min="0"
                step="1"
                placeholder="Min"
                class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <span class="text-slate-400">–</span>
              <input
                v-model.number="maxPrice"
                type="number"
                min="0"
                step="1"
                placeholder="Max"
                class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1">
        <div class="mb-6">
          <nav class="mb-4 flex gap-2 text-sm font-medium text-slate-500">
            <router-link to="/" class="hover:text-sgPrimary">Shop</router-link>
            <span>/</span>
            <span class="text-slate-900 dark:text-white">Products</span>
          </nav>
          <h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Products</h1>
          <p class="mt-2 text-slate-600 dark:text-slate-400">Browse our catalog. Add items to cart and proceed to checkout.</p>
          <div class="mt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div class="flex-1 flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden max-w-sm">
              <span class="material-symbols-outlined text-slate-500 pl-3 text-xl">search</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="flex-1 min-w-0 bg-transparent border-none px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-0"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-slate-500 whitespace-nowrap">Sort by:</span>
              <select
                v-model="sortOption"
                class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sgPrimary"
              >
                <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Applied filters chips -->
        <div v-if="appliedChips.length > 0" class="mb-6 flex flex-wrap items-center gap-2">
          <span class="text-sm text-slate-500 mr-1">Filters:</span>
          <button
            v-for="chip in appliedChips"
            :key="chip.id"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full bg-slate-200 dark:bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            @click="removeFilter(chip.id)"
          >
            {{ chip.label }}
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
          <button
            type="button"
            class="text-sm font-semibold text-sgPrimary hover:underline"
            @click="clearAllFilters"
          >
            Clear all
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="h-10 w-10 animate-spin rounded-full border-2 border-sgPrimary border-t-transparent" />
        </div>

        <!-- Product Grid -->
        <div v-else-if="filteredProducts.length > 0" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-lg"
            >
              <router-link :to="`/products/${product.id}`" class="block">
                <div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    :src="productImage(product)"
                    :alt="product.name"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    @error="(e) => (e.currentTarget as HTMLImageElement).src = '/placeholder.png'"
                  />
                  <span
                    v-if="toNumber(product.compareAtPrice) > 0 && toNumber(product.compareAtPrice) > toNumber(product.price)"
                    class="absolute left-3 top-3 rounded-lg px-2 py-1 text-[10px] font-bold uppercase text-white bg-sgPrimary"
                  >
                    Save
                  </span>
                </div>
              </router-link>
              <div class="flex flex-1 flex-col p-5">
                <div class="mb-1 flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-sgPrimary">{{ product.category?.name || 'Product' }}</span>
                  <div v-if="product.rating != null" class="flex items-center gap-1 text-yellow-500">
                    <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1">star</span>
                    <span class="text-xs font-bold text-slate-900 dark:text-white">{{ product.rating }}</span>
                  </div>
                </div>
                <router-link :to="`/products/${product.id}`" class="hover:opacity-90">
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ product.name }}</h3>
                </router-link>
                <p class="mt-2 text-sm text-slate-500 line-clamp-2">{{ product.description }}</p>
                <div class="mt-4 flex items-baseline gap-2">
                  <span class="text-2xl font-black text-slate-900 dark:text-white">{{ formatPrice(product.price) }}</span>
                  <span v-if="toNumber(product.compareAtPrice) > 0 && toNumber(product.compareAtPrice) > toNumber(product.price)" class="text-sm text-slate-400 line-through">{{ formatPrice(product.compareAtPrice) }}</span>
                </div>
                <div class="mt-6 flex flex-col gap-2">
                  <button
                    type="button"
                    :disabled="(product.stock ?? 0) < 1 || addingProductId === product.id"
                    class="w-full rounded-lg bg-sgPrimary py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="addToCart(product)"
                  >
                    {{ (product.stock ?? 0) < 1 ? 'Out of stock' : addingProductId === product.id ? 'Adding…' : 'Buy Product Only' }}
                  </button>
                  <button
                    type="button"
                    :disabled="(product.stock ?? 0) < 1 || addingInstallationId === product.id"
                    class="w-full rounded-lg border-2 border-sgPrimary/30 bg-sgPrimary/5 py-2.5 text-sm font-bold text-sgPrimary hover:bg-sgPrimary/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="addProductWithInstallation(product)"
                  >
                    <span class="material-symbols-outlined text-lg">build</span>
                    {{ addingInstallationId === product.id ? 'Adding…' : 'Buy + Installation' }}
                  </button>
                  <router-link
                    :to="`/products/${product.id}`"
                    class="w-full rounded-lg border-2 border-slate-200 dark:border-slate-700 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    View details
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.pages > 1" class="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              :disabled="pagination.page <= 1"
              class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="goToPage(pagination.page - 1)"
            >
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <template v-for="p in visiblePages" :key="p">
              <button
                v-if="p !== '...'"
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-lg border transition-colors"
                :class="p === pagination.page ? 'bg-sgPrimary font-bold text-white border-sgPrimary' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'"
                @click="goToPage(p as number)"
              >
                {{ p }}
              </button>
              <span v-else class="flex h-10 w-10 items-center justify-center text-slate-500">…</span>
            </template>
            <button
              type="button"
              :disabled="pagination.page >= pagination.pages"
              class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="goToPage(pagination.page + 1)"
            >
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="py-12 text-center text-slate-600 dark:text-slate-400">
          <span class="material-symbols-outlined text-5xl mb-4 block">inventory_2</span>
          <p class="text-lg">No products found.</p>
          <router-link to="/" class="mt-4 inline-block text-sgPrimary font-bold hover:underline">Back to home</router-link>
        </div>
      </div>
    </main>

    <!-- Installation CTA -->
    <section class="bg-sgPrimary/10 py-16 px-4 sm:px-6 lg:px-10 mt-12">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col md:flex-row items-center justify-between gap-12">
          <div class="flex-1">
            <h2 class="text-3xl font-black text-slate-900 dark:text-white">Need help?</h2>
            <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">Contact us for quotes and installation services.</p>
            <div class="mt-8 flex gap-4">
              <router-link to="/contact" class="rounded-lg bg-sgPrimary px-8 py-3 font-bold text-white shadow-lg shadow-sgPrimary/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Contact us
              </router-link>
              <router-link to="/packages" class="rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-transparent px-8 py-3 font-bold hover:bg-white dark:hover:bg-slate-800 transition-colors">
                Packages
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterTemp4 />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'
import { productsApi } from '@/api/endpoints/products'
import { cartApi } from '@/api/endpoints/cart'
import { servicesApi } from '@/api/endpoints/services'
import { useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import { useCurrencyStore } from '@/stores/currency'
import type { Product, Category } from '@/api/types'

const route = useRoute()
const cartStore = useCartStore()
const uiStore = useUIStore()
const currencyStore = useCurrencyStore()
const { formatPrice } = usePriceFormatter()

onMounted(() => {
  currencyStore.loadCurrencies()
})

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const categoriesLoading = ref(true)
const loading = ref(true)
const addingProductId = ref<string | null>(null)
const addingInstallationId = ref<string | null>(null)

const selectedCategoryId = ref<string>('')
const searchQuery = ref('')
const searchApplied = ref('')
const minPrice = ref<number | undefined>(undefined)
const maxPrice = ref<number | undefined>(undefined)
const selectedResolutions = ref<string[]>([])
const selectedLockTypes = ref<string[]>([])

const resolutionOptions = [
  { value: '4k', label: '4K Ultra HD (8MP)' },
  { value: '2k', label: '2K QHD (4MP)' },
  { value: '1080p', label: '1080p Full HD' },
]
const lockTypeOptions = [
  { value: 'biometric', label: 'Biometric (Fingerprint)' },
  { value: 'keypad', label: 'Keypad Entry' },
  { value: 'mobile', label: 'Mobile App Control' },
]

const sortOptions = [
  { value: 'createdAt_desc', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
]
const sortOption = ref('createdAt_desc')

const sortBy = computed(() => {
  const [field] = sortOption.value.split('_')
  return (field === 'createdAt' ? 'createdAt' : field === 'name' ? 'name' : 'price') as 'price' | 'rating' | 'name' | 'createdAt'
})
const sortOrder = computed(() => (sortOption.value.endsWith('_asc') ? 'asc' : 'desc') as 'asc' | 'desc')

const pagination = ref({
  page: 1,
  limit: 12,
  total: 0,
  pages: 0
})

// Backend expects `category`, `search`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`, `page`, `limit`
const requestParams = computed(() => {
  const params: Record<string, string | number | undefined> = {
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  }
  if (selectedCategoryId.value) params.category = selectedCategoryId.value
  if (searchApplied.value.trim()) params.search = searchApplied.value.trim()
  if (minPrice.value != null && minPrice.value > 0) params.minPrice = minPrice.value
  if (maxPrice.value != null && maxPrice.value > 0) params.maxPrice = maxPrice.value
  return params
})

function matchesSpec(product: Product, key: string, values: string[]): boolean {
  if (values.length === 0) return true
  const specs = product.specifications as Record<string, unknown> | undefined
  if (!specs || typeof specs !== 'object') return false
  const raw = specs[key] ?? specs[key.toLowerCase()] ?? specs.resolution ?? specs.lockType
  const str = String(raw ?? '').toLowerCase()
  return values.some(v => str.includes(v))
}

const filteredProducts = computed(() => {
  let list = products.value
  if (selectedResolutions.value.length > 0) {
    list = list.filter(p => matchesSpec(p, 'resolution', selectedResolutions.value))
  }
  if (selectedLockTypes.value.length > 0) {
    list = list.filter(p => matchesSpec(p, 'lockType', selectedLockTypes.value))
  }
  return list
})

const appliedChips = computed(() => {
  const chips: { id: string; label: string }[] = []
  if (selectedCategoryId.value) {
    const cat = categories.value.find(c => c.id === selectedCategoryId.value)
    chips.push({ id: 'category', label: cat ? cat.name : 'Category' })
  }
  if (searchApplied.value.trim()) {
    chips.push({ id: 'search', label: `"${searchApplied.value.trim()}"` })
  }
  if (minPrice.value != null && minPrice.value > 0) {
    chips.push({ id: 'minPrice', label: `From $${minPrice.value}` })
  }
  if (maxPrice.value != null && maxPrice.value > 0) {
    chips.push({ id: 'maxPrice', label: `Up to $${maxPrice.value}` })
  }
  selectedResolutions.value.forEach(v => {
    const opt = resolutionOptions.find(o => o.value === v)
    if (opt) chips.push({ id: `resolution:${v}`, label: opt.label })
  })
  selectedLockTypes.value.forEach(v => {
    const opt = lockTypeOptions.find(o => o.value === v)
    if (opt) chips.push({ id: `lockType:${v}`, label: opt.label })
  })
  return chips
})

function removeFilter(id: string) {
  if (id === 'category') selectedCategoryId.value = ''
  else if (id === 'search') { searchQuery.value = ''; searchApplied.value = '' }
  else if (id === 'minPrice') minPrice.value = undefined
  else if (id === 'maxPrice') maxPrice.value = undefined
  else if (id.startsWith('resolution:')) selectedResolutions.value = selectedResolutions.value.filter(x => x !== id.slice('resolution:'.length))
  else if (id.startsWith('lockType:')) selectedLockTypes.value = selectedLockTypes.value.filter(x => x !== id.slice('lockType:'.length))
}

function clearAllFilters() {
  selectedCategoryId.value = ''
  searchQuery.value = ''
  searchApplied.value = ''
  minPrice.value = undefined
  maxPrice.value = undefined
  selectedResolutions.value = []
  selectedLockTypes.value = []
  pagination.value.page = 1
}

function productImage(product: Product): string {
  const img = product.images?.[0]
  if (img) return img.startsWith('http') ? img : (import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || '') + img
  return '/placeholder.png'
}

function toNumber(value: number | string | undefined | null): number {
  if (value == null) return 0
  return typeof value === 'number' ? value : parseFloat(String(value)) || 0
}

const visiblePages = computed(() => {
  const total = pagination.value.pages
  const current = pagination.value.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
})

async function loadCategories() {
  categoriesLoading.value = true
  try {
    const res = await productsApi.getCategories()
    if (res.success && res.data) categories.value = res.data
  } finally {
    categoriesLoading.value = false
  }
}

async function loadProducts() {
  loading.value = true
  try {
    const res = await productsApi.getProducts(requestParams.value as unknown as import('@/api/types').ProductFilters)
    if (res.success && res.data) {
      // Backend returns `{ success, data: Product[], pagination }` (not `{ data: { data, pagination } }`)
      if (Array.isArray(res.data)) {
        products.value = res.data as Product[]
        const p = (res as unknown as { pagination?: { page: number; limit: number; total: number; pages?: number; totalPages?: number } }).pagination
        if (p) {
          pagination.value.page = p.page
          pagination.value.limit = p.limit
          pagination.value.total = p.total
          pagination.value.pages = (p.totalPages ?? p.pages ?? Math.ceil(p.total / p.limit)) || 1
        }
      } else {
        // Fallback for older/alternate shape `{ data: { data: Product[], pagination } }`
        const data = res.data as { data?: Product[]; pagination?: { page: number; limit: number; total: number; pages?: number; totalPages?: number } }
        products.value = data.data ?? []
        const p = data.pagination
        if (p) {
          pagination.value.page = p.page
          pagination.value.limit = p.limit
          pagination.value.total = p.total
          pagination.value.pages = (p.totalPages ?? p.pages ?? Math.ceil(p.total / p.limit)) || 1
        }
      }
    } else {
      products.value = []
    }
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

function goToPage(page: number) {
  if (page < 1 || page > pagination.value.pages) return
  pagination.value.page = page
}

async function addToCart(product: Product) {
  if ((product.stock ?? 0) < 1) return
  addingProductId.value = product.id
  try {
    const res = await cartApi.addItem({ productId: product.id, quantity: 1 })
    if (res.success && res.data) {
      cartStore.setCart(res.data)
      uiStore.showNotification('success', 'Added to cart')
    } else {
      uiStore.showNotification('error', res.error || 'Could not add to cart')
    }
  } catch {
    uiStore.showNotification('error', 'Could not add to cart')
  } finally {
    addingProductId.value = null
  }
}

async function addProductWithInstallation(product: Product) {
  if ((product.stock ?? 0) < 1) return
  addingInstallationId.value = product.id
  try {
    let cartRes = await cartApi.addItem({ productId: product.id, quantity: 1 })
    if (!cartRes.success || !cartRes.data) {
      uiStore.showNotification('error', cartRes.error || 'Could not add product to cart')
      return
    }
    cartStore.setCart(cartRes.data)
    const productScoped = await servicesApi.getServices({ type: 'INSTALLATION', productId: product.id, isActive: true })
    const list = productScoped.data ?? []
    let service = list.find(s => s.productId === product.id)
    if (!service && list.length > 0) service = list[0]
    if (!service) {
      const allInstall = await servicesApi.getServices({ type: 'INSTALLATION', isActive: true })
      const fallback = (allInstall.data ?? [])[0]
      if (fallback) service = fallback
    }
    if (service) {
      const serviceRes = await cartApi.addItem({ serviceId: service.id, quantity: 1 })
      if (serviceRes.success && serviceRes.data) {
        cartStore.setCart(serviceRes.data)
        uiStore.showNotification('success', 'Product and installation added to cart')
      } else {
        uiStore.showNotification('success', 'Product added; installation could not be added')
      }
    } else {
      uiStore.showNotification('success', 'Product added to cart. No installation service available.')
    }
  } catch {
    uiStore.showNotification('error', 'Could not add to cart')
  } finally {
    addingInstallationId.value = null
  }
}

watch([requestParams], () => loadProducts(), { immediate: false })
watch(selectedCategoryId, () => { pagination.value.page = 1 })
watch([minPrice, maxPrice], () => { pagination.value.page = 1 })

// Debounce search: update searchApplied after 300ms idle, then reload
let searchDebounce: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (q) => {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    searchApplied.value = q
    pagination.value.page = 1
    searchDebounce = null
  }, 300)
})

loadCategories()
loadProducts()
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
