<template>
  <div class="tier-display">
    <h3 class="text-lg font-bold mb-4">Loyalty Tiers</h3>
    <div class="space-y-3">
      <div
        v-for="tier in tiers"
        :key="tier.id"
        :class="[
          'card p-4',
          currentTier === tier.id ? 'border-2 border-primary-600 bg-primary-50' : ''
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-semibold">{{ tier.name }}</h4>
            <p class="text-sm text-gray-600">
              {{ tier.minPoints }} - {{ tier.maxPoints || '∞' }} points
            </p>
            <ul v-if="tier.benefits" class="mt-2 text-sm text-gray-600">
              <li v-for="(benefit, index) in tier.benefits" :key="index" class="flex items-center gap-1">
                <svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ benefit }}
              </li>
            </ul>
          </div>
          <div v-if="tier.discount" class="text-right">
            <div class="text-2xl font-bold text-primary-600">{{ tier.discount }}%</div>
            <div class="text-xs text-gray-500">Discount</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loyaltyApi } from '@/api/endpoints/loyalty'
import type { LoyaltyTier } from '@/api/types'

const props = defineProps<{
  currentTier?: string
}>()

const tiers = ref<LoyaltyTier[]>([])

const loadTiers = async () => {
  try {
    const response = await loyaltyApi.getTiers()
    if (response.success && response.data) {
      tiers.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    console.error('Failed to load tiers:', error)
  }
}

onMounted(() => {
  loadTiers()
})
</script>

