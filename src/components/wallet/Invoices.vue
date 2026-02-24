<template>
  <div class="invoices card">
    <h3 class="text-lg font-bold mb-4">Invoices</h3>
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner />
    </div>
    <div v-else-if="invoices.length === 0" class="text-center py-8 text-gray-500">
      <p>No invoices</p>
    </div>
    <div v-else class="space-y-3">
      <div
        v-for="invoice in invoices"
        :key="invoice.id"
        class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
      >
        <div>
          <p class="font-semibold">{{ invoice.invoiceNumber }}</p>
          <p class="text-sm text-gray-600">{{ formatPrice(invoice.amount) }}</p>
          <p class="text-xs text-gray-500">{{ formatDate(invoice.issueDate) }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span :class="[
            'px-2 py-1 rounded text-xs',
            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
            invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          ]">
            {{ invoice.status }}
          </span>
          <Button variant="secondary" size="sm" @click="downloadInvoice(invoice.id)">
            Download
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { walletApi, type Invoice } from '@/api/endpoints/wallet'
import { useUIStore } from '@/stores/ui'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'

const { formatPrice } = usePriceFormatter()
const uiStore = useUIStore()
const isLoading = ref(false)
const invoices = ref<Invoice[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadInvoices = async () => {
  isLoading.value = true
  try {
    const response = await walletApi.getInvoices()
    if (response.success && response.data) {
      invoices.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    console.error('Failed to load invoices:', error)
  } finally {
    isLoading.value = false
  }
}

const downloadInvoice = async (id: string) => {
  try {
    const blob = await walletApi.downloadInvoice(id)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${id}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
    uiStore.showNotification('success', 'Invoice downloaded')
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to download invoice')
  }
}

onMounted(() => {
  loadInvoices()
})
</script>

