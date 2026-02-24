<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 flex items-center">
            <svg class="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Service Management
          </h1>
          <p class="text-primary-100">Configure SMTP, SendGrid, Mailgun, and AWS SES</p>
        </div>
        <div class="flex items-center space-x-3">
          <Button
            variant="primary"
            class="bg-white text-primary-600 hover:bg-primary-50 shadow-lg"
            @click="showCreateModal = true"
          >
            <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Email Service
          </Button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-2xl font-bold text-gray-900">{{ services.length }}</p>
          </div>
          <div class="bg-blue-100 rounded-full p-3">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Active</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeCount }}</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Inactive</p>
            <p class="text-2xl font-bold text-gray-900">{{ inactiveCount }}</p>
          </div>
          <div class="bg-purple-100 rounded-full p-3">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Types</p>
            <p class="text-2xl font-bold text-gray-900">{{ uniqueTypesCount }}</p>
          </div>
          <div class="bg-orange-100 rounded-full p-3">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or type..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="typeFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">All types</option>
            <option value="SMTP">SMTP</option>
            <option value="SENDGRID">SendGrid</option>
            <option value="MAILGUN">Mailgun</option>
            <option value="AWS_SES">AWS SES</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="statusFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
      <LoadingSpinner size="md" />
      <span class="ml-3 text-gray-600">Loading email services...</span>
    </div>

    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Error loading email services</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadServices">Retry</Button>
      </div>
    </div>

    <div v-else-if="filteredServices.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
      <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-500 text-lg mb-2">No email services found</p>
      <p class="text-gray-400 text-sm mb-4">Add your first email service to send transactional emails</p>
      <Button variant="primary" @click="showCreateModal = true">
        Add Email Service
      </Button>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <DataTable
        :columns="columns"
        :data="filteredServices"
        :actions="true"
        row-key="id"
      >
        <template #cell-type="{ row }">
          <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getTypeBadgeClass(row.type)">
            {{ row.type }}
          </span>
        </template>
        <template #cell-isActive="{ row }">
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
          >
            {{ row.isActive ? 'Active' : 'Inactive' }}
          </span>
        </template>
        <template #cell-isDefault="{ row }">
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="row.isDefault ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'"
          >
            {{ row.isDefault ? 'Default' : '—' }}
          </span>
        </template>
        <template #actions="{ row }">
          <button
            type="button"
            class="text-primary-600 hover:text-primary-800 mr-4 font-medium"
            @click="editService(row)"
          >
            Edit
          </button>
          <button
            type="button"
            class="text-blue-600 hover:text-blue-800 mr-4 font-medium"
            @click="toggleStatus(row)"
          >
            {{ row.isActive ? 'Deactivate' : 'Activate' }}
          </button>
          <button
            v-if="!row.isDefault"
            type="button"
            class="text-amber-600 hover:text-amber-800 mr-4 font-medium"
            @click="setDefault(row)"
          >
            Set default
          </button>
          <button
            type="button"
            class="text-red-600 hover:text-red-800 font-medium"
            @click="deleteService(row)"
          >
            Delete
          </button>
        </template>
      </DataTable>
    </div>

    <div
      v-if="showCreateModal || editingService"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">
            {{ editingService ? 'Edit Email Service' : 'Create Email Service' }}
          </h2>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="closeModal">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <EmailServiceForm
          :service="editingService"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { emailServicesApi } from '@/api/endpoints/email-services'
import { useUIStore } from '@/stores/ui'
import { extractPaginatedData } from '@/utils/dataNormalizer'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import EmailServiceForm from '@/components/admin/EmailServiceForm.vue'
import type { EmailService, EmailServiceCreatePayload } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)
const services = ref<EmailService[]>([])
const showCreateModal = ref(false)
const editingService = ref<EmailService | null>(null)
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'isActive', label: 'Status', sortable: true },
  { key: 'isDefault', label: 'Default', sortable: true }
]

const activeCount = computed(() => services.value.filter((s) => s.isActive).length)
const inactiveCount = computed(() => services.value.filter((s) => !s.isActive).length)
const uniqueTypesCount = computed(() => new Set(services.value.map((s) => s.type)).size)

const filteredServices = computed(() => {
  let list = [...services.value]
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
    )
  }
  if (typeFilter.value) {
    list = list.filter((s) => s.type === typeFilter.value)
  }
  if (statusFilter.value) {
    list = list.filter((s) => (statusFilter.value === 'active' ? s.isActive : !s.isActive))
  }
  return list
})

function getTypeBadgeClass(type: string) {
  const map: Record<string, string> = {
    SMTP: 'bg-gray-100 text-gray-800',
    SENDGRID: 'bg-blue-100 text-blue-800',
    MAILGUN: 'bg-orange-100 text-orange-800',
    AWS_SES: 'bg-amber-100 text-amber-800'
  }
  return map[type] || 'bg-gray-100 text-gray-800'
}

async function loadServices() {
  isLoading.value = true
  error.value = null
  try {
    const response = await emailServicesApi.getEmailServices()
    if (response.success) {
      const { data } = extractPaginatedData(response)
      services.value = Array.isArray(data) ? data : []
    } else {
      error.value = response.error || 'Failed to load email services'
      uiStore.showNotification('error', error.value)
      services.value = []
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to load email services'
    error.value = msg
    uiStore.showNotification('error', msg)
    services.value = []
  } finally {
    isLoading.value = false
  }
}

function editService(service: EmailService) {
  editingService.value = service
  showCreateModal.value = true
}

async function toggleStatus(service: EmailService) {
  if (!confirm(`Are you sure you want to ${service.isActive ? 'deactivate' : 'activate'} "${service.name}"?`)) {
    return
  }
  try {
    const response = await emailServicesApi.toggleEmailService(service.id, !service.isActive)
    if (response.success) {
      uiStore.showNotification('success', `Service ${service.isActive ? 'deactivated' : 'activated'} successfully`)
      await loadServices()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update status')
    }
  } catch (err: unknown) {
    uiStore.showNotification('error', err instanceof Error ? err.message : 'Failed to update status')
  }
}

async function setDefault(service: EmailService) {
  try {
    const response = await emailServicesApi.setDefaultEmailService(service.id)
    if (response.success) {
      uiStore.showNotification('success', 'Default email service updated')
      await loadServices()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to set default')
    }
  } catch (err: unknown) {
    uiStore.showNotification('error', err instanceof Error ? err.message : 'Failed to set default')
  }
}

async function deleteService(service: EmailService) {
  if (service.isDefault) {
    uiStore.showNotification('error', 'Cannot delete the default email service. Set another as default first.')
    return
  }
  if (!confirm(`Delete "${service.name}"? This cannot be undone.`)) {
    return
  }
  try {
    const response = await emailServicesApi.deleteEmailService(service.id)
    if (response.success) {
      uiStore.showNotification('success', 'Email service deleted')
      await loadServices()
      closeModal()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete')
    }
  } catch (err: unknown) {
    uiStore.showNotification('error', err instanceof Error ? err.message : 'Failed to delete')
  }
}

async function handleSubmit(data: EmailServiceCreatePayload) {
  isSaving.value = true
  try {
    if (editingService.value) {
      const response = await emailServicesApi.updateEmailService(editingService.value.id, data)
      if (response.success) {
        uiStore.showNotification('success', 'Email service updated')
        closeModal()
        await loadServices()
      } else {
        uiStore.showNotification('error', response.error || 'Failed to update')
      }
    } else {
      const response = await emailServicesApi.createEmailService(data)
      if (response.success) {
        uiStore.showNotification('success', 'Email service created')
        closeModal()
        await loadServices()
      } else {
        uiStore.showNotification('error', response.error || 'Failed to create')
      }
    }
  } catch (err: unknown) {
    uiStore.showNotification('error', err instanceof Error ? err.message : 'Failed to save')
  } finally {
    isSaving.value = false
  }
}

function closeModal() {
  showCreateModal.value = false
  editingService.value = null
}

onMounted(() => {
  loadServices()
})
</script>
