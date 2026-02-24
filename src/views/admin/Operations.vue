<template>
  <AdminLayout>
    <div>
      <h1 class="text-3xl font-bold mb-8">Operational Controls</h1>
      
      <!-- Tabs -->
      <div class="border-b mb-6">
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
      
      <!-- Bulk Operations Tab -->
      <div v-if="activeTab === 'bulk'">
        <div class="card mb-6">
          <h2 class="text-xl font-bold mb-4">Bulk Operations</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Operation Type</label>
              <select v-model="bulkOperation.type" class="input">
                <option value="products">Products</option>
                <option value="orders">Orders</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Action</label>
              <select v-model="bulkOperation.action" class="input">
                <option value="activate">Activate</option>
                <option value="deactivate">Deactivate</option>
                <option value="delete">Delete</option>
                <option value="update">Update</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">IDs (comma-separated)</label>
              <textarea
                v-model="bulkOperation.ids"
                class="input"
                rows="4"
                placeholder="Enter IDs separated by commas"
              ></textarea>
            </div>
            <Button variant="primary" @click="executeBulkOperation" :loading="isProcessing">
              Execute Bulk Operation
            </Button>
          </div>
        </div>
      </div>
      
      <!-- Batch Requests Tab -->
      <div v-if="activeTab === 'batch'">
        <BatchRequests />
      </div>
      
      <!-- Import/Export Tab -->
      <div v-if="activeTab === 'import-export'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Import -->
          <div class="card">
            <h2 class="text-xl font-bold mb-4">Import Data</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Data Type</label>
                <select v-model="importType" class="input">
                  <option value="products">Products</option>
                  <option value="orders">Orders</option>
                  <option value="users">Users</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">File</label>
                <input
                  type="file"
                  @change="handleFileSelect"
                  accept=".csv,.json,.xlsx"
                  class="input"
                />
              </div>
              <Button variant="primary" @click="handleImport" :loading="isProcessing" :disabled="!selectedFile">
                Import
              </Button>
            </div>
          </div>
          
          <!-- Export -->
          <div class="card">
            <h2 class="text-xl font-bold mb-4">Export Data</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Data Type</label>
                <select v-model="exportType" class="input">
                  <option value="products">Products</option>
                  <option value="orders">Orders</option>
                  <option value="users">Users</option>
                </select>
              </div>
              <Button variant="primary" @click="handleExport" :loading="isProcessing">
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Cron Jobs Tab -->
      <div v-if="activeTab === 'cron'">
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Cron Jobs</h2>
          <div v-if="isLoading" class="flex justify-center py-8">
            <LoadingSpinner />
          </div>
          <div v-else-if="cronJobs.length === 0" class="text-center py-8">
            <p class="text-gray-500">No cron jobs found</p>
          </div>
          <DataTable
            v-else
            :columns="cronColumns"
            :data="cronJobs"
            :actions="true"
            row-key="id"
          >
            <template #cell-enabled="{ value }">
              <span :class="value ? 'text-green-600' : 'text-red-600'">
                {{ value ? 'Enabled' : 'Disabled' }}
              </span>
            </template>
            <template #actions="{ row }">
              <button @click="editCronJob(row)" class="text-primary-600">Edit</button>
            </template>
          </DataTable>
        </div>
      </div>
      
      <!-- Webhooks Tab -->
      <div v-if="activeTab === 'webhooks'">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Webhooks</h2>
          <Button variant="primary" @click="showWebhookModal = true">
            Add Webhook
          </Button>
        </div>
        <div class="card">
          <div v-if="isLoading" class="flex justify-center py-8">
            <LoadingSpinner />
          </div>
          <div v-else-if="webhooks.length === 0" class="text-center py-8">
            <p class="text-gray-500">No webhooks found</p>
          </div>
          <DataTable
            v-else
            :columns="webhookColumns"
            :data="webhooks"
            :actions="true"
            row-key="id"
          >
            <template #actions="{ row }">
              <button @click="editWebhook(row)" class="text-primary-600 mr-2">Edit</button>
              <button @click="viewWebhookLogs(row.id)" class="text-primary-600 mr-2">Logs</button>
              <button @click="deleteWebhook(row.id)" class="text-red-600">Delete</button>
            </template>
          </DataTable>
        </div>
      </div>
      
      <!-- Webhook Modal -->
      <div
        v-if="showWebhookModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeWebhookModal"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">
            {{ editingWebhook ? 'Edit Webhook' : 'Create Webhook' }}
          </h2>
          <form @submit.prevent="editingWebhook ? updateWebhook() : createWebhook()" class="space-y-4">
            <Input v-model="webhookForm.url" label="URL" required />
            <Input v-model="webhookForm.event" label="Event" required />
            <div class="flex justify-end space-x-4">
              <Button type="button" variant="secondary" @click="closeWebhookModal">Cancel</Button>
              <Button type="submit" variant="primary" :loading="isProcessing">
                {{ editingWebhook ? 'Update' : 'Create' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Cron Job Edit Modal -->
      <div
        v-if="editingCronJob"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="editingCronJob = null"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">Edit Cron Job</h2>
          <form @submit.prevent="saveCronJob" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Schedule (Cron Expression)</label>
              <Input v-model="cronJobForm.schedule" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Enabled</label>
              <select v-model="cronJobForm.enabled" class="input">
                <option :value="true">Enabled</option>
                <option :value="false">Disabled</option>
              </select>
            </div>
            <div class="flex justify-end space-x-4">
              <Button type="button" variant="secondary" @click="editingCronJob = null">Cancel</Button>
              <Button type="submit" variant="primary" :loading="isProcessing">Save</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { operationalApi } from '@/api/endpoints/operational'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import AdminLayout from './AdminLayout.vue'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import BatchRequests from '@/components/operational/BatchRequests.vue'

const uiStore = useUIStore()
const activeTab = ref<'bulk' | 'import-export' | 'cron' | 'webhooks' | 'batch'>('bulk')
const isLoading = ref(false)
const isProcessing = ref(false)

const tabs = [
  { id: 'bulk', label: 'Bulk Operations' },
  { id: 'import-export', label: 'Import/Export' },
  { id: 'batch', label: 'Batch Requests' },
  { id: 'cron', label: 'Cron Jobs' },
  { id: 'webhooks', label: 'Webhooks' }
]

const bulkOperation = ref({
  type: 'products',
  action: 'activate',
  ids: ''
})

const importType = ref('products')
const exportType = ref('products')
const selectedFile = ref<File | null>(null)

const cronJobs = ref<any[]>([])
const editingCronJob = ref<any | null>(null)
const cronJobForm = ref({
  schedule: '',
  enabled: true
})
const cronColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'schedule', label: 'Schedule', sortable: true },
  { key: 'enabled', label: 'Status', sortable: true },
  { key: 'lastRun', label: 'Last Run', sortable: true }
]

const webhooks = ref<any[]>([])
const showWebhookModal = ref(false)
const editingWebhook = ref<any | null>(null)
const webhookForm = ref({
  url: '',
  event: ''
})

const webhookColumns = [
  { key: 'url', label: 'URL', sortable: true },
  { key: 'event', label: 'Event', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true }
]

const executeBulkOperation = async () => {
  if (!bulkOperation.value.ids.trim()) {
    uiStore.showNotification('error', 'Please enter IDs')
    return
  }
  
  isProcessing.value = true
  try {
    const ids = bulkOperation.value.ids.split(',').map(id => id.trim()).filter(Boolean)
    let response
    
    if (bulkOperation.value.type === 'products') {
      response = await operationalApi.bulkProducts(bulkOperation.value.action, ids)
    } else {
      response = await operationalApi.bulkOrders(bulkOperation.value.action, ids)
    }
    
    sendToTerminal('log', '[Operations] Bulk operation response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Bulk operation completed successfully')
      bulkOperation.value.ids = ''
    } else {
      uiStore.showNotification('error', response.error || 'Failed to execute bulk operation')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to execute bulk operation')
    sendToTerminal('error', '[Operations] Error executing bulk operation:', error)
  } finally {
    isProcessing.value = false
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const handleImport = async () => {
  if (!selectedFile.value) {
    uiStore.showNotification('error', 'Please select a file')
    return
  }
  
  isProcessing.value = true
  try {
    const response = await operationalApi.importData(selectedFile.value, importType.value)
    sendToTerminal('log', '[Operations] Import response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Import started successfully')
      selectedFile.value = null
    } else {
      uiStore.showNotification('error', response.error || 'Failed to start import')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to start import')
    sendToTerminal('error', '[Operations] Error importing:', error)
  } finally {
    isProcessing.value = false
  }
}

const handleExport = async () => {
  isProcessing.value = true
  try {
    const blob = await operationalApi.exportData(exportType.value)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${exportType.value}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    uiStore.showNotification('success', 'Export completed successfully')
    sendToTerminal('log', '[Operations] Export completed')
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to export')
    sendToTerminal('error', '[Operations] Error exporting:', error)
  } finally {
    isProcessing.value = false
  }
}

const loadCronJobs = async () => {
  isLoading.value = true
  try {
    const response = await operationalApi.getCronJobs()
    sendToTerminal('log', '[Operations] Cron jobs response:', response)
    
    if (response.success && response.data) {
      cronJobs.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    sendToTerminal('error', '[Operations] Error loading cron jobs:', error)
  } finally {
    isLoading.value = false
  }
}

const editCronJob = (job: any) => {
  editingCronJob.value = job
  cronJobForm.value = {
    schedule: job.schedule || '',
    enabled: job.enabled !== undefined ? job.enabled : true
  }
}

const saveCronJob = async () => {
  if (!editingCronJob.value) return
  
  isProcessing.value = true
  try {
    const response = await operationalApi.updateCronJob(editingCronJob.value.id, cronJobForm.value)
    sendToTerminal('log', '[Operations] Update cron job response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Cron job updated successfully')
      editingCronJob.value = null
      await loadCronJobs()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update cron job')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update cron job')
    sendToTerminal('error', '[Operations] Error updating cron job:', error)
  } finally {
    isProcessing.value = false
  }
}

const loadWebhooks = async () => {
  isLoading.value = true
  try {
    const response = await operationalApi.getWebhooks()
    sendToTerminal('log', '[Operations] Webhooks response:', response)
    
    if (response.success && response.data) {
      webhooks.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    sendToTerminal('error', '[Operations] Error loading webhooks:', error)
  } finally {
    isLoading.value = false
  }
}

const closeWebhookModal = () => {
  showWebhookModal.value = false
  editingWebhook.value = null
  webhookForm.value = { url: '', event: '' }
}

const editWebhook = (webhook: any) => {
  editingWebhook.value = webhook
  webhookForm.value = {
    url: webhook.url || '',
    event: webhook.event || ''
  }
  showWebhookModal.value = true
}

const createWebhook = async () => {
  isProcessing.value = true
  try {
    const response = await operationalApi.createWebhook(webhookForm.value)
    sendToTerminal('log', '[Operations] Create webhook response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Webhook created successfully')
      closeWebhookModal()
      await loadWebhooks()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to create webhook')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to create webhook')
    sendToTerminal('error', '[Operations] Error creating webhook:', error)
  } finally {
    isProcessing.value = false
  }
}

const updateWebhook = async () => {
  if (!editingWebhook.value) return
  
  isProcessing.value = true
  try {
    const response = await operationalApi.updateWebhook(editingWebhook.value.id, webhookForm.value)
    sendToTerminal('log', '[Operations] Update webhook response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Webhook updated successfully')
      closeWebhookModal()
      await loadWebhooks()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update webhook')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update webhook')
    sendToTerminal('error', '[Operations] Error updating webhook:', error)
  } finally {
    isProcessing.value = false
  }
}

const viewWebhookLogs = async (webhookId: string) => {
  try {
    const response = await operationalApi.getWebhookLogs()
    sendToTerminal('log', '[Operations] Webhook logs response:', response)
    uiStore.showNotification('info', 'Webhook logs loaded (check terminal)')
  } catch (error) {
    uiStore.showNotification('error', 'Failed to load webhook logs')
  }
}

const deleteWebhook = async (id: string) => {
  if (!confirm('Are you sure you want to delete this webhook?')) return
  
  isProcessing.value = true
  try {
    const response = await operationalApi.deleteWebhook(id)
    sendToTerminal('log', '[Operations] Delete webhook response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Webhook deleted successfully')
      await loadWebhooks()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete webhook')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete webhook')
    sendToTerminal('error', '[Operations] Error deleting webhook:', error)
  } finally {
    isProcessing.value = false
  }
}

// Watch for tab changes to load data
import { watch } from 'vue'

watch(activeTab, (newTab) => {
  if (newTab === 'cron') loadCronJobs()
  if (newTab === 'webhooks') loadWebhooks()
})

onMounted(() => {
  if (activeTab.value === 'cron') loadCronJobs()
  if (activeTab.value === 'webhooks') loadWebhooks()
})
</script>
