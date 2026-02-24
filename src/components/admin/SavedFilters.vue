<template>
  <div class="saved-filters">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Saved Filters</h3>
      <Button variant="primary" size="sm" @click="showSaveModal = true">
        <svg class="h-4 w-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Save Filter
      </Button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner size="sm" />
      <span class="ml-2 text-gray-600">Loading filters...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="filters.length === 0" class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      <p>No saved filters</p>
      <p class="text-sm mt-1">Save filter configurations for quick reuse</p>
    </div>

    <!-- Filters List -->
    <div v-else class="space-y-3">
      <div
        v-for="filter in filters"
        :key="filter.id"
        class="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <h4 class="font-semibold text-gray-900">{{ filter.name }}</h4>
              <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                {{ filter.resource }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-2">
              {{ formatFilters(filter.filters) }}
            </p>
            <p class="text-xs text-gray-400">
              Created: {{ formatDate(filter.createdAt) }}
            </p>
          </div>
          <div class="flex items-center space-x-2 ml-4">
            <button
              @click="applyFilter(filter)"
              class="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
              title="Apply filter"
            >
              Apply
            </button>
            <button
              @click="editFilter(filter)"
              class="p-1 text-gray-600 hover:text-primary-600 transition-colors"
              title="Edit filter"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteFilter(filter.id)"
              class="p-1 text-gray-600 hover:text-red-600 transition-colors"
              title="Delete filter"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Save/Edit Filter Modal -->
    <Modal
      :is-open="showSaveModal"
      :title="editingFilter ? 'Edit Filter' : 'Save Filter'"
      @close="closeModal"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter Name</label>
          <input
            v-model="filterForm.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Pending Orders"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Resource</label>
          <select
            v-model="filterForm.resource"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select resource...</option>
            <option value="orders">Orders</option>
            <option value="products">Products</option>
            <option value="users">Users</option>
            <option value="categories">Categories</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filters (JSON)</label>
          <textarea
            v-model="filterForm.filtersJson"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            rows="6"
            placeholder='{"status": "pending", "dateFrom": "2024-01-01"}'
            required
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">Enter filter criteria as JSON object</p>
        </div>
        <div class="flex justify-end space-x-2">
          <Button variant="secondary" @click="closeModal">Cancel</Button>
          <Button variant="primary" @click="saveFilter" :loading="isSaving">
            {{ editingFilter ? 'Update' : 'Save' }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminApi } from '@/api/endpoints/admin'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatDate } from '@/utils/formatters'
import type { SavedFilter } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Modal from '@/components/common/Modal.vue'

const router = useRouter()
const uiStore = useUIStore()
const isLoading = ref(false)
const isSaving = ref(false)
const filters = ref<SavedFilter[]>([])
const showSaveModal = ref(false)
const editingFilter = ref<SavedFilter | null>(null)

const filterForm = ref({
  name: '',
  resource: '',
  filtersJson: ''
})

const loadFilters = async () => {
  isLoading.value = true
  try {
    const response = await adminApi.getFilters()
    sendToTerminal('log', '[SavedFilters] API Response:', response)
    
    if (response.success && response.data) {
      filters.value = Array.isArray(response.data) ? response.data : []
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load filters')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to load filters')
    sendToTerminal('error', '[SavedFilters] Error loading filters:', error)
  } finally {
    isLoading.value = false
  }
}

const saveFilter = async () => {
  if (!filterForm.value.name || !filterForm.value.resource || !filterForm.value.filtersJson) {
    uiStore.showNotification('error', 'Please fill in all fields')
    return
  }

  let filtersObj
  try {
    filtersObj = JSON.parse(filterForm.value.filtersJson)
  } catch (error) {
    uiStore.showNotification('error', 'Invalid JSON format in filters field')
    return
  }

  isSaving.value = true
  try {
    let response
    if (editingFilter.value) {
      response = await adminApi.updateFilter(editingFilter.value.id, {
        name: filterForm.value.name,
        resource: filterForm.value.resource,
        filters: filtersObj
      })
    } else {
      response = await adminApi.saveFilter({
        name: filterForm.value.name,
        resource: filterForm.value.resource,
        filters: filtersObj
      })
    }
    
    sendToTerminal('log', '[SavedFilters] Save filter response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', editingFilter.value ? 'Filter updated successfully' : 'Filter saved successfully')
      closeModal()
      await loadFilters()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to save filter')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to save filter')
    sendToTerminal('error', '[SavedFilters] Error saving filter:', error)
  } finally {
    isSaving.value = false
  }
}

const applyFilter = (filter: SavedFilter) => {
  // Navigate to the resource page with filters applied
  const resourceRoutes: Record<string, string> = {
    orders: '/admin/orders',
    products: '/admin/products',
    users: '/admin/users',
    categories: '/admin/categories'
  }
  
  const route = resourceRoutes[filter.resource]
  if (route) {
    // Store filters in sessionStorage or pass as query params
    sessionStorage.setItem(`savedFilter_${filter.resource}`, JSON.stringify(filter.filters))
    router.push(route)
    uiStore.showNotification('success', `Filter "${filter.name}" applied`)
  } else {
    uiStore.showNotification('error', `Unknown resource: ${filter.resource}`)
  }
}

const editFilter = (filter: SavedFilter) => {
  editingFilter.value = filter
  filterForm.value = {
    name: filter.name,
    resource: filter.resource,
    filtersJson: JSON.stringify(filter.filters, null, 2)
  }
  showSaveModal.value = true
}

const deleteFilter = async (filterId: string) => {
  if (!confirm('Are you sure you want to delete this filter?')) {
    return
  }

  try {
    const response = await adminApi.deleteFilter(filterId)
    sendToTerminal('log', '[SavedFilters] Delete filter response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Filter deleted successfully')
      await loadFilters()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete filter')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete filter')
    sendToTerminal('error', '[SavedFilters] Error deleting filter:', error)
  }
}

const formatFilters = (filtersObj: any): string => {
  if (!filtersObj) return 'No filters'
  try {
    const entries = Object.entries(filtersObj)
    if (entries.length === 0) return 'No filters'
    return entries.map(([key, value]) => `${key}: ${value}`).join(', ')
  } catch {
    return String(filtersObj)
  }
}

const closeModal = () => {
  showSaveModal.value = false
  editingFilter.value = null
  filterForm.value = {
    name: '',
    resource: '',
    filtersJson: ''
  }
}

onMounted(() => {
  loadFilters()
})
</script>

<style scoped>
.saved-filters {
  @apply space-y-4;
}
</style>

