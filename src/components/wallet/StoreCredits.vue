<template>
  <div class="store-credits card">
    <h3 class="text-lg font-bold mb-4">Store Credits</h3>
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner />
    </div>
    <div v-else-if="credits.length === 0" class="text-center py-8 text-gray-500">
      <p>No store credits</p>
    </div>
    <div v-else class="space-y-3">
      <div
        v-for="credit in credits"
        :key="credit.id"
        class="p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold">{{ formatPrice(credit.balance) }}</p>
            <p class="text-sm text-gray-600">{{ credit.source }}</p>
          </div>
          <p v-if="credit.expiresAt" class="text-xs text-gray-500">
            Expires: {{ formatDate(credit.expiresAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { walletApi, type StoreCredit } from '@/api/endpoints/wallet'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const { formatPrice } = usePriceFormatter()
const isLoading = ref(false)
const credits = ref<StoreCredit[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadCredits = async () => {
  isLoading.value = true
  try {
    const response = await walletApi.getStoreCredits()
    if (response.success && response.data) {
      credits.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    console.error('Failed to load store credits:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCredits()
})
</script>

