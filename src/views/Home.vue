<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main>
      <!-- Banner Carousel -->
      <section class="mb-8">
        <div class="container mx-auto px-4">
          <BannerCarousel height="400px" :auto-rotate="true" :show-dots="true" />
        </div>
      </section>
      
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl font-bold mb-4">Welcome to Our Store</h1>
          <p class="text-xl mb-8">Discover amazing products at great prices</p>
          <router-link to="/products" class="btn bg-white text-primary-600 hover:bg-gray-100">
            Shop Now
          </router-link>
        </div>
      </section>

      <!-- Recently Viewed -->
      <section v-if="isAuthenticated" class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <RecentlyViewed />
        </div>
      </section>

      <!-- Featured Products -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-8">Featured Products</h2>
          <div v-if="isLoadingFeatured" class="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
          <div v-else-if="featuredProducts.length === 0" class="text-center py-12">
            <p class="text-gray-500">No featured products available</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="product in featuredProducts" :key="product.id" class="card hover:shadow-lg transition-shadow">
              <router-link :to="`/products/${product.id}`">
                <img :src="product.images[0] || '/placeholder.jpg'" :alt="product.name" class="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
                <p class="text-primary-600 font-bold">{{ formatPrice(product.price) }}</p>
                <div v-if="product.rating" class="flex items-center mt-2">
                  <span class="text-yellow-500 text-sm">{{ '★'.repeat(Math.round(product.rating)) }}</span>
                  <span class="text-gray-500 text-sm ml-2">({{ product.reviewCount || 0 }})</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Product Recommendations -->
      <section v-if="isAuthenticated && recommendations.length > 0" class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-8">Recommended for You</h2>
          <div v-if="isLoadingRecommendations" class="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="rec in recommendations" :key="rec.product.id" class="card hover:shadow-lg transition-shadow">
              <router-link :to="`/products/${rec.product.id}`">
                <img :src="rec.product.images[0] || '/placeholder.jpg'" :alt="rec.product.name" class="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 class="font-semibold text-lg mb-2">{{ rec.product.name }}</h3>
                <p class="text-primary-600 font-bold">{{ formatPrice(rec.product.price) }}</p>
                <p v-if="rec.reason" class="text-sm text-gray-500 mt-1">{{ rec.reason }}</p>
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { productManagementApi } from '@/api/endpoints/product-management'
import { searchApi } from '@/api/endpoints/search'
import { productsApi } from '@/api/endpoints/products'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import BannerCarousel from '@/components/cms/BannerCarousel.vue'
import RecentlyViewed from '@/components/experience/RecentlyViewed.vue'
import type { Product } from '@/api/types'
import type { ProductRecommendation } from '@/api/endpoints/search'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const sidebarOpen = ref(false)
const isLoadingFeatured = ref(false)
const isLoadingRecommendations = ref(false)
const featuredProducts = ref<Product[]>([])
const recommendations = ref<ProductRecommendation[]>([])
const isAuthenticated = computed(() => authStore.isAuthenticated)

const loadFeaturedProducts = async () => {
  isLoadingFeatured.value = true
  try {
    const response = await productManagementApi.getFeaturedProducts()
    console.log('Home - Get featured products response:', response)
    
    if (response.success && response.data) {
      // Backend returns data as array directly, or as object with products property
      if (Array.isArray(response.data)) {
        // Data is directly an array
        featuredProducts.value = response.data
        console.log('Home - Loaded featured products (array):', featuredProducts.value.length)
      } else if (response.data.products && Array.isArray(response.data.products)) {
        // Data is object with products property
        featuredProducts.value = response.data.products
        console.log('Home - Loaded featured products (object):', featuredProducts.value.length)
      } else {
        console.warn('Home - No featured products in response, using fallback')
        await loadFallbackProducts()
      }
    } else {
      // Fallback to regular products if featured products endpoint fails
      console.warn('Home - Featured products endpoint failed, falling back to regular products')
      await loadFallbackProducts()
    }
  } catch (error: any) {
    // If featured products endpoint fails (e.g., 500 error), fallback to regular products
    console.warn('Home - Featured products endpoint unavailable, using fallback:', error)
    await loadFallbackProducts()
  } finally {
    isLoadingFeatured.value = false
  }
}

const loadFallbackProducts = async () => {
  try {
    // Fallback to regular products API if featured products endpoint is not available
    const response = await productsApi.getProducts({ limit: 8, page: 1, sortBy: 'createdAt', sortOrder: 'desc' })
    if (response.success && response.data) {
      featuredProducts.value = response.data.data || []
    }
  } catch (error) {
    console.error('Fallback products load also failed:', error)
    // Don't show error notification for fallback failure - just leave empty
  }
}

const loadRecommendations = async () => {
  if (!isAuthenticated.value) return
  
  isLoadingRecommendations.value = true
  try {
    const response = await searchApi.getRecommendations()
    if (response.success && response.data) {
      recommendations.value = response.data
    }
  } catch (error: any) {
    // Silently fail - recommendations are not critical
    console.error('Failed to load recommendations:', error)
  } finally {
    isLoadingRecommendations.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    loadFeaturedProducts(),
    loadRecommendations()
  ])
})
</script>

