<template>
  <div class="add-funds card">
    <h3 class="text-lg font-bold mb-4">Add Funds</h3>
    <form @submit.prevent="addFunds" class="space-y-4">
      <Input
        v-model.number="amount"
        type="number"
        label="Amount"
        placeholder="Enter amount"
        min="1"
        step="0.01"
        required
      />
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
        <select v-model="paymentMethod" class="input w-full" required>
          <option value="">Select payment method</option>
          <option value="card">Credit/Debit Card</option>
          <option value="bank">Bank Transfer</option>
        </select>
      </div>
      <Button type="submit" variant="primary" class="w-full" :loading="isAdding">
        Add Funds
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { walletApi } from '@/api/endpoints/wallet'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const amount = ref<number | null>(null)
const paymentMethod = ref('')
const isAdding = ref(false)

const addFunds = async () => {
  if (!amount.value || !paymentMethod.value) return
  
  isAdding.value = true
  try {
    const response = await walletApi.addFunds(amount.value, paymentMethod.value)
    if (response.success) {
      uiStore.showNotification('success', 'Funds added successfully')
      amount.value = null
      paymentMethod.value = ''
    } else {
      uiStore.showNotification('error', response.error || 'Failed to add funds')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to add funds')
  } finally {
    isAdding.value = false
  }
}
</script>

