<template>
  <div class="tax-calculator-taxjar">
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">TaxJar Tax Calculation</h3>
      <form @submit.prevent="handleCalculate" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            v-model.number="form.amount"
            type="number"
            label="Amount"
            required
            step="0.01"
            min="0"
          />
          <Input
            v-model="form.toAddress.country"
            label="To Country"
            required
            placeholder="US"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            v-model="form.toAddress.state"
            label="To State/Province"
            placeholder="CA"
          />
          <Input
            v-model="form.toAddress.city"
            label="To City"
            placeholder="San Francisco"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            v-model="form.toAddress.zip"
            label="To ZIP/Postal Code"
            placeholder="94102"
          />
          <Input
            v-model.number="form.shipping"
            type="number"
            label="Shipping Amount (Optional)"
            step="0.01"
            min="0"
          />
        </div>
        <Button type="submit" variant="primary" :loading="isCalculating" class="w-full sm:w-auto">
          Calculate Tax
        </Button>
      </form>
      
      <div v-if="result" class="mt-6 pt-6 border-t">
        <h4 class="font-semibold mb-4">Tax Calculation Result</h4>
        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Subtotal:</span>
            <span class="font-semibold">{{ formatPrice(result.amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Tax Amount:</span>
            <span class="font-semibold text-primary-600">{{ formatPrice(result.taxAmount) }}</span>
          </div>
          <div v-if="result.rate" class="flex justify-between">
            <span class="text-gray-600">Tax Rate:</span>
            <span class="font-semibold">{{ (result.rate * 100).toFixed(2) }}%</span>
          </div>
          <div class="flex justify-between pt-2 border-t font-bold text-lg">
            <span>Total:</span>
            <span>{{ formatPrice(result.total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { complianceApi } from '@/api/endpoints/compliance'
import type { TaxCalculationRequest, TaxCalculationResponse } from '@/api/types'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const uiStore = useUIStore()
const form = ref<TaxCalculationRequest>({
  amount: 0,
  toAddress: {
    country: '',
    state: '',
    city: '',
    zip: ''
  },
  shipping: 0
})
const result = ref<TaxCalculationResponse | null>(null)
const isCalculating = ref(false)

const handleCalculate = async () => {
  if (!form.value.amount || !form.value.toAddress.country) {
    uiStore.showNotification('warning', 'Please fill in required fields')
    return
  }
  
  isCalculating.value = true
  result.value = null
  try {
    const response = await complianceApi.calculateTaxTaxJar(form.value)
    if (response.success && response.data) {
      result.value = response.data
    } else {
      uiStore.showNotification('error', response.error || 'Failed to calculate tax')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to calculate tax')
  } finally {
    isCalculating.value = false
  }
}
</script>

