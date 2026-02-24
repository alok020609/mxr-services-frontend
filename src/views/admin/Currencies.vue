<template>
  <div>
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">Currency Management</h1>
        <div class="flex gap-2">
          <Button variant="primary" @click="openCreateModal">
            Add Currency
          </Button>
          <Button variant="secondary" @click="showUpdateRatesModal = true">
            Update Exchange Rates
          </Button>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <Button @click="loadCurrencies" variant="primary">Retry</Button>
      </div>

      <div v-else class="space-y-6">
        <!-- Currencies List -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Currencies</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange Rate</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="currency in currencies" :key="currency.code">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="font-semibold">{{ currency.code }}</span>
                    <span v-if="currency.isDefault" class="ml-2 text-xs text-primary-600">(Default)</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ currency.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ currency.symbol }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="exchangeRateFor(currency) != null">{{ (exchangeRateFor(currency) as number).toFixed(4) }}</span>
                    <span v-else class="text-gray-400">N/A</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="currency.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                      class="px-2 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ currency.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="outline" size="sm" @click="openEditModal(currency)">Edit</Button>
                    <Button
                      variant="outline"
                      size="sm"
                      class="text-red-600 hover:text-red-700 border-red-300"
                      :disabled="currency.isDefault"
                      :title="currency.isDefault ? 'Set another currency as default first' : 'Deactivate'"
                      @click="deactivateCurrency(currency)"
                    >
                      Deactivate
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Currency Converter Tool -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrencyConverter />
        </div>
      </div>

      <!-- Update Exchange Rates Modal -->
      <div
        v-if="showUpdateRatesModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showUpdateRatesModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">Update Exchange Rates</h2>
          <p class="text-gray-600 mb-6">
            Enter exchange rates for each currency (relative to base currency USD).
          </p>

          <div class="space-y-4">
            <div
              v-for="currency in currencies"
              :key="currency.code"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-semibold">{{ currency.code }} - {{ currency.name }}</p>
                <p class="text-sm text-gray-600">1 USD = ? {{ currency.code }}</p>
              </div>
              <Input
                v-model.number="rateUpdates[currency.code]"
                type="number"
                step="0.0001"
                min="0"
                class="w-32"
                :placeholder="(exchangeRateFor(currency)?.toFixed(4)) || '0.0000'"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-4 mt-6">
            <Button variant="secondary" @click="showUpdateRatesModal = false">
              Cancel
            </Button>
            <Button
              variant="primary"
              @click="updateRates"
              :loading="isUpdating"
            >
              Update Rates
            </Button>
          </div>
        </div>
      </div>

      <!-- Create / Edit Currency Modal -->
      <div
        v-if="showFormModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showFormModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">{{ formMode === 'create' ? 'Add Currency' : 'Edit Currency' }}</h2>
          <form @submit.prevent="submitForm" class="space-y-4">
            <Input
              v-model="form.code"
              label="Code (3 letters, e.g. USD)"
              placeholder="USD"
              maxlength="3"
              :disabled="formMode === 'edit'"
              required
            />
            <Input v-model="form.name" label="Name" placeholder="US Dollar" required />
            <Input v-model="form.symbol" label="Symbol" placeholder="$" required />
            <Input
              v-model.number="form.exchangeRate"
              type="number"
              step="0.0001"
              min="0"
              label="Exchange Rate"
              placeholder="1"
            />
            <div class="flex items-center gap-2">
              <input
                id="form-isDefault"
                v-model="form.isDefault"
                type="checkbox"
                class="rounded border-gray-300"
              />
              <label for="form-isDefault">Default currency</label>
            </div>
            <div class="flex items-center gap-2">
              <input
                id="form-isActive"
                v-model="form.isActive"
                type="checkbox"
                class="rounded border-gray-300"
              />
              <label for="form-isActive">Active</label>
            </div>
            <div class="flex justify-end gap-2 mt-6">
              <Button type="button" variant="secondary" @click="showFormModal = false">
                Cancel
              </Button>
              <Button type="submit" variant="primary" :loading="isSaving">
                {{ formMode === 'create' ? 'Create' : 'Save' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currenciesApi } from '@/api/endpoints/currencies'
import { adminCurrenciesApi } from '@/api/endpoints/admin-currencies'
import { useUIStore } from '@/stores/ui'
import { useCurrencyStore } from '@/stores/currency'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Input from '@/components/common/Input.vue'
import CurrencyConverter from '@/components/currency/CurrencyConverter.vue'
import type { Currency } from '@/api/types'

const uiStore = useUIStore()
const currencyStore = useCurrencyStore()
const isLoading = ref(false)
const isUpdating = ref(false)
const isSaving = ref(false)
const error = ref('')
const currencies = ref<Currency[]>([])
const showUpdateRatesModal = ref(false)
const showFormModal = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const rateUpdates = ref<Record<string, number>>({})
const form = ref({
  code: '',
  name: '',
  symbol: '',
  exchangeRate: 1,
  isDefault: false,
  isActive: true
})

function exchangeRateFor(currency: Currency): number | undefined {
  return currency.exchangeRate ?? currency.rate
}

const loadCurrencies = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await adminCurrenciesApi.list()
    if (response.success && response.data) {
      currencies.value = Array.isArray(response.data) ? response.data : []
      currencies.value.forEach(currency => {
        const rate = exchangeRateFor(currency)
        if (rate != null) {
          rateUpdates.value[currency.code] = rate
        }
      })
      await currencyStore.loadCurrencies()
    } else {
      error.value = (response as { error?: string }).error || 'Failed to load currencies'
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load currencies'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const updateRates = async () => {
  isUpdating.value = true
  try {
    const response = await currenciesApi.updateRates(rateUpdates.value)
    if (response.success) {
      uiStore.showNotification('success', 'Exchange rates updated successfully')
      showUpdateRatesModal.value = false
      await loadCurrencies()
    } else {
      uiStore.showNotification('error', (response as { error?: string }).error || 'Failed to update exchange rates')
    }
  } catch (err: unknown) {
    uiStore.showNotification('error', err instanceof Error ? err.message : 'Failed to update exchange rates')
  } finally {
    isUpdating.value = false
  }
}

function openCreateModal() {
  formMode.value = 'create'
  form.value = { code: '', name: '', symbol: '', exchangeRate: 1, isDefault: false, isActive: true }
  showFormModal.value = true
}

function openEditModal(currency: Currency) {
  formMode.value = 'edit'
  form.value = {
    code: currency.code,
    name: currency.name,
    symbol: currency.symbol,
    exchangeRate: exchangeRateFor(currency) ?? 1,
    isDefault: currency.isDefault ?? false,
    isActive: currency.isActive ?? true
  }
  showFormModal.value = true
}

const submitForm = async () => {
  isSaving.value = true
  try {
    const code = form.value.code.trim().toUpperCase()
    const name = form.value.name.trim()
    const symbol = form.value.symbol.trim()
    if (!code || code.length !== 3) {
      uiStore.showNotification('error', 'Code must be exactly 3 letters (e.g. USD)')
      isSaving.value = false
      return
    }
    if (formMode.value === 'create') {
      const res = await adminCurrenciesApi.create({
        code,
        name,
        symbol,
        exchangeRate: form.value.exchangeRate,
        isDefault: form.value.isDefault,
        isActive: form.value.isActive
      })
      if (res.success) {
        uiStore.showNotification('success', 'Currency created')
        showFormModal.value = false
        await loadCurrencies()
      } else {
        uiStore.showNotification('error', (res as { error?: string }).error || 'Failed to create currency')
      }
    } else {
      const res = await adminCurrenciesApi.update(form.value.code, {
        name,
        symbol,
        exchangeRate: form.value.exchangeRate,
        isDefault: form.value.isDefault,
        isActive: form.value.isActive
      })
      if (res.success) {
        uiStore.showNotification('success', 'Currency updated')
        showFormModal.value = false
        await loadCurrencies()
      } else {
        uiStore.showNotification('error', (res as { error?: string }).error || 'Failed to update currency')
      }
    }
  } catch (err: unknown) {
    uiStore.showNotification('error', err instanceof Error ? err.message : 'Failed to save currency')
  } finally {
    isSaving.value = false
  }
}

async function deactivateCurrency(currency: Currency) {
  if (currency.isDefault) {
    uiStore.showNotification('error', 'Cannot deactivate the default currency. Set another as default first.')
    return
  }
  if (!confirm(`Deactivate ${currency.code}?`)) return
  try {
    const res = await adminCurrenciesApi.deactivate(currency.code)
    if (res.success) {
      uiStore.showNotification('success', res.data?.message || 'Currency deactivated')
      await loadCurrencies()
    } else {
      uiStore.showNotification('error', (res as { error?: string }).error || 'Failed to deactivate')
    }
  } catch (err: unknown) {
    uiStore.showNotification('error', err instanceof Error ? err.message : 'Failed to deactivate currency')
  }
}

onMounted(() => {
  loadCurrencies()
})
</script>

