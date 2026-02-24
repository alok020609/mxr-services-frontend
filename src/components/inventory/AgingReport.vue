<template>
  <div class="aging-report">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Inventory Aging Report</h2>
        <p class="text-sm text-gray-600 mt-1">Analyze inventory age and identify slow-moving stock</p>
      </div>
      <Button variant="secondary" size="sm" @click="loadReport" :loading="isLoading">
        Refresh
      </Button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Category (Optional)</label>
          <input
            v-model="filters.categoryId"
            type="text"
            class="input"
            placeholder="Enter category ID"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Min Age (days)</label>
          <input
            v-model.number="filters.minAge"
            type="number"
            class="input"
            placeholder="Minimum age"
            min="0"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Max Age (days)</label>
          <input
            v-model.number="filters.maxAge"
            type="number"
            class="input"
            placeholder="Maximum age"
            min="0"
          />
        </div>
      </div>
      <div class="mt-4">
        <Button variant="primary" @click="loadReport" :loading="isLoading">
          Apply Filters
        </Button>
        <Button variant="secondary" @click="resetFilters" class="ml-2">
          Clear Filters
        </Button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load aging report</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadReport">Retry</Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !reportData" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading aging report...</span>
    </div>

    <!-- Report Content -->
    <div v-else-if="reportData" class="space-y-6">
      <!-- Summary Statistics -->
      <div v-if="reportData.summary" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Summary</h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="border rounded-lg p-4 text-center">
            <div class="text-sm text-gray-600 mb-1">Total Value</div>
            <div class="text-2xl font-bold text-primary-600">
              {{ formatCurrency(reportData.summary.totalValue || 0) }}
            </div>
          </div>
          <div v-if="reportData.summary.itemsByAgeRange" class="border rounded-lg p-4 text-center">
            <div class="text-sm text-gray-600 mb-1">0-30 Days</div>
            <div class="text-2xl font-bold text-green-600">
              {{ reportData.summary.itemsByAgeRange['0-30'] || 0 }}
            </div>
          </div>
          <div v-if="reportData.summary.itemsByAgeRange" class="border rounded-lg p-4 text-center">
            <div class="text-sm text-gray-600 mb-1">31-60 Days</div>
            <div class="text-2xl font-bold text-yellow-600">
              {{ reportData.summary.itemsByAgeRange['31-60'] || 0 }}
            </div>
          </div>
          <div v-if="reportData.summary.itemsByAgeRange" class="border rounded-lg p-4 text-center">
            <div class="text-sm text-gray-600 mb-1">61-90 Days</div>
            <div class="text-2xl font-bold text-orange-600">
              {{ reportData.summary.itemsByAgeRange['61-90'] || 0 }}
            </div>
          </div>
          <div v-if="reportData.summary.itemsByAgeRange" class="border rounded-lg p-4 text-center">
            <div class="text-sm text-gray-600 mb-1">90+ Days</div>
            <div class="text-2xl font-bold text-red-600">
              {{ reportData.summary.itemsByAgeRange['90+'] || 0 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Aging Report Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold">Aging Report Details</h3>
          <Button variant="secondary" size="sm" @click="exportReport">
            Export Report
          </Button>
        </div>
        <DataTable
          v-if="reportData.items && reportData.items.length > 0"
          :columns="columns"
          :data="reportData.items"
          row-key="productId"
        >
          <template #cell-productName="{ value }">
            <span class="font-medium">{{ value }}</span>
          </template>
          <template #cell-currentStock="{ value }">
            <span class="font-semibold">{{ formatNumber(value) }}</span>
          </template>
          <template #cell-ageInDays="{ value }">
            <span :class="getAgeClass(value)" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ value }} days
            </span>
          </template>
          <template #cell-lastSoldDate="{ value }">
            <span class="text-sm text-gray-600">{{ value ? formatDate(value) : 'Never' }}</span>
          </template>
          <template #cell-value="{ value }">
            <span class="font-semibold">{{ formatCurrency(value) }}</span>
          </template>
        </DataTable>
        <div v-else class="text-center py-12 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p class="text-lg font-medium">No items found in aging report</p>
          <p class="text-sm mt-1">Try adjusting your filters</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="text-lg font-medium">No aging report data available</p>
      <p class="text-sm mt-1">Aging report data will appear here</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { inventoryAdvancedApi } from '@/api/endpoints/inventory-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters'
import type { AgingReport } from '@/api/types'
import DataTable from '@/components/admin/DataTable.vue'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const reportData = ref<AgingReport | null>(null)

const filters = ref({
  categoryId: '',
  minAge: undefined as number | undefined,
  maxAge: undefined as number | undefined
})

const columns = [
  { key: 'productName', label: 'Product Name', sortable: true },
  { key: 'currentStock', label: 'Stock', sortable: true },
  { key: 'ageInDays', label: 'Age (days)', sortable: true },
  { key: 'lastSoldDate', label: 'Last Sold', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'value', label: 'Value', sortable: true }
]

const loadReport = async () => {
  isLoading.value = true
  error.value = null

  try {
    const requestFilters: any = {}
    if (filters.value.categoryId) requestFilters.categoryId = filters.value.categoryId
    if (filters.value.minAge !== undefined) requestFilters.minAge = filters.value.minAge
    if (filters.value.maxAge !== undefined) requestFilters.maxAge = filters.value.maxAge

    const response = await inventoryAdvancedApi.getAgingReport(Object.keys(requestFilters).length > 0 ? requestFilters : undefined)
    sendToTerminal('log', '[AgingReport] API Response:', response)

    if (response.success && response.data) {
      reportData.value = {
        items: Array.isArray(response.data.items) ? response.data.items : [],
        summary: response.data.summary || null
      }
      error.value = null
    } else {
      const errorMessage = response.error || 'Failed to load aging report'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
      reportData.value = null
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to load aging report'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[AgingReport] Error loading report:', err)
    reportData.value = null
  } finally {
    isLoading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    categoryId: '',
    minAge: undefined,
    maxAge: undefined
  }
  loadReport()
}

const getAgeClass = (age: number) => {
  if (age <= 30) return 'bg-green-100 text-green-800'
  if (age <= 60) return 'bg-yellow-100 text-yellow-800'
  if (age <= 90) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

const exportReport = () => {
  if (!reportData.value) return

  const data = {
    report: reportData.value,
    filters: filters.value,
    generatedAt: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `aging-report-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)

  uiStore.showNotification('success', 'Aging report exported successfully')
}

onMounted(() => {
  loadReport()
})
</script>

<style scoped>
.aging-report {
  @apply space-y-6;
}
</style>

