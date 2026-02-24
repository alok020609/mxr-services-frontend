<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">My Coupons</h1>
        <div class="flex gap-2">
          <button
            @click="filter = 'all'"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            All
          </button>
          <button
            @click="filter = 'active'"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              filter === 'active' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            Active
          </button>
          <button
            @click="filter = 'expired'"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              filter === 'expired' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            Expired
          </button>
        </div>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="filteredCoupons.length === 0" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
        <p class="text-gray-600 mb-4 text-lg">No coupons available</p>
        <p class="text-gray-500 text-sm">You don't have any {{ filter === 'all' ? '' : filter }} coupons at the moment.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="coupon in filteredCoupons"
          :key="coupon.id"
          :class="[
            'card p-6 relative overflow-hidden',
            isExpired(coupon) ? 'opacity-75' : 'hover:shadow-lg transition-shadow'
          ]"
        >
          <div
            v-if="isExpired(coupon)"
            class="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-lg"
          >
            Expired
          </div>
          
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-bold text-primary-600">{{ coupon.code }}</h3>
              <button
                @click="copyCouponCode(coupon.code)"
                class="text-gray-500 hover:text-primary-600 transition-colors"
                title="Copy coupon code"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <p v-if="coupon.description" class="text-gray-600 text-sm mb-3">{{ coupon.description }}</p>
          </div>
          
          <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Discount:</span>
              <span class="font-bold text-lg text-green-600">
                {{ formatDiscount(coupon) }}
              </span>
            </div>
            <div v-if="coupon.minPurchase" class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Min. Purchase:</span>
              <span class="font-medium">{{ formatPrice(coupon.minPurchase) }}</span>
            </div>
            <div v-if="coupon.maxDiscount" class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Max. Discount:</span>
              <span class="font-medium">{{ formatPrice(coupon.maxDiscount) }}</span>
            </div>
          </div>
          
          <div class="pt-4 border-t space-y-1 text-xs text-gray-500">
            <div class="flex justify-between">
              <span>Valid From:</span>
              <span>{{ formatDate(coupon.validFrom) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Valid Until:</span>
              <span>{{ formatDate(coupon.validTo || coupon.validUntil) }}</span>
            </div>
            <div v-if="coupon.usageLimit" class="flex justify-between">
              <span>Usage Limit:</span>
              <span>{{ coupon.usageCount }} / {{ coupon.usageLimit }}</span>
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
import { ref, computed, onMounted } from 'vue'
import { couponsApi } from '@/api/endpoints/coupons'
import { useUIStore } from '@/stores/ui'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { Coupon } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const uiStore = useUIStore()
const sidebarOpen = ref(false)
const isLoading = ref(false)
const coupons = ref<Coupon[]>([])
const filter = ref<'all' | 'active' | 'expired'>('all')

const filteredCoupons = computed(() => {
  if (filter.value === 'all') {
    return coupons.value
  } else if (filter.value === 'active') {
    return coupons.value.filter(c => !isExpired(c) && c.isActive)
  } else {
    return coupons.value.filter(c => isExpired(c))
  }
})

const isExpired = (coupon: Coupon): boolean => {
  const validUntil = coupon.validTo || coupon.validUntil
  if (!validUntil) return false
  return new Date(validUntil) < new Date()
}

const formatDiscount = (coupon: Coupon) => {
  if (coupon.type === 'percentage') {
    return `${coupon.value}% off`
  } else {
    return `${formatPrice(coupon.value)} off`
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const copyCouponCode = (code: string) => {
  navigator.clipboard.writeText(code).then(() => {
    uiStore.showNotification('success', `Coupon code "${code}" copied to clipboard!`)
  }).catch(() => {
    uiStore.showNotification('error', 'Failed to copy coupon code')
  })
}

const loadCoupons = async () => {
  isLoading.value = true
  try {
    const response = await couponsApi.getMyCoupons()
    if (response.success && response.data) {
      coupons.value = Array.isArray(response.data) ? response.data : []
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load coupons')
      coupons.value = []
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to load coupons')
    coupons.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCoupons()
})
</script>

