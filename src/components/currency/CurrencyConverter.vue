<template>
  <div class="currency-converter">
    <div class="card">
      <h3 class="text-lg font-bold mb-4">Currency Converter</h3>
      
      <div class="space-y-4">
        <!-- Amount Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <Input
            v-model.number="amount"
            type="number"
            placeholder="Enter amount"
            step="0.01"
            min="0"
          />
        </div>
        
        <!-- From Currency -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
          <select v-model="fromCurrency" class="input">
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>
        
        <!-- To Currency -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
          <select v-model="toCurrency" class="input">
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>
        
        <!-- Convert Button -->
        <Button
          variant="primary"
          class="w-full"
          @click="convert"
          :loading="isConverting"
          :disabled="!amount || amount <= 0 || fromCurrency === toCurrency"
        >
          Convert
        </Button>
        
        <!-- Result -->
        <div v-if="result" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">Converted Amount:</span>
            <span class="text-2xl font-bold text-green-600">
              {{ formatAmount(result.convertedAmount, toCurrency) }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-600">
            <span>Exchange Rate:</span>
            <span class="font-medium">1 {{ fromCurrency }} = {{ result.rate.toFixed(4) }} {{ toCurrency }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { currenciesApi } from '@/api/endpoints/currencies'
import { useCurrencyStore } from '@/stores/currency'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import type { CurrencyConversion } from '@/api/types'

const currencyStore = useCurrencyStore()
const uiStore = useUIStore()

const amount = ref<number>(0)
const fromCurrency = ref('USD')
const toCurrency = ref('EUR')
const isConverting = ref(false)
const result = ref<CurrencyConversion | null>(null)

const currencies = computed(() => currencyStore.currencies)

const formatAmount = (amount: number, code: string) => {
  return currencyStore.formatAmount(amount, code)
}

const convert = async () => {
  if (!amount.value || amount.value <= 0 || fromCurrency.value === toCurrency.value) {
    return
  }
  
  isConverting.value = true
  result.value = null
  
  try {
    const response = await currenciesApi.convert(amount.value, fromCurrency.value, toCurrency.value)
    if (response.success && response.data) {
      result.value = response.data
    } else {
      uiStore.showNotification('error', response.error || 'Failed to convert currency')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to convert currency')
  } finally {
    isConverting.value = false
  }
}

onMounted(async () => {
  if (currencies.value.length === 0) {
    await currencyStore.loadCurrencies()
  }
  fromCurrency.value = currencyStore.selectedCurrency
})
</script>

