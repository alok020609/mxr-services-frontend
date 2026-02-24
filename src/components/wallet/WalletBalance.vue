<template>
  <div class="wallet-balance card">
    <h3 class="text-lg font-bold mb-4">Wallet Balance</h3>
    <div class="text-center">
      <div class="text-4xl font-bold text-primary-600 mb-2">
        {{ formatPrice(balance?.balance) }}
      </div>
      <p class="text-gray-600">{{ balance?.currency || selectedCurrency }}</p>
      <p v-if="balance?.availableBalance !== balance?.balance" class="text-sm text-gray-500 mt-2">
        Available: {{ formatPrice(balance?.availableBalance) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { walletApi, type WalletBalance } from '@/api/endpoints/wallet'
import { useCurrencyStore } from '@/stores/currency'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const currencyStore = useCurrencyStore()
const selectedCurrency = computed(() => currencyStore.selectedCurrency)
const balance = ref<WalletBalance | null>(null)

const loadBalance = async () => {
  try {
    const response = await walletApi.getWalletBalance()
    if (response.success && response.data) {
      balance.value = response.data
    }
  } catch (error) {
    console.error('Failed to load wallet balance:', error)
  }
}

onMounted(() => {
  loadBalance()
})
</script>

