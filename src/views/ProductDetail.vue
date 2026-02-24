<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="product" class="space-y-8">
        <!-- Product Header -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Product Images -->
          <div>
            <ProductImageGallery
              :images="product.images || []"
              :product-name="product.name"
            />
          </div>
          
          <!-- Product Info -->
          <div>
            <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>
            
            <!-- Social Proof -->
            <div class="mb-4">
              <SocialProof :product-id="product.id" />
            </div>
            
            <p class="text-2xl font-bold text-primary-600 mb-4">{{ formatPrice(product.price) }}</p>
            <p class="text-gray-600 mb-6">{{ product.description }}</p>
            
            <!-- Stock Status -->
            <div class="mb-6">
              <div v-if="product.stock > 0" class="flex items-center gap-2 text-green-600 mb-4">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>In Stock ({{ product.stock }} available)</span>
              </div>
              <div v-else class="flex items-center gap-2 text-red-600 mb-4">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Out of Stock</span>
              </div>
            </div>
            
            <!-- Quantity Selector -->
            <div class="mb-6" v-if="product.stock > 0">
              <label class="block text-sm font-medium mb-2">Quantity</label>
              <div class="flex items-center gap-4">
                <button
                  @click="quantity > 1 && quantity--"
                  class="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                  :disabled="quantity <= 1"
                >
                  -
                </button>
                <span class="text-lg font-semibold w-12 text-center">{{ quantity }}</span>
                <button
                  @click="quantity++"
                  class="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                  :disabled="quantity >= product.stock"
                >
                  +
                </button>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="space-y-3">
              <Button
                v-if="product.stock > 0"
                variant="primary"
                class="w-full"
                :loading="isAdding"
                @click="addToCart"
              >
                Add to Cart
              </Button>
              
              <WaitlistButton
                v-if="product.stock === 0"
                :product-id="product.id"
              />
              
              <div class="flex gap-2">
                <ProductAlertButton
                  :product-id="product.id"
                  :current-price="typeof product.price === 'string' ? parseFloat(product.price) : product.price"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Services for this product's category -->
        <div v-if="product && categoryServices.length > 0" class="card p-6 mt-8">
          <h2 class="text-xl font-bold mb-4">Services for {{ product.category?.name || 'this category' }}</h2>
          <p class="text-sm text-gray-600 mb-4">Price is per unit. Amount = price × quantity (minimum quantity 1).</p>
          <div class="space-y-3">
            <div
              v-for="svc in categoryServices"
              :key="svc.id"
              class="flex flex-wrap items-center justify-between gap-3 p-3 border rounded-lg"
            >
              <img
                :src="svc.image || '/placeholder.jpg'"
                :alt="svc.name"
                class="w-16 h-16 object-cover rounded flex-shrink-0"
                @error="($event.target as HTMLImageElement).src = '/placeholder.jpg'"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold">{{ svc.name }}</h3>
                <p class="text-sm text-gray-600">{{ svc.type }} · {{ formatPrice(Number(svc.price)) }} per item{{ svc.durationMinutes ? ` · ${svc.durationMinutes} min` : '' }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span v-if="isScopedService(svc)" class="text-sm text-gray-600">Qty from cart: {{ getDerivedQtyForService(svc) }}</span>
                <input
                  v-else
                  v-model.number="serviceQuantities[svc.id]"
                  type="number"
                  min="1"
                  class="w-20 text-center border rounded px-2 py-1"
                  @input="clampServiceQty(svc.id)"
                />
                <Button
                  variant="outline"
                  size="sm"
                  :loading="addingServiceId === svc.id"
                  :disabled="isScopedService(svc) && getDerivedQtyForService(svc) < 1"
                  @click="addServiceToCart(svc)"
                >
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        </div>
        <!-- Product-specific services -->
        <div v-if="product && productOnlyServices.length > 0" class="card p-6 mt-8">
          <h2 class="text-xl font-bold mb-4">Services for this product</h2>
          <p class="text-sm text-gray-600 mb-4">Price is per unit. Amount = price × quantity (minimum quantity 1).</p>
          <div class="space-y-3">
            <div
              v-for="svc in productOnlyServices"
              :key="svc.id"
              class="flex flex-wrap items-center justify-between gap-3 p-3 border rounded-lg"
            >
              <img
                :src="svc.image || '/placeholder.jpg'"
                :alt="svc.name"
                class="w-16 h-16 object-cover rounded flex-shrink-0"
                @error="($event.target as HTMLImageElement).src = '/placeholder.jpg'"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold">{{ svc.name }}</h3>
                <p class="text-sm text-gray-600">{{ svc.type }} · {{ formatPrice(Number(svc.price)) }} per item{{ svc.durationMinutes ? ` · ${svc.durationMinutes} min` : '' }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span v-if="isScopedService(svc)" class="text-sm text-gray-600">Qty from cart: {{ getDerivedQtyForService(svc) }}</span>
                <input
                  v-else
                  v-model.number="serviceQuantities[svc.id]"
                  type="number"
                  min="1"
                  class="w-20 text-center border rounded px-2 py-1"
                  @input="clampServiceQty(svc.id)"
                />
                <Button
                  variant="outline"
                  size="sm"
                  :loading="addingServiceId === svc.id"
                  :disabled="isScopedService(svc) && getDerivedQtyForService(svc) < 1"
                  @click="addServiceToCart(svc)"
                >
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Product Details Tabs -->
        <div class="card">
          <!-- Tabs -->
          <div class="border-b mb-6">
            <div class="flex space-x-1 overflow-x-auto">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
          
          <!-- Tab Content -->
          <div v-if="activeTab === 'details'">
            <div class="prose max-w-none">
              <h3 class="text-lg font-bold mb-4">Product Details</h3>
              
              <!-- Product Description -->
              <div v-if="product.description" class="mb-6">
                <h4 class="text-md font-semibold mb-2">Description</h4>
                <p class="text-gray-700 whitespace-pre-line">{{ product.description }}</p>
              </div>
              
              <!-- Specifications from API -->
              <div v-if="isLoadingSpecs" class="flex justify-center py-8">
                <LoadingSpinner size="sm" />
              </div>
              <div v-else-if="specifications && specifications.length > 0" class="space-y-2 mb-6">
                <h4 class="text-md font-semibold mb-3">Specifications</h4>
                <div
                  v-for="spec in specifications"
                  :key="spec.key"
                  class="flex border-b pb-2"
                >
                  <span class="font-semibold w-1/3">{{ spec.key }}:</span>
                  <span class="flex-1">
                    {{ spec.value }}{{ spec.unit ? ` ${spec.unit}` : '' }}
                  </span>
                </div>
              </div>
              
              <!-- Specifications from product object -->
              <div v-else-if="product.specifications && Object.keys(product.specifications).length > 0" class="space-y-2 mb-6">
                <h4 class="text-md font-semibold mb-3">Specifications</h4>
                <div
                  v-for="(value, key) in product.specifications"
                  :key="key"
                  class="flex border-b pb-2"
                >
                  <span class="font-semibold w-1/3">{{ key }}:</span>
                  <span class="flex-1">{{ typeof value === 'object' ? JSON.stringify(value) : value }}</span>
                </div>
              </div>
              
              <!-- Additional Product Information -->
              <div v-if="product.brand || product.modelNumber || product.countryOfOrigin || product.warrantyInfo" class="mt-6 space-y-2">
                <h4 class="text-md font-semibold mb-3">Additional Information</h4>
                <div v-if="product.brand" class="flex border-b pb-2">
                  <span class="font-semibold w-1/3">Brand:</span>
                  <span class="flex-1">{{ product.brand }}</span>
                </div>
                <div v-if="product.modelNumber" class="flex border-b pb-2">
                  <span class="font-semibold w-1/3">Model Number:</span>
                  <span class="flex-1">{{ product.modelNumber }}</span>
                </div>
                <div v-if="product.countryOfOrigin" class="flex border-b pb-2">
                  <span class="font-semibold w-1/3">Country of Origin:</span>
                  <span class="flex-1">{{ product.countryOfOrigin }}</span>
                </div>
                <div v-if="product.warrantyInfo" class="flex border-b pb-2">
                  <span class="font-semibold w-1/3">Warranty:</span>
                  <span class="flex-1">{{ product.warrantyInfo }}</span>
                </div>
              </div>
              
              <p v-if="!product.description && (!specifications || specifications.length === 0) && (!product.specifications || Object.keys(product.specifications).length === 0) && !product.brand && !product.modelNumber && !product.countryOfOrigin && !product.warrantyInfo" class="text-gray-500">No additional details available.</p>
            </div>
          </div>
          
          <div v-if="activeTab === 'questions'">
            <ProductQuestions :product-id="product.id" />
          </div>
          
          <div v-if="activeTab === 'size-guide'">
            <SizeGuide :product-id="product.id" />
          </div>
          
          <div v-if="activeTab === 'videos'">
            <ProductVideos :product-id="product.id" />
          </div>
        </div>

        <!-- Product Recommendations -->
        <div v-if="recommendations.length > 0" class="mt-12">
          <h2 class="text-2xl font-bold mb-6">You May Also Like</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="rec in recommendations" :key="rec.product.id" class="card hover:shadow-lg transition-shadow">
              <router-link :to="`/products/${rec.product.id}`">
                <img :src="rec.product.images[0] || '/placeholder.jpg'" :alt="rec.product.name" class="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 class="font-semibold text-lg mb-2">{{ rec.product.name }}</h3>
                <p class="text-primary-600 font-bold mb-2">{{ formatPrice(rec.product.price) }}</p>
                <p v-if="rec.reason" class="text-sm text-gray-500">{{ rec.reason }}</p>
              </router-link>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'
import { productsApi } from '@/api/endpoints/products'
import { cartApi } from '@/api/endpoints/cart'
import { servicesApi } from '@/api/endpoints/services'
import { useCart } from '@/composables/useCart'
import { experienceApi } from '@/api/endpoints/experience'
import { productManagementApi } from '@/api/endpoints/product-management'
import { searchApi } from '@/api/endpoints/search'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import SocialProof from '@/components/experience/SocialProof.vue'
import WaitlistButton from '@/components/experience/WaitlistButton.vue'
import ProductAlertButton from '@/components/experience/ProductAlertButton.vue'
import ProductQuestions from '@/components/experience/ProductQuestions.vue'
import SizeGuide from '@/components/experience/SizeGuide.vue'
import ProductVideos from '@/components/experience/ProductVideos.vue'
import ProductImageGallery from '@/components/products/ProductImageGallery.vue'
import type { Product, Service } from '@/api/types'
import type { ProductSpecification } from '@/api/endpoints/product-management'
import type { ProductRecommendation } from '@/api/endpoints/search'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import { getDerivedServiceQuantity, isScopedService } from '@/composables/useServiceQuantity'

const { formatPrice } = usePriceFormatter()
const route = useRoute()
const cartStore = useCartStore()
const uiStore = useUIStore()
const { cart, loadCart, addOrUpdateServiceInCart } = useCart()
const sidebarOpen = ref(false)
const isLoading = ref(false)
const isLoadingSpecs = ref(false)
const isLoadingRecommendations = ref(false)
const isAdding = ref(false)
const product = ref<Product | null>(null)
const specifications = ref<ProductSpecification[]>([])
const recommendations = ref<ProductRecommendation[]>([])
const categoryServices = ref<Service[]>([])
const productOnlyServices = ref<Service[]>([])
const serviceQuantities = ref<Record<string, number>>({})
const addingServiceId = ref<string | null>(null)
const quantity = ref(1)
const activeTab = ref<'details' | 'questions' | 'size-guide' | 'videos'>('details')

const tabs = [
  { id: 'details', label: 'Details' },
  { id: 'questions', label: 'Questions & Answers' },
  { id: 'size-guide', label: 'Size Guide' },
  { id: 'videos', label: 'Videos' }
]

const trackProductView = async () => {
  if (!product.value) return
  
  try {
    // The API automatically tracks views when fetching recently viewed
    // We can call getRecentlyViewed to trigger tracking
    await experienceApi.getRecentlyViewed()
  } catch (error) {
    // Silently fail - tracking is not critical
    console.error('Failed to track product view:', error)
  }
}

const loadProductSpecifications = async (productId: string) => {
  isLoadingSpecs.value = true
  try {
    const response = await productManagementApi.getProductSpecifications(productId)
    if (response.success && response.data) {
      specifications.value = response.data
    }
  } catch (error) {
    // Silently fail - specifications are optional
    console.error('Failed to load product specifications:', error)
  } finally {
    isLoadingSpecs.value = false
  }
}

const loadRecommendations = async (productId: string) => {
  isLoadingRecommendations.value = true
  try {
    const response = await searchApi.getRecommendations(productId)
    if (response.success && response.data) {
      recommendations.value = response.data
    }
  } catch (error) {
    // Silently fail - recommendations are optional
    console.error('Failed to load recommendations:', error)
  } finally {
    isLoadingRecommendations.value = false
  }
}

const loadProductServices = async (productId: string, categoryId?: string) => {
  try {
    const categoryIds = new Set<string>()
    let byCategory: Service[] = []
    if (categoryId) {
      const catRes = await servicesApi.getServices({ categoryId, isActive: true })
      if (catRes.success && catRes.data) {
        byCategory = catRes.data
        byCategory.forEach(s => categoryIds.add(s.id))
      }
    }
    categoryServices.value = byCategory

    const byProductRes = await servicesApi.getServices({ productId, isActive: true })
    const byProduct = (byProductRes.success && byProductRes.data) ? byProductRes.data : []
    productOnlyServices.value = byProduct.filter(s => !categoryIds.has(s.id))

    const allServices = [...byCategory, ...productOnlyServices.value]
    const qty: Record<string, number> = {}
    allServices.forEach(s => { qty[s.id] = Math.max(1, serviceQuantities.value[s.id] ?? 1) })
    serviceQuantities.value = qty
  } catch {
    categoryServices.value = []
    productOnlyServices.value = []
  }
}

function getServiceQty(serviceId: string): number {
  return Math.max(1, serviceQuantities.value[serviceId] ?? 1)
}

function clampServiceQty(serviceId: string) {
  const v = serviceQuantities.value[serviceId]
  if (v !== undefined && v < 1) serviceQuantities.value[serviceId] = 1
}

function getDerivedQtyForService(svc: Service): number {
  const items = cart.value?.items ?? []
  const d = getDerivedServiceQuantity(items, svc)
  return d !== null ? Math.max(0, d) : 1
}

const addServiceToCart = async (svc: Service) => {
  addingServiceId.value = svc.id
  try {
    await loadCart({ silent: true })
    const items = cart.value?.items ?? []
    const derived = getDerivedServiceQuantity(items, svc)
    const qty = isScopedService(svc) && derived !== null
      ? (derived < 1 ? 0 : Math.max(1, derived))
      : Math.max(1, getServiceQty(svc.id))
    if (qty < 1) {
      uiStore.showNotification('warning', 'Add the related product to cart first')
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

const loadProduct = async (productId: string) => {
  if (!productId) return
  isLoading.value = true
  try {
    const response = await productsApi.getProduct(productId)
    if (response.success && response.data) {
      product.value = response.data
      quantity.value = 1
      await trackProductView()
      await Promise.all([
        loadProductSpecifications(productId),
        loadRecommendations(productId),
        loadProductServices(productId, product.value.categoryId)
      ])
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load product')
    }
  } catch (error) {
    uiStore.showNotification('error', 'Failed to load product')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProduct(route.params.id as string)
})

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      loadProduct(newId as string)
    }
  }
)

const addToCart = async () => {
  if (!product.value) return
  
  isAdding.value = true
  try {
    const response = await cartApi.addItem({
      productId: product.value.id,
      quantity: quantity.value
    })
    if (response.success) {
      const hasItems = Array.isArray(response.data?.items) && response.data.items.length > 0
      if (hasItems) {
        cartStore.setCart(response.data)
      } else {
        const getRes = await cartApi.getCart()
        if (getRes.success && getRes.data) cartStore.setCart(getRes.data)
      }
      uiStore.showNotification('success', 'Product added to cart!')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to add product to cart')
    }
  } catch (error) {
    uiStore.showNotification('error', 'Failed to add product to cart')
  } finally {
    isAdding.value = false
  }
}
</script>
