<template>
  <div class="points-balance card">
    <h3 class="text-lg font-bold mb-4">Your Points</h3>
    <div class="text-center">
      <div class="text-4xl font-bold text-primary-600 mb-2">
        {{ points?.points || 0 }}
      </div>
      <p class="text-gray-600">Loyalty Points</p>
      <p v-if="points?.tierName" class="text-sm text-gray-500 mt-2">
        Current Tier: <span class="font-semibold">{{ points.tierName }}</span>
      </p>
      <p v-if="points?.pointsToNextTier" class="text-sm text-gray-500">
        {{ points.pointsToNextTier }} points to next tier
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loyaltyApi } from '@/api/endpoints/loyalty'
import type { LoyaltyPoints } from '@/api/types'

const points = ref<LoyaltyPoints | null>(null)

const loadPoints = async () => {
  try {
    const response = await loyaltyApi.getPoints()
    if (response.success && response.data) {
      points.value = response.data
    }
  } catch (error) {
    console.error('Failed to load points:', error)
  }
}

onMounted(() => {
  loadPoints()
})
</script>

