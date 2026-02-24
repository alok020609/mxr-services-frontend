<template>
  <div class="rewards-catalog">
    <h3 class="text-lg font-bold mb-4">Available Rewards</h3>
    
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="rewards.length === 0" class="text-center py-8 text-gray-500">
      <p>No rewards available</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="reward in rewards"
        :key="reward.id"
        class="card"
      >
        <img
          v-if="reward.image"
          :src="reward.image"
          :alt="reward.name"
          class="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h4 class="font-semibold mb-1">{{ reward.name }}</h4>
        <p class="text-sm text-gray-600 mb-3">{{ reward.description }}</p>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-bold text-primary-600">{{ reward.pointsRequired }}</div>
            <div class="text-xs text-gray-500">points</div>
          </div>
          <Button
            variant="primary"
            size="sm"
            @click="redeemReward(reward.id)"
            :disabled="!reward.available || isRedeeming"
            :loading="isRedeeming"
          >
            Redeem
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loyaltyApi } from '@/api/endpoints/loyalty'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import type { LoyaltyReward } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const isRedeeming = ref(false)
const rewards = ref<LoyaltyReward[]>([])

const loadRewards = async () => {
  isLoading.value = true
  try {
    const response = await loyaltyApi.getRewards()
    if (response.success && response.data) {
      rewards.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load rewards')
  } finally {
    isLoading.value = false
  }
}

const redeemReward = async (rewardId: string) => {
  isRedeeming.value = true
  try {
    const response = await loyaltyApi.redeemReward(rewardId)
    if (response.success) {
      uiStore.showNotification('success', 'Reward redeemed successfully!')
      await loadRewards()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to redeem reward')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to redeem reward')
  } finally {
    isRedeeming.value = false
  }
}

onMounted(() => {
  loadRewards()
})
</script>

