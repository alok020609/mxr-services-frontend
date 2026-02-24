<template>
  <div class="deprecation-notices">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Deprecation Notices</h2>
        <p class="text-sm text-gray-600">View and create deprecation notices for API versions/endpoints</p>
      </div>
      <Button variant="primary" @click="showCreateModal = true">
        <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Notice
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-gray-600">Loading deprecation notices...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Unable to load deprecation notices</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadNotices">Retry</Button>
      </div>
    </div>

    <!-- Notices List -->
    <div v-else-if="notices.length > 0" class="space-y-4">
      <DataTable
        :columns="columns"
        :data="filteredNotices"
        :actions="false"
        row-key="id"
      >
        <template #cell-version="{ value }">
          <span class="font-mono font-medium">v{{ value }}</span>
        </template>
        <template #cell-status="{ value }">
          <span :class="getStatusClass(value)" class="px-2 py-1 rounded-full text-xs font-medium">
            {{ value }}
          </span>
        </template>
        <template #cell-deprecationDate="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell-removalDate="{ value }">
          <span v-if="value">{{ formatDate(value) }}</span>
          <span v-else class="text-gray-400">Not set</span>
        </template>
        <template #cell-affectedEndpoints="{ row }">
          <span v-if="row.affectedEndpoints && row.affectedEndpoints.length > 0">
            {{ row.affectedEndpoints.length }} endpoint(s)
          </span>
          <span v-else class="text-gray-400">All endpoints</span>
        </template>
      </DataTable>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 border rounded-lg bg-gray-50">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-gray-500 mb-2">No deprecation notices found</p>
      <Button variant="primary" class="mt-4" @click="showCreateModal = true">
        Create Your First Notice
      </Button>
    </div>

    <!-- Create Notice Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Create Deprecation Notice</h3>
          
          <form @submit.prevent="createNotice" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Version <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.version"
                type="text"
                class="input"
                placeholder="e.g., 1.0"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Affected Endpoints (Optional)
              </label>
              <textarea
                v-model="affectedEndpointsInput"
                class="input"
                rows="3"
                placeholder="Enter endpoints separated by commas or new lines"
                @input="updateAffectedEndpoints"
              ></textarea>
              <p class="text-gray-500 text-xs mt-1">Leave empty to apply to all endpoints</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Deprecation Date <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.deprecationDate"
                  type="date"
                  class="input"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Removal Date (Optional)
                </label>
                <input
                  v-model="form.removalDate"
                  type="date"
                  class="input"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notice <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.notice"
                class="input"
                rows="4"
                placeholder="Enter deprecation notice details..."
                required
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Migration Guide (Optional)
              </label>
              <textarea
                v-model="form.migrationGuide"
                class="input"
                rows="4"
                placeholder="Enter migration guide..."
              ></textarea>
            </div>

            <div v-if="apiError" class="p-3 bg-red-50 border border-red-200 rounded">
              <p class="text-red-800 text-sm">{{ apiError }}</p>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="secondary" @click="closeModal">
                Cancel
              </Button>
              <Button type="submit" variant="primary" :loading="isSubmitting">
                Create Notice
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiDeprecationApi } from '@/api/endpoints/api-deprecation'
import { useUIStore } from '@/stores/ui'
import type { DeprecationNotice, CreateDeprecationNoticeRequest } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import DataTable from '@/components/admin/DataTable.vue'
import { formatDate } from '@/utils/formatters'

const uiStore = useUIStore()
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const apiError = ref<string | null>(null)
const notices = ref<DeprecationNotice[]>([])
const showCreateModal = ref(false)
const statusFilter = ref<string>('')
const affectedEndpointsInput = ref('')

const form = ref<CreateDeprecationNoticeRequest>({
  version: '',
  affectedEndpoints: [],
  deprecationDate: '',
  removalDate: undefined,
  migrationGuide: undefined,
  notice: ''
})

const columns = [
  { key: 'version', label: 'Version', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'deprecationDate', label: 'Deprecation Date', sortable: true },
  { key: 'removalDate', label: 'Removal Date', sortable: true },
  { key: 'affectedEndpoints', label: 'Affected Endpoints', sortable: false }
]

const filteredNotices = computed(() => {
  if (!statusFilter.value) return notices.value
  return notices.value.filter(n => n.status === statusFilter.value)
})

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-yellow-100 text-yellow-800',
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const updateAffectedEndpoints = () => {
  if (!affectedEndpointsInput.value.trim()) {
    form.value.affectedEndpoints = []
    return
  }
  form.value.affectedEndpoints = affectedEndpointsInput.value
    .split(/[,\n]/)
    .map(e => e.trim())
    .filter(e => e.length > 0)
}

const loadNotices = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiDeprecationApi.getDeprecationNotices()
    if (response.success && response.data) {
      notices.value = response.data
    } else {
      error.value = response.error || 'Failed to load deprecation notices'
    }
  } catch (err: any) {
    // Handle different error response structures
    let errorMessage = 'Failed to load deprecation notices'
    
    if (err.response) {
      // Server responded with error status
      if (err.response.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response.status === 500) {
        errorMessage = 'Server error: The backend service encountered an issue. Please try again later or contact support.'
      } else if (err.response.status === 401) {
        errorMessage = 'Unauthorized: Please log in again'
      } else if (err.response.status === 429) {
        errorMessage = 'Rate limit exceeded: Please wait a moment before trying again'
      } else {
        errorMessage = `Request failed with status ${err.response.status}`
      }
    } else if (err.message) {
      errorMessage = err.message
    }
    
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
  } finally {
    isLoading.value = false
  }
}

const createNotice = async () => {
  isSubmitting.value = true
  apiError.value = null
  try {
    const response = await apiDeprecationApi.createDeprecationNotice(form.value)
    if (response.success) {
      uiStore.showNotification('success', 'Deprecation notice created successfully')
      closeModal()
      await loadNotices()
    } else {
      apiError.value = response.error || 'Failed to create deprecation notice'
    }
  } catch (err: any) {
    apiError.value = err.response?.data?.error || err.message || 'Failed to create deprecation notice'
    uiStore.showNotification('error', apiError.value)
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  form.value = {
    version: '',
    affectedEndpoints: [],
    deprecationDate: '',
    removalDate: undefined,
    migrationGuide: undefined,
    notice: ''
  }
  affectedEndpointsInput.value = ''
  apiError.value = null
}

onMounted(() => {
  loadNotices()
})
</script>

