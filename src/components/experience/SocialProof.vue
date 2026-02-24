<template>
  <div class="social-proof">
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner size="sm" />
    </div>
    
    <div v-else-if="proof" class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
      <!-- Recent Purchases -->
      <div v-if="proof.recentPurchases && proof.recentPurchases.length > 0" class="flex items-center gap-2">
        <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          {{ proof.recentPurchases.length }} recent purchase{{ proof.recentPurchases.length > 1 ? 's' : '' }}
        </span>
      </div>
      
      <!-- Views Count -->
      <div v-if="proof.viewsCount" class="flex items-center gap-2">
        <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{{ formatNumber(proof.viewsCount) }} viewed</span>
      </div>
      
      <!-- Purchases Count -->
      <div v-if="proof.purchasesCount" class="flex items-center gap-2">
        <svg class="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span>{{ formatNumber(proof.purchasesCount) }} bought</span>
      </div>
      
      <!-- Reviews Count -->
      <div v-if="proof.reviewsCount" class="flex items-center gap-2">
        <svg class="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span>{{ formatNumber(proof.reviewsCount) }} reviews</span>
        <span v-if="proof.averageRating" class="font-semibold">
          ({{ proof.averageRating.toFixed(1) }}⭐)
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { experienceApi } from '@/api/endpoints/experience'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { SocialProof } from '@/api/types'

interface Props {
  productId: string
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const isLoading = ref(false)
const proof = ref<SocialProof | null>(null)

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const loadSocialProof = async () => {
  isLoading.value = true
  try {
    const response = await experienceApi.getSocialProof(props.productId)
    if (response.success && response.data) {
      proof.value = response.data
    }
  } catch (error: any) {
    // Silently fail for social proof - it's not critical
    console.error('Failed to load social proof:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSocialProof()
})
</script>

