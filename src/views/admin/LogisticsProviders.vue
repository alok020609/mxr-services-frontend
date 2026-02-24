<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Logistics Providers</h1>
      <Button variant="primary" @click="showCreateModal = true">
        Add Provider
      </Button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="loadProviders" variant="primary">Retry</Button>
    </div>

    <div v-else class="space-y-6">
      <!-- Filters -->
      <div class="card p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              v-model="filters.isActive"
              @change="loadProviders"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option :value="undefined">All</option>
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
            <select
              v-model="filters.type"
              @change="loadProviders"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Types</option>
              <option value="SHIPROCKET">Shiprocket</option>
              <option value="DELHIVERY">Delhivery</option>
              <option value="CLICKPOST">ClickPost</option>
              <option value="VAMASHIP">Vamaship</option>
              <option value="SHIPJEE">Shipjee</option>
              <option value="INDISPEED">IndiSpeed</option>
              <option value="ULIP">ULIP</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Providers Table -->
      <div v-if="providers.length === 0" class="text-center py-12 border rounded-lg">
        <p class="text-gray-500">No providers found</p>
      </div>

      <DataTable
        v-else
        :columns="columns"
        :data="providers"
        :actions="true"
        row-key="id"
      >
        <template #cell-type="{ row }">
          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {{ row.type }}
          </span>
        </template>

        <template #cell-isActive="{ row }">
          <ProviderStatus :provider="row" />
        </template>

        <template #cell-priority="{ value }">
          <span class="text-sm font-medium">{{ value }}</span>
        </template>

        <template #cell-supportedRegions="{ value }">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="region in (value || [])"
              :key="region"
              class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
            >
              {{ region }}
            </span>
          </div>
        </template>

        <template #cell-incomingWebhookUrl="{ row }">
          <span v-if="row.incomingWebhookUrl" class="flex items-center gap-2">
            <span class="text-sm text-gray-700 truncate max-w-[200px]" :title="row.incomingWebhookUrl">{{ row.incomingWebhookUrl }}</span>
            <button
              type="button"
              class="text-primary-600 hover:text-primary-800 text-xs font-medium whitespace-nowrap"
              @click="copyToClipboard(row.incomingWebhookUrl!)"
            >
              Copy
            </button>
          </span>
          <span v-else class="text-gray-400">—</span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center space-x-2">
            <button
              @click="editProvider(row)"
              class="text-primary-600 hover:text-primary-800 mr-4 font-medium"
            >
              Edit
            </button>
            <button
              @click="toggleProviderStatus(row)"
              class="text-blue-600 hover:text-blue-800 mr-4 font-medium"
            >
              {{ row.isActive ? 'Deactivate' : 'Activate' }}
            </button>
            <button
              v-if="!row.isDefault"
              @click="setDefaultProvider(row)"
              class="text-green-600 hover:text-green-800 mr-4 font-medium"
            >
              Set Default
            </button>
            <button
              @click="deleteProvider(row)"
              class="text-red-600 hover:text-red-800 font-medium"
            >
              Delete
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingProvider"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4">
          {{ editingProvider ? 'Edit Provider' : 'Create Provider' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <Input
              v-model="formData.name"
              type="text"
              placeholder="Provider name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Provider Type *</label>
            <select
              v-model="formData.type"
              :disabled="!!editingProvider"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select type</option>
              <option value="SHIPROCKET">Shiprocket</option>
              <option value="DELHIVERY">Delhivery</option>
              <option value="CLICKPOST">ClickPost</option>
              <option value="VAMASHIP">Vamaship</option>
              <option value="SHIPJEE">Shipjee</option>
              <option value="INDISPEED">IndiSpeed</option>
              <option value="ULIP">ULIP</option>
            </select>
          </div>

          <div v-if="formData.type">
            <label class="block text-sm font-medium text-gray-700 mb-1">Configuration *</label>
            <ProviderConfig
              :provider-type="formData.type"
              v-model="formData.config"
            />
          </div>

          <div v-if="formData.type !== 'SHIPROCKET'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
            <Input
              v-model="formData.webhookUrl"
              type="url"
              placeholder="https://api.example.com/webhooks/logistics"
            />
          </div>

          <p v-if="formData.type === 'SHIPROCKET'" class="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
            After saving, copy the Webhook URL from the list or from this provider to paste in Shiprocket's dashboard.
          </p>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
            <Input
              v-model="formData.webhookSecret"
              type="password"
              placeholder="Webhook secret for signature verification"
            />
          </div>

          <div v-if="editingProvider?.incomingWebhookUrl" class="p-3 bg-gray-50 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-1">Incoming webhook URL</label>
            <p class="text-xs text-gray-500 mb-2">Paste this URL in the provider's webhook settings (e.g. Shiprocket dashboard).</p>
            <div class="flex items-center gap-2">
              <input
                :value="editingProvider.incomingWebhookUrl"
                type="text"
                readonly
                class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700"
              />
              <button
                type="button"
                class="px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                @click="copyToClipboard(editingProvider.incomingWebhookUrl!)"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Supported Regions</label>
            <Input
              v-model="regionsInput"
              type="text"
              placeholder="IN, US (comma-separated)"
              @blur="updateRegions"
            />
            <p class="text-xs text-gray-500 mt-1">Enter comma-separated region codes</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Supported Services</label>
            <Input
              v-model="servicesInput"
              type="text"
              placeholder="express, standard, cod (comma-separated)"
              @blur="updateServices"
            />
            <p class="text-xs text-gray-500 mt-1">Enter comma-separated service types</p>
          </div>

          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                v-model="formData.isActive"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.isDefault"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Default Provider</span>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <Input
              v-model.number="formData.priority"
              type="number"
              min="0"
              placeholder="0"
            />
            <p class="text-xs text-gray-500 mt-1">Lower number = higher priority</p>
          </div>

          <div class="flex justify-end space-x-4 mt-6">
            <Button variant="secondary" @click="closeModal">Cancel</Button>
            <Button
              type="submit"
              variant="primary"
              :loading="isSubmitting"
            >
              {{ editingProvider ? 'Update' : 'Create' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { logisticsProvidersApi } from '@/api/endpoints/logistics-providers'
import { useUIStore } from '@/stores/ui'
import { extractErrorMessage } from '@/utils/errorHandler'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Input from '@/components/common/Input.vue'
import DataTable from '@/components/admin/DataTable.vue'
import ProviderStatus from '@/components/logistics/ProviderStatus.vue'
import ProviderConfig from '@/components/logistics/ProviderConfig.vue'
import type { LogisticsProvider, LogisticsProviderConfig, LogisticsProviderType } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const providers = ref<LogisticsProvider[]>([])
const showCreateModal = ref(false)
const editingProvider = ref<LogisticsProvider | null>(null)
const filters = ref({
  isActive: undefined as boolean | undefined,
  type: ''
})

const formData = ref<Partial<LogisticsProvider>>({
  name: '',
  type: '' as LogisticsProviderType,
  config: {} as LogisticsProviderConfig,
  webhookUrl: '',
  webhookSecret: '',
  supportedRegions: [],
  supportedServices: [],
  isActive: false,
  isDefault: false,
  priority: 0
})

const regionsInput = ref('')
const servicesInput = ref('')

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'isActive', label: 'Status' },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'supportedRegions', label: 'Regions' },
  { key: 'supportedServices', label: 'Services' },
  { key: 'incomingWebhookUrl', label: 'Webhook URL' }
]

const updateRegions = () => {
  if (regionsInput.value) {
    formData.value.supportedRegions = regionsInput.value
      .split(',')
      .map(r => r.trim())
      .filter(Boolean)
  } else {
    formData.value.supportedRegions = []
  }
}

const updateServices = () => {
  if (servicesInput.value) {
    formData.value.supportedServices = servicesInput.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  } else {
    formData.value.supportedServices = []
  }
}

const loadProviders = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await logisticsProvidersApi.getProviders(filters.value)
    if (response.success && response.data) {
      providers.value = Array.isArray(response.data)
        ? response.data
        : (response.data as any).data || []
    } else {
      error.value = response.error || 'Failed to load providers'
    }
  } catch (err: any) {
    error.value = err?.response?.status === 403
      ? "You don't have permission to perform this action."
      : extractErrorMessage(err)
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    let response
    if (editingProvider.value) {
      response = await logisticsProvidersApi.updateProvider(editingProvider.value.id, formData.value)
    } else {
      response = await logisticsProvidersApi.createProvider(formData.value)
    }
    
    if (response.success) {
      uiStore.showNotification('success', editingProvider.value ? 'Provider updated successfully' : 'Provider created successfully')
      closeModal()
      await loadProviders()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to save provider')
    }
  } catch (err: any) {
    const message = err?.response?.status === 403
      ? "You don't have permission to perform this action."
      : err?.response?.status === 400
        ? (err?.response?.data?.error || 'Invalid request. Please check your input.')
        : extractErrorMessage(err)
    uiStore.showNotification('error', message)
  } finally {
    isSubmitting.value = false
  }
}

const editProvider = (provider: LogisticsProvider) => {
  editingProvider.value = provider
  formData.value = {
    name: provider.name,
    type: provider.type,
    config: { ...provider.config },
    webhookUrl: provider.webhookUrl || '',
    webhookSecret: provider.webhookSecret || '',
    supportedRegions: [...(provider.supportedRegions || [])],
    supportedServices: [...(provider.supportedServices || [])],
    isActive: provider.isActive,
    isDefault: provider.isDefault,
    priority: provider.priority
  }
  regionsInput.value = (provider.supportedRegions || []).join(', ')
  servicesInput.value = (provider.supportedServices || []).join(', ')
  showCreateModal.value = true
}

const toggleProviderStatus = async (provider: LogisticsProvider) => {
  try {
    const response = await logisticsProvidersApi.toggleProvider(provider.id)
    if (response.success) {
      uiStore.showNotification('success', provider.isActive ? 'Provider deactivated' : 'Provider activated')
      await loadProviders()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to toggle provider status')
    }
  } catch (err: any) {
    const message = err?.response?.status === 403
      ? "You don't have permission to perform this action."
      : extractErrorMessage(err)
    uiStore.showNotification('error', message)
  }
}

const setDefaultProvider = async (provider: LogisticsProvider) => {
  try {
    const response = await logisticsProvidersApi.setDefaultProvider(provider.id)
    if (response.success) {
      uiStore.showNotification('success', 'Default provider set successfully')
      await loadProviders()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to set default provider')
    }
  } catch (err: any) {
    const message = err?.response?.status === 403
      ? "You don't have permission to perform this action."
      : extractErrorMessage(err)
    uiStore.showNotification('error', message)
  }
}

const deleteProvider = async (provider: LogisticsProvider) => {
  if (!confirm(`Are you sure you want to delete ${provider.name}? This action cannot be undone.`)) {
    return
  }
  
  try {
    const response = await logisticsProvidersApi.deleteProvider(provider.id)
    if (response.success) {
      uiStore.showNotification('success', 'Provider deleted successfully')
      await loadProviders()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete provider')
    }
  } catch (err: any) {
    const message = err?.response?.status === 403
      ? "You don't have permission to perform this action."
      : err?.response?.status === 400
        ? (err?.response?.data?.error || 'Cannot delete provider with active shipments.')
        : extractErrorMessage(err)
    uiStore.showNotification('error', message)
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    uiStore.showNotification('success', 'Copied to clipboard')
  } catch {
    uiStore.showNotification('error', 'Failed to copy')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingProvider.value = null
  formData.value = {
    name: '',
    type: '' as LogisticsProviderType,
    config: {} as LogisticsProviderConfig,
    webhookUrl: '',
    webhookSecret: '',
    supportedRegions: [],
    supportedServices: [],
    isActive: false,
    isDefault: false,
    priority: 0
  }
  regionsInput.value = ''
  servicesInput.value = ''
}

onMounted(() => {
  loadProviders()
})
</script>
