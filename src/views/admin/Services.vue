<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 flex items-center">
            <svg class="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Services
          </h1>
          <p class="text-primary-100">Manage consulting, repair, and installation services</p>
        </div>
        <div class="flex items-center space-x-3">
          <Button
            variant="primary"
            class="bg-white text-primary-600 hover:bg-primary-50 shadow-lg"
            @click="openCreate"
          >
            <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add service
          </Button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="filters.type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All types</option>
            <option value="CONSULTING">CONSULTING</option>
            <option value="REPAIR">REPAIR</option>
            <option value="INSTALLATION">INSTALLATION</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            v-model="filters.categoryId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All categories</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Product</label>
          <select
            v-model="filters.productId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All products</option>
            <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.isActive"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div class="flex items-end">
          <Button variant="secondary" class="w-full" @click="clearFilters">Clear filters</Button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
      <LoadingSpinner size="md" />
      <span class="ml-3 text-gray-600">Loading services...</span>
    </div>

    <div v-else-if="listError" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Error loading services</p>
          <p class="text-red-600 text-sm">{{ listError }}</p>
        </div>
        <Button variant="primary" size="sm" @click="loadList">Retry</Button>
      </div>
    </div>

    <div v-else-if="services.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
      <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-500 text-lg mb-2">No services found</p>
      <p class="text-gray-400 text-sm mb-4">Add a service or adjust filters</p>
      <Button variant="primary" @click="openCreate">Add service</Button>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <DataTable
        :columns="columns"
        :data="services"
        :actions="true"
        row-key="id"
      >
        <template #cell-image="{ row }">
          <img
            :src="row.image || '/placeholder.png'"
            :alt="row.name"
            class="w-12 h-12 object-cover rounded"
            @error="($event.target as HTMLImageElement).src = '/placeholder.png'"
          />
        </template>
        <template #cell-name="{ row }">
          <span class="font-medium text-gray-900">{{ row.name }}</span>
        </template>
        <template #cell-type="{ row }">
          <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getTypeBadgeClass(row.type)">
            {{ row.type }}
          </span>
        </template>
        <template #cell-price="{ row }">
          {{ formatPrice(row.price) }}
        </template>
        <template #cell-scope="{ row }">
          <span v-if="row.product?.name" class="text-gray-700">{{ row.product.name }}</span>
          <span v-else-if="row.category?.name" class="text-gray-700">{{ row.category.name }}</span>
          <span v-else class="text-gray-500">Standalone</span>
        </template>
        <template #cell-isActive="{ row }">
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
          >
            {{ row.isActive ? 'Active' : 'Inactive' }}
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
            class="text-red-600 hover:text-red-800 font-medium"
            @click="deleteService(row)"
          >
            Delete
          </button>
        </template>
      </DataTable>

      <div v-if="pagination && pagination.pages > 1" class="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
        <p class="text-sm text-gray-600">
          Page {{ pagination.page }} of {{ pagination.pages }} ({{ pagination.total }} total)
        </p>
        <div class="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            :disabled="pagination.page <= 1"
            @click="goToPage(pagination.page - 1)"
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            :disabled="pagination.page >= pagination.pages"
            @click="goToPage(pagination.page + 1)"
          >
            Next
          </Button>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">
            {{ editingService ? 'Edit service' : 'Add service' }}
          </h2>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="closeModal">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <AdminServiceForm
          :service="editingService"
          :api-error="formError"
          :is-saving="isSaving"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminServicesApi } from '@/api/endpoints/admin-services'
import { productsApi } from '@/api/endpoints/products'
import { useUIStore } from '@/stores/ui'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import AdminServiceForm from '@/components/admin/AdminServiceForm.vue'
import type { Service } from '@/api/types'
import type { AdminServiceCreatePayload, AdminServicesListParams } from '@/api/endpoints/admin-services'
import type { Category, Product } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const uiStore = useUIStore()
const isLoading = ref(false)
const isSaving = ref(false)
const listError = ref<string | null>(null)
const formError = ref<string | null>(null)
const services = ref<Service[]>([])
const pagination = ref<{ page: number; limit: number; total: number; pages: number } | null>(null)
const showModal = ref(false)
const editingService = ref<Service | null>(null)
const categories = ref<Category[]>([])
const products = ref<Product[]>([])

const filters = ref<AdminServicesListParams>({
  page: 1,
  limit: 20,
  type: undefined,
  productId: undefined,
  categoryId: undefined,
  isActive: undefined
})

const columns = [
  { key: 'image', label: 'Image', sortable: false },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'scope', label: 'Product / Category', sortable: false },
  { key: 'isActive', label: 'Status', sortable: true }
]

function getTypeBadgeClass(type: string) {
  const map: Record<string, string> = {
    CONSULTING: 'bg-blue-100 text-blue-800',
    REPAIR: 'bg-amber-100 text-amber-800',
    INSTALLATION: 'bg-green-100 text-green-800'
  }
  return map[type] || 'bg-gray-100 text-gray-800'
}

async function loadOptions() {
  try {
    const [catRes, prodRes] = await Promise.all([
      productsApi.getCategories(),
      productsApi.getProducts({ page: 1, limit: 500 })
    ])
    if (catRes.success && catRes.data) categories.value = catRes.data
    if (prodRes.success && prodRes.data?.data) products.value = prodRes.data.data
  } catch {
    // ignore
  }
}

async function loadList() {
  isLoading.value = true
  listError.value = null
  try {
    const response = await adminServicesApi.list(filters.value)
    if (response.success && response.data) {
      services.value = response.data
      if (response.pagination) pagination.value = response.pagination
      else pagination.value = null
    } else {
      listError.value = response.error || 'Failed to load services'
      uiStore.showNotification('error', listError.value)
      services.value = []
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to load services'
    listError.value = msg
    uiStore.showNotification('error', msg)
    services.value = []
  } finally {
    isLoading.value = false
  }
}

function applyFilters() {
  filters.value.page = 1
  loadList()
}

function clearFilters() {
  filters.value.type = undefined
  filters.value.productId = undefined
  filters.value.categoryId = undefined
  filters.value.isActive = undefined
  filters.value.page = 1
  loadList()
}

function goToPage(page: number) {
  filters.value.page = page
  loadList()
}

function openCreate() {
  editingService.value = null
  formError.value = null
  showModal.value = true
}

async function editService(service: Service) {
  formError.value = null
  showModal.value = true
  editingService.value = service
  try {
    const response = await adminServicesApi.get(service.id)
    if (response.success && response.data) editingService.value = response.data
  } catch {
    // keep row data if fetch fails
  }
}

function closeModal() {
  showModal.value = false
  editingService.value = null
  formError.value = null
}

async function handleSubmit(payload: AdminServiceCreatePayload) {
  isSaving.value = true
  formError.value = null
  try {
    if (editingService.value) {
      const response = await adminServicesApi.update(editingService.value.id, payload)
      if (response.success) {
        uiStore.showNotification('success', 'Service updated')
        closeModal()
        await loadList()
      } else {
        formError.value = response.error || 'Update failed'
        uiStore.showNotification('error', formError.value)
      }
    } else {
      const response = await adminServicesApi.create(payload)
      if (response.success) {
        uiStore.showNotification('success', 'Service created')
        closeModal()
        await loadList()
      } else {
        formError.value = response.error || 'Create failed'
        uiStore.showNotification('error', formError.value)
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Request failed'
    formError.value = msg
    uiStore.showNotification('error', msg)
  } finally {
    isSaving.value = false
  }
}

async function deleteService(service: Service) {
  if (!confirm(`Delete "${service.name}"? This cannot be undone.`)) return
  try {
    const response = await adminServicesApi.delete(service.id)
    if (response.success) {
      uiStore.showNotification('success', 'Service deleted')
      await loadList()
      closeModal()
    } else {
      uiStore.showNotification('error', response.error || 'Delete failed')
    }
  } catch (err: unknown) {
    uiStore.showNotification('error', err instanceof Error ? err.message : 'Delete failed')
  }
}

onMounted(() => {
  loadOptions()
  loadList()
})
</script>
