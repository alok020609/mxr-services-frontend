<template>
  <div class="gift-cards">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Gift Cards</h2>
      <p class="text-sm text-gray-600">View, purchase, and redeem gift cards</p>
    </div>

    <!-- Tabs for Purchase and Redeem -->
    <div class="mb-6 border-b">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 font-medium border-b-2 transition-colors',
          activeTab === tab.id
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Purchase Tab -->
    <div v-if="activeTab === 'purchase'">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Purchase Gift Card</h3>
        
        <form @submit.prevent="purchaseGiftCard" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Amount <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="purchaseForm.amount"
              type="number"
              class="input"
              placeholder="Enter amount"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="purchaseForm.recipientEmail"
              type="email"
              class="input"
              placeholder="recipient@example.com"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              v-model="purchaseForm.message"
              class="input"
              rows="3"
              placeholder="Add a personal message..."
            ></textarea>
          </div>

          <div v-if="purchaseError" class="p-3 bg-red-50 border border-red-200 rounded">
            <p class="text-red-800 text-sm">{{ purchaseError }}</p>
          </div>

          <Button type="submit" variant="primary" :loading="isPurchasing" class="w-full">
            Purchase Gift Card
          </Button>
        </form>
      </div>
    </div>

    <!-- Redeem Tab -->
    <div v-if="activeTab === 'redeem'">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Redeem Gift Card</h3>
        
        <form @submit.prevent="redeemGiftCard" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Gift Card Code <span class="text-red-500">*</span>
            </label>
            <input
              v-model="redeemForm.code"
              type="text"
              class="input font-mono"
              placeholder="Enter gift card code"
              required
            />
          </div>

          <div v-if="redeemError" class="p-3 bg-red-50 border border-red-200 rounded">
            <p class="text-red-800 text-sm">{{ redeemError }}</p>
          </div>

          <div v-if="redeemResult" class="p-4 bg-green-50 border border-green-200 rounded">
            <p class="text-green-800 font-medium mb-2">Gift card redeemed successfully!</p>
            <p class="text-green-700 text-sm">
              Amount: {{ formatCurrency(redeemResult.amount) }}
              <span v-if="redeemResult.balance">
                | Remaining Balance: {{ formatCurrency(redeemResult.balance) }}
              </span>
            </p>
          </div>

          <Button type="submit" variant="primary" :loading="isRedeeming" class="w-full">
            Redeem Gift Card
          </Button>
        </form>
      </div>
    </div>

    <!-- Gift Cards List -->
    <div class="mt-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Available Gift Cards</h3>
        <Button variant="secondary" size="sm" @click="loadGiftCards">
          <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="md" />
        <span class="ml-2 text-gray-600">Loading gift cards...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-800 font-medium mb-1">Unable to load gift cards</p>
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>
          <Button variant="primary" size="sm" @click="loadGiftCards">Retry</Button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="giftCards.length === 0" class="text-center py-12 border rounded-lg bg-gray-50">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-500 mb-2">No gift cards found</p>
        <p class="text-sm text-gray-400">Purchase a gift card to get started</p>
      </div>

      <!-- Gift Cards Table -->
      <div v-else>
        <DataTable
          :columns="columns"
          :data="giftCards"
          :actions="true"
          row-key="id"
        >
          <template #cell-code="{ row }">
            <div class="flex items-center space-x-2">
              <span class="font-mono font-medium">{{ row.code }}</span>
              <button
                @click="copyCode(row.code)"
                class="text-primary-600 hover:text-primary-800 text-sm"
                title="Copy code"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </template>
          <template #cell-amount="{ value }">
            {{ formatCurrency(value) }}
          </template>
          <template #cell-balance="{ value }">
            {{ formatCurrency(value) }}
          </template>
          <template #cell-status="{ value }">
            <span :class="getStatusClass(value)" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ value }}
            </span>
          </template>
          <template #cell-expiryDate="{ value }">
            <span v-if="value">{{ formatDate(value) }}</span>
            <span v-else class="text-gray-400">No expiry</span>
          </template>
          <template #cell-redeemedAt="{ value }">
            <span v-if="value">{{ formatDate(value) }}</span>
            <span v-else class="text-gray-400">Not redeemed</span>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { advancedProductsApi } from '@/api/endpoints/advanced-products'
import { useUIStore } from '@/stores/ui'
import type { GiftCard, PurchaseGiftCardRequest, RedeemGiftCardRequest } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import DataTable from '@/components/admin/DataTable.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'

const uiStore = useUIStore()
const isLoading = ref(false)
const isPurchasing = ref(false)
const isRedeeming = ref(false)
const error = ref<string | null>(null)
const purchaseError = ref<string | null>(null)
const redeemError = ref<string | null>(null)
const redeemResult = ref<{ amount: number; balance?: number } | null>(null)
const giftCards = ref<GiftCard[]>([])
const activeTab = ref<'purchase' | 'redeem'>('purchase')

const purchaseForm = ref<PurchaseGiftCardRequest>({
  amount: 0,
  recipientEmail: '',
  message: ''
})

const redeemForm = ref<RedeemGiftCardRequest>({
  code: ''
})

const tabs = [
  { id: 'purchase', label: 'Purchase' },
  { id: 'redeem', label: 'Redeem' }
]

const columns = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'balance', label: 'Balance', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'expiryDate', label: 'Expires', sortable: true },
  { key: 'redeemedAt', label: 'Redeemed', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true }
]

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    redeemed: 'bg-blue-100 text-blue-800',
    expired: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const loadGiftCards = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await advancedProductsApi.getGiftCards()
    if (response.success && response.data) {
      giftCards.value = response.data
    } else {
      error.value = response.error || 'Failed to load gift cards'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to load gift cards'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const purchaseGiftCard = async () => {
  isPurchasing.value = true
  purchaseError.value = null
  try {
    const response = await advancedProductsApi.purchaseGiftCard(purchaseForm.value)
    if (response.success) {
      uiStore.showNotification('success', 'Gift card purchased successfully')
      purchaseForm.value = {
        amount: 0,
        recipientEmail: '',
        message: ''
      }
      await loadGiftCards()
    } else {
      purchaseError.value = response.error || 'Failed to purchase gift card'
    }
  } catch (err: any) {
    purchaseError.value = err.response?.data?.error || err.message || 'Failed to purchase gift card'
    uiStore.showNotification('error', purchaseError.value)
  } finally {
    isPurchasing.value = false
  }
}

const redeemGiftCard = async () => {
  isRedeeming.value = true
  redeemError.value = null
  redeemResult.value = null
  try {
    const response = await advancedProductsApi.redeemGiftCard(redeemForm.value)
    if (response.success && response.data) {
      redeemResult.value = response.data
      uiStore.showNotification('success', 'Gift card redeemed successfully')
      redeemForm.value.code = ''
      await loadGiftCards()
    } else {
      redeemError.value = response.error || 'Failed to redeem gift card'
    }
  } catch (err: any) {
    redeemError.value = err.response?.data?.error || err.message || 'Failed to redeem gift card'
    uiStore.showNotification('error', redeemError.value)
  } finally {
    isRedeeming.value = false
  }
}

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    uiStore.showNotification('success', 'Gift card code copied to clipboard')
  } catch (err) {
    uiStore.showNotification('error', 'Failed to copy code')
  }
}

onMounted(() => {
  loadGiftCards()
})
</script>

