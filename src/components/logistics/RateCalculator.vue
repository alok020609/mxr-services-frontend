<template>
  <div class="space-y-6">
    <div class="card p-6">
      <h2 class="text-xl font-bold mb-4">Calculate Shipping Rates</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <!-- Pickup Address -->
        <div class="space-y-4">
          <h3 class="font-semibold">Pickup Address</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <Input
              v-model="rateRequest.pickup.pincode"
              type="text"
              placeholder="400001"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <Input
              v-model="rateRequest.pickup.city"
              type="text"
              placeholder="Mumbai"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
            <Input
              v-model="rateRequest.pickup.state"
              type="text"
              placeholder="Maharashtra"
            />
          </div>
        </div>

        <!-- Delivery Address -->
        <div class="space-y-4">
          <h3 class="font-semibold">Delivery Address</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <Input
              v-model="rateRequest.delivery.pincode"
              type="text"
              placeholder="110001"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <Input
              v-model="rateRequest.delivery.city"
              type="text"
              placeholder="New Delhi"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
            <Input
              v-model="rateRequest.delivery.state"
              type="text"
              placeholder="Delhi"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
          <Input
            v-model.number="rateRequest.weight"
            type="number"
            step="0.1"
            min="0"
            placeholder="1.5"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">COD Amount</label>
          <Input
            v-model.number="rateRequest.codAmount"
            type="number"
            min="0"
            placeholder="1000"
          />
        </div>
      </div>

      <div class="mb-4">
        <h3 class="font-semibold mb-2">Dimensions (cm)</h3>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Length</label>
            <Input
              v-model.number="rateRequest.dimensions.length"
              type="number"
              min="0"
              placeholder="20"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <Input
              v-model.number="rateRequest.dimensions.width"
              type="number"
              min="0"
              placeholder="15"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <Input
              v-model.number="rateRequest.dimensions.height"
              type="number"
              min="0"
              placeholder="10"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-4 mb-4">
        <label class="flex items-center">
          <input
            v-model="compareAll"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span class="ml-2 text-sm text-gray-700">Compare rates from all providers</span>
        </label>
      </div>

      <Button
        @click="calculateRates"
        variant="primary"
        :loading="isLoading"
      >
        Calculate Rates
      </Button>
    </div>

    <!-- Rates Results -->
    <div v-if="ratesData" class="card p-6">
      <h3 class="text-lg font-bold mb-4">Available Rates</h3>
      
      <!-- Single Provider Results -->
      <div v-if="Array.isArray(ratesData)" class="space-y-4">
        <div
          v-for="(rate, index) in ratesData"
          :key="index"
          class="border rounded-lg p-4 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">{{ rate.courierName }}</p>
              <p class="text-sm text-gray-600">{{ rate.provider }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-primary-600">₹{{ rate.rate.toFixed(2) }}</p>
              <p class="text-sm text-gray-600">{{ rate.estimatedDays }} days</p>
              <p v-if="rate.codAvailable" class="text-xs text-green-600 mt-1">COD Available</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison Results -->
      <div v-else-if="ratesData.comparisons" class="space-y-6">
        <div
          v-for="comparison in ratesData.comparisons"
          :key="comparison.provider"
          class="border rounded-lg p-4"
        >
          <h4 class="font-semibold mb-3">{{ comparison.providerName }}</h4>
          <div class="space-y-2">
            <div
              v-for="(rate, index) in comparison.rates"
              :key="index"
              class="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span class="text-sm">{{ rate.courierName }}</span>
              <div class="text-right">
                <span class="font-semibold">₹{{ rate.rate.toFixed(2) }}</span>
                <span class="text-xs text-gray-600 ml-2">{{ rate.estimatedDays }} days</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="ratesData.errors && ratesData.errors.length > 0" class="mt-4 p-3 bg-yellow-50 rounded">
          <p class="text-sm font-semibold text-yellow-800">Errors:</p>
          <ul class="text-sm text-yellow-700 mt-1 list-disc list-inside">
            <li v-for="(err, index) in ratesData.errors" :key="index">{{ err }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="error" class="card p-6 bg-red-50">
      <p class="text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { logisticsApi } from '@/api/endpoints/logistics'
import { useUIStore } from '@/stores/ui'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import type { ShippingRate, RateComparisonResponse } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref('')
const ratesData = ref<ShippingRate[] | RateComparisonResponse | null>(null)
const compareAll = ref(false)

const rateRequest = ref({
  pickup: {
    pincode: '',
    city: '',
    state: ''
  },
  delivery: {
    pincode: '',
    city: '',
    state: ''
  },
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0
  },
  codAmount: 0
})

const calculateRates = async () => {
  if (!rateRequest.value.pickup.pincode || !rateRequest.value.delivery.pincode || !rateRequest.value.weight) {
    uiStore.showNotification('error', 'Please fill in all required fields')
    return
  }

  isLoading.value = true
  error.value = ''
  ratesData.value = null

  try {
    const request = {
      pickup: {
        pincode: rateRequest.value.pickup.pincode,
        city: rateRequest.value.pickup.city || undefined,
        state: rateRequest.value.pickup.state || undefined
      },
      delivery: {
        pincode: rateRequest.value.delivery.pincode,
        city: rateRequest.value.delivery.city || undefined,
        state: rateRequest.value.delivery.state || undefined
      },
      weight: rateRequest.value.weight,
      dimensions: rateRequest.value.dimensions.length > 0 ? rateRequest.value.dimensions : undefined,
      codAmount: rateRequest.value.codAmount > 0 ? rateRequest.value.codAmount : undefined
    }

    const response = await logisticsApi.calculateRates(request, compareAll.value)
    if (response.success && response.data) {
      ratesData.value = response.data
    } else {
      error.value = response.error || 'Failed to calculate rates'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to calculate rates'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}
</script>
