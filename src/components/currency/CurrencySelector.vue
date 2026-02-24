<template>
  <div class="currency-selector">
    <select
      v-model="selectedCode"
      @change="handleChange"
      class="input text-sm"
      :disabled="isLoading"
    >
      <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
        {{ currency.code }} - {{ currency.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCurrencyStore } from '@/stores/currency'

const currencyStore = useCurrencyStore()

const selectedCode = ref(currencyStore.selectedCurrency)
const isLoading = computed(() => currencyStore.isLoading)
const currencies = computed(() => currencyStore.currencies)

const handleChange = () => {
  currencyStore.setCurrency(selectedCode.value)
}

watch(() => currencyStore.selectedCurrency, (newValue) => {
  selectedCode.value = newValue
})

onMounted(async () => {
  if (currencies.value.length === 0) {
    await currencyStore.loadCurrencies()
  }
  selectedCode.value = currencyStore.selectedCurrency
})
</script>

<style scoped>
.currency-selector {
  @apply w-full;
}
</style>

