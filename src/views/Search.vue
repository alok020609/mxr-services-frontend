<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="w-full md:w-64">
          <div class="card p-4 sticky top-4">
            <h3 class="font-semibold text-lg mb-4">Filters</h3>
            
            <!-- Search Query -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                v-model="searchFilters.query"
                type="text"
                placeholder="Search products..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                @keyup.enter="performSearch"
              />
            </div>

            <!-- Category Filter -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="searchFilters.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                @change="performSearch"
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
                  v-model.number="searchFilters.minPrice"
                  type="number"
                  placeholder="Min"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  @change="performSearch"
                />
                <input
                  v-model.number="searchFilters.maxPrice"
                  type="number"
                  placeholder="Max"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  @change="performSearch"
                />
              </div>
            </div>

            <!-- In Stock Filter -->
            <div class="mb-4">
              <label class="flex items-center">
                <input
                  v-model="searchFilters.inStock"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  @change="performSearch"
                />
                <span class="ml-2 text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>

            <!-- Rating Filter -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
              <select
                v-model.number="searchFilters.rating"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                @change="performSearch"
              >
                <option :value="undefined">Any Rating</option>
                <option :value="4">4+ Stars</option>
                <option :value="3">3+ Stars</option>
                <option :value="2">2+ Stars</option>
                <option :value="1">1+ Stars</option>
              </select>
            </div>

            <!-- Sort By -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                v-model="searchFilters.sortBy"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                @change="performSearch"
              >
                <option value="relevance">Relevance</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="createdAt">Newest</option>
              </select>
            </div>

            <!-- Sort Order -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                v-model="searchFilters.sortOrder"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                @change="performSearch"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <!-- Save Search Button -->
            <Button
              v-if="isAuthenticated && hasResults"
              @click="saveSearch"
              variant="secondary"
              size="sm"
              class="w-full"
            >
              Save Search
            </Button>

            <Button
              @click="clearFilters"
              variant="secondary"
              size="sm"
              class="w-full mt-2"
            >
              Clear Filters
            </Button>
          </div>
        </aside>

        <!-- Search Results -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-3xl font-bold">Search Results</h1>
            <div v-if="searchResult" class="text-gray-600">
              {{ searchResult.total }} result{{ searchResult.total !== 1 ? 's' : '' }} found
            </div>
          </div>

          <div v-if="isLoading" class="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>

          <div v-else-if="error" class="text-center py-12">
            <p class="text-red-600 mb-4">{{ error }}</p>
            <Button @click="performSearch" variant="primary">Retry</Button>
          </div>

          <div v-else-if="!searchResult || products.length === 0" class="text-center py-12">
            <p class="text-gray-500 mb-4">No products found</p>
            <p class="text-sm text-gray-400">Try adjusting your search filters</p>
          </div>

          <div v-else class="space-y-6">
            <!-- Products Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="product in products" :key="product.id" class="card hover:shadow-lg transition-shadow">
                <router-link :to="`/products/${product.id}`">
                  <img :src="product.images[0] || '/placeholder.jpg'" :alt="product.name" class="w-full h-48 object-cover rounded-lg mb-4" />
                  <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
                  <p class="text-primary-600 font-bold mb-2">{{ formatPrice(product.price) }}</p>
                  <div v-if="product.rating" class="flex items-center">
                    <span class="text-yellow-500 text-sm">{{ '★'.repeat(Math.round(product.rating)) }}</span>
                    <span class="text-gray-500 text-sm ml-2">({{ product.reviewCount || 0 }})</span>
                  </div>
                  <div v-if="product.stock === 0" class="mt-2 text-sm text-red-600">Out of Stock</div>
                </router-link>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="searchResult && searchResult.total > searchResult.limit" class="flex justify-center items-center gap-4 mt-8">
              <Button
                @click="goToPage(searchResult.page - 1)"
                :disabled="searchResult.page <= 1"
                variant="secondary"
                size="sm"
              >
                Previous
              </Button>
              <span class="text-gray-600">
                Page {{ searchResult.page }} of {{ Math.ceil(searchResult.total / searchResult.limit) }}
              </span>
              <Button
                @click="goToPage(searchResult.page + 1)"
                :disabled="searchResult.page >= Math.ceil(searchResult.total / searchResult.limit)"
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
import { useRoute, useRouter } from 'vue-router'
import { searchApi } from '@/api/endpoints/search'
import { productsApi } from '@/api/endpoints/products'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import type { Product } from '@/api/types'
import type { AdvancedSearchRequest, AdvancedSearchResult } from '@/api/endpoints/search'
import type { Category } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const sidebarOpen = ref(false)
const isLoading = ref(false)
const error = ref('')
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const searchResult = ref<AdvancedSearchResult | null>(null)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const searchFilters = ref<AdvancedSearchRequest>({
  query: '',
  category: '',
  minPrice: undefined,
  maxPrice: undefined,
  inStock: undefined,
  rating: undefined,
  sortBy: 'relevance',
  sortOrder: 'desc',
  page: 1,
  limit: 12
})

const hasResults = computed(() => searchResult.value && searchResult.value.total > 0)

const loadCategories = async () => {
  try {
    const response = await productsApi.getCategories()
    if (response.success && response.data) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const performSearch = async () => {
  if (!searchFilters.value.query && !searchFilters.value.category) {
    products.value = []
    searchResult.value = null
    return
  }

  isLoading.value = true
  error.value = ''
  
  try {
    const response = await searchApi.advancedSearch(searchFilters.value)
    if (response.success && response.data) {
      searchResult.value = response.data
      products.value = response.data.products || []
    } else {
      error.value = response.error || 'Search failed'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Search failed'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page: number) => {
  searchFilters.value.page = page
  performSearch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
  searchFilters.value = {
    query: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    inStock: undefined,
    rating: undefined,
    sortBy: 'relevance',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  }
  products.value = []
  searchResult.value = null
}

const saveSearch = async () => {
  if (!isAuthenticated.value) {
    uiStore.showNotification('error', 'Please login to save searches')
    return
  }

  try {
    const response = await searchApi.saveSearch({
      name: `Search: ${searchFilters.value.query || 'All Products'}`,
      query: searchFilters.value.query || '',
      filters: searchFilters.value
    })
    if (response.success) {
      uiStore.showNotification('success', 'Search saved successfully')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to save search')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to save search')
  }
}

// Initialize from route query
onMounted(async () => {
  await loadCategories()
  
  const query = route.query.q as string
  if (query) {
    searchFilters.value.query = query
  }
  
  const category = route.query.category as string
  if (category) {
    searchFilters.value.category = category
  }
  
  if (query || category) {
    await performSearch()
  }
})

// Watch for route query changes
watch(() => route.query, (newQuery) => {
  if (newQuery.q) {
    searchFilters.value.query = newQuery.q as string
    performSearch()
  }
}, { immediate: false })
</script>

