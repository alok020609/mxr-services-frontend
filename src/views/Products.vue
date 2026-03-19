<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="w-full md:w-64">
          <div class="card p-4 sticky top-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-lg">Filters</h3>
              <button
                @click="clearFilters"
                class="text-sm text-primary-600 hover:text-primary-800"
              >
                Clear All
              </button>
            </div>

            <!-- Category Filter -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="selectedCategory"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Price Range -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div class="flex gap-2">
                <input
                  v-model.number="priceRange.min"
                  type="number"
                  placeholder="Min"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  @change="applyFilters"
                />
                <input
                  v-model.number="priceRange.max"
                  type="number"
                  placeholder="Max"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  @change="applyFilters"
                />
              </div>
            </div>

            <!-- In Stock Filter -->
            <div class="mb-4">
              <label class="flex items-center">
                <input
                  v-model="inStockOnly"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  @change="applyFilters"
                />
                <span class="ml-2 text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>

            <!-- Rating Filter -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
              <select
                v-model.number="minRating"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option :value="undefined">Any Rating</option>
                <option :value="4">4+ Stars</option>
                <option :value="3">3+ Stars</option>
                <option :value="2">2+ Stars</option>
                <option :value="1">1+ Stars</option>
              </select>
            </div>
          </div>
        </aside>

        <!-- Products Section -->
        <div class="flex-1">
          <!-- Services for this category (when a category is selected) -->
          <div v-if="selectedCategory && categoryServices.length > 0" class="card p-6 mb-8">
            <h2 class="text-xl font-bold mb-4">Services for {{ selectedCategoryName }}</h2>
            <p class="text-sm text-gray-600 mb-4">Price is per unit. Amount = price × quantity (minimum quantity 1).</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="svc in categoryServices"
                :key="svc.id"
                class="flex flex-wrap items-center justify-between gap-3 p-3 border rounded-lg"
              >
                <img
                  :src="svc.image || '/placeholder.png'"
                  :alt="svc.name"
                  class="w-16 h-16 object-cover rounded flex-shrink-0"
                  @error="($event.target as HTMLImageElement).src = '/placeholder.png'"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold">{{ svc.name }}</h3>
                  <p class="text-sm text-gray-600">{{ svc.type }} · {{ formatPrice(Number(svc.price)) }} per item</p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="text-sm text-gray-600">Qty from cart: {{ getCategoryServiceDerivedQty(svc) }}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    :loading="addingServiceId === svc.id"
                    :disabled="getCategoryServiceDerivedQty(svc) < 1"
                    @click="addCategoryServiceToCart(svc)"
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sort and View Toggle -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                v-model="sortBy"
                @change="applyFilters"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="createdAt">Newest</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
              <select
                v-model="sortOrder"
                @change="applyFilters"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div class="text-gray-600 text-sm">
              {{ total }} product{{ total !== 1 ? 's' : '' }} found
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <p class="text-red-600 mb-4">{{ error }}</p>
            <Button @click="loadProducts" variant="primary">Retry</Button>
          </div>

          <!-- Empty State -->
          <div v-else-if="products.length === 0" class="text-center py-12">
            <p class="text-gray-500 mb-4">No products found</p>
            <p class="text-sm text-gray-400 mb-4">Try adjusting your filters</p>
            <Button @click="clearFilters" variant="secondary">Clear Filters</Button>
          </div>

          <!-- Products Grid -->
          <div v-else class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="product in products" :key="product.id" class="card hover:shadow-lg transition-shadow">
                <router-link :to="`/products/${product.id}`">
                  <img :src="product.images[0] || '/placeholder.png'" :alt="product.name" class="w-full h-48 object-cover rounded-lg mb-4" />
                  <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
                  <p class="text-primary-600 font-bold mb-2">{{ formatPrice(product.price) }}</p>
                  <div v-if="product.rating" class="flex items-center mb-2">
                    <span class="text-yellow-500 text-sm">{{ '★'.repeat(Math.round(product.rating)) }}</span>
                    <span class="text-gray-500 text-sm ml-2">({{ product.reviewCount || 0 }})</span>
                  </div>
                  <div v-if="product.stock === 0" class="text-sm text-red-600">Out of Stock</div>
                  <div v-else-if="product.stock < 10" class="text-sm text-orange-600">Only {{ product.stock }} left</div>
                </router-link>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
              <Button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage <= 1"
                variant="secondary"
                size="sm"
              >
                Previous
              </Button>
              <div class="flex gap-2">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'px-3 py-1 rounded',
                    page === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              <Button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                variant="secondary"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useUIStore } from '@/stores/ui'
import { productsApi } from '@/api/endpoints/products'
import { servicesApi } from '@/api/endpoints/services'
import { useCart } from '@/composables/useCart'
import { getDerivedServiceQuantity } from '@/composables/useServiceQuantity'
import type { Category, Service, Product } from '@/api/types'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const productsStore = useProductsStore()
const uiStore = useUIStore()
const { cart, loadCart, addOrUpdateServiceInCart } = useCart()
const sidebarOpen = ref(false)
const error = ref('')
const categories = ref<Category[]>([])
const categoryServices = ref<Service[]>([])
const categoryServiceQuantities = ref<Record<string, number>>({})
const addingServiceId = ref<string | null>(null)

const selectedCategoryName = computed(() => {
  if (!selectedCategory.value) return ''
  return categories.value.find(c => c.id === selectedCategory.value)?.name ?? 'this category'
})
const selectedCategory = ref('')
const priceRange = ref({ min: undefined as number | undefined, max: undefined as number | undefined })
const inStockOnly = ref(false)
const minRating = ref<number | undefined>(undefined)
const sortBy = ref<'createdAt' | 'price' | 'name' | 'rating'>('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

const isLoading = computed(() => productsStore.isLoading)
const products = computed(() => productsStore.products)
const total = computed(() => productsStore.total)
const currentPage = computed(() => productsStore.page)
const limit = computed(() => productsStore.filters.limit || 20)
const totalPages = computed(() => Math.ceil(total.value / limit.value))

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const loadCategories = async () => {
  try {
    const response = await productsApi.getCategories()
    if (response.success && response.data) {
      categories.value = response.data
      productsStore.setCategories(response.data)
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const loadCategoryServices = async () => {
  if (!selectedCategory.value) {
    categoryServices.value = []
    categoryServiceQuantities.value = {}
    return
  }
  try {
    const res = await servicesApi.getServices({ categoryId: selectedCategory.value, isActive: true })
    if (res.success && res.data) {
      categoryServices.value = res.data
      const qty: Record<string, number> = {}
      res.data.forEach(s => { qty[s.id] = categoryServiceQuantities.value[s.id] ?? 1 })
      categoryServiceQuantities.value = qty
    } else {
      categoryServices.value = []
    }
  } catch {
    categoryServices.value = []
  }
}

function clampCategoryServiceQty(serviceId: string) {
  const v = categoryServiceQuantities.value[serviceId]
  if (v !== undefined && v < 1) categoryServiceQuantities.value[serviceId] = 1
}

function getCategoryServiceDerivedQty(svc: { productId?: string | null; categoryId?: string | null }): number {
  const items = cart.value?.items ?? []
  const d = getDerivedServiceQuantity(items, svc)
  return d !== null ? Math.max(0, d) : 1
}

const addCategoryServiceToCart = async (svc: { id: string; productId?: string | null; categoryId?: string | null }) => {
  addingServiceId.value = svc.id
  try {
    await loadCart({ silent: true })
    const items = cart.value?.items ?? []
    const derived = getDerivedServiceQuantity(items, svc)
    const qty = derived !== null ? Math.max(0, derived) : 1
    if (qty < 1) {
      uiStore.showNotification('warning', 'Add products from this category to cart first')
      return
    }
    const result = await addOrUpdateServiceInCart(svc.id, qty)
    if (!result?.success) {
      uiStore.showNotification('error', 'Failed to add service to cart')
    }
  } catch {
    uiStore.showNotification('error', 'Failed to add service to cart')
  } finally {
    addingServiceId.value = null
  }
}

const loadProducts = async () => {
  productsStore.setLoading(true)
  error.value = ''
  
  try {
    const filters: any = {
      page: currentPage.value,
      limit: limit.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    }
    
    if (selectedCategory.value) {
      filters.categoryId = selectedCategory.value
    }
    
    if (priceRange.value.min !== undefined) {
      filters.minPrice = priceRange.value.min
    }
    
    if (priceRange.value.max !== undefined) {
      filters.maxPrice = priceRange.value.max
    }
    
    if (inStockOnly.value) {
      filters.inStock = true
    }
    
    if (minRating.value !== undefined) {
      filters.minRating = minRating.value
    }
    
    productsStore.setFilters(filters)
    
    const response = await productsApi.getProducts(filters)
    if (response.success && response.data) {
      // The API returns: { success: true, data: Product[], pagination: {...} }
      // After axios processing, response.data is the axios response.data
      // So response.data should be: { success: true, data: Product[], pagination: {...} }
      // But the type says ApiResponse<PaginatedResponse<Product>>, meaning:
      // response.data should be PaginatedResponse = { data: Product[], pagination: {...} }
      
      let products: Product[] = []
      let totalCount = 0
      
      // Check if response.data has the PaginatedResponse structure (nested data and pagination)
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // Standard PaginatedResponse format: { data: Product[], pagination: {...} }
        products = (response.data as any).data || []
        // Try to get pagination from nested structure first
        if ((response.data as any).pagination && typeof (response.data as any).pagination === 'object') {
          totalCount = (response.data as any).pagination.total || 0
        } else {
          // Fallback: try root level pagination
          totalCount = (response as any).pagination?.total || products.length
        }
      } else if (Array.isArray(response.data)) {
        // response.data is directly an array (unexpected but handle it)
        products = response.data
        totalCount = (response as any).pagination?.total || products.length
      } else {
        // Fallback: empty
        products = []
        totalCount = 0
      }
      
      productsStore.setProducts(products, totalCount)
    } else {
      error.value = response.error || 'Failed to load products'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load products'
    uiStore.showNotification('error', error.value)
  } finally {
    productsStore.setLoading(false)
  }
}

const applyFilters = () => {
  productsStore.setPage(1)
  loadCategoryServices()
  loadProducts()
}

const clearFilters = () => {
  selectedCategory.value = ''
  categoryServices.value = []
  priceRange.value = { min: undefined, max: undefined }
  inStockOnly.value = false
  minRating.value = undefined
  sortBy.value = 'createdAt'
  sortOrder.value = 'desc'
  productsStore.resetFilters()
  loadCategoryServices()
  loadProducts()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    productsStore.setPage(page)
    loadProducts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(async () => {
  await loadCategories()
  await loadCategoryServices()
  await loadProducts()
})
</script>

