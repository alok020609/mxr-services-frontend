<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">My Products</h1>
      <div class="flex items-center space-x-4">
        <Button
          variant="secondary"
          @click="viewMode = viewMode === 'table' ? 'excel' : 'table'"
        >
          {{ viewMode === 'table' ? 'Excel View' : 'Table View' }}
        </Button>
        <Button variant="secondary" @click="$router.push({ name: 'VendorImportProducts' })">
          Import Products
        </Button>
        <Button variant="secondary" @click="showExportModal = true">
          Export Products
        </Button>
        <Button v-if="viewMode === 'table'" variant="primary" @click="showCreateModal = true">
          Add Product
        </Button>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="mb-6 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="input"
          @input="handleSearch"
        />
      </div>
      <div>
        <select v-model="statusFilter" @change="loadProducts" class="input">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="mb-4 flex items-center text-gray-600">
      <LoadingSpinner size="sm" />
      <span class="ml-2">Loading products...</span>
    </div>
    
    <!-- Excel Grid Editor -->
    <ProductGridEditor
      v-if="viewMode === 'excel'"
      :products="products"
      :is-vendor="true"
      :categories="categories"
      @save="handleGridSave"
    />
    
    <!-- Products Table -->
    <template v-else>
      <div v-if="products.length === 0 && !isLoading" class="text-center py-12 border rounded-lg">
        <p class="text-gray-500">No products found</p>
        <Button variant="primary" class="mt-4" @click="showCreateModal = true">
          Add Your First Product
        </Button>
      </div>
      
      <DataTable
        v-else
        :columns="columns"
        :data="products"
        :actions="true"
        row-key="id"
      >
      <template #cell-price="{ value }">
        {{ formatCurrency(value) }}
      </template>
      <template #cell-status="{ value, row }">
        <select
          :value="value"
          @change="updateProductStatus(row.id, ($event.target as HTMLSelectElement).value)"
          :class="getStatusClass(value)"
          class="px-2 py-1 rounded text-xs border-0 cursor-pointer"
          @click.stop
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
      </template>
      <template #actions="{ row }">
        <div class="flex items-center space-x-2">
          <button @click="editProduct(row)" class="text-primary-600 hover:text-primary-800 text-sm">Edit</button>
          <button @click="deleteProduct(row.id)" class="text-red-600 hover:text-red-800 text-sm">Delete</button>
        </div>
        </template>
      </DataTable>
    </template>
    
    <!-- Create/Edit Product Modal -->
    <div
      v-if="showCreateModal || editingProduct"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4">
          {{ editingProduct ? 'Edit Product' : 'Create Product' }}
        </h2>
        <ProductForm
          :product="editingProduct"
          :is-vendor="true"
          @submit="handleProductSubmit"
          @cancel="closeModal"
        />
      </div>
    </div>
    
    
    <!-- Export Modal -->
    <ExportModal
      :is-open="showExportModal"
      @close="showExportModal = false"
      @success="handleExportSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { vendorApi } from '@/api/endpoints/vendor'
import { useUIStore } from '@/stores/ui'
import { extractErrorMessage, getValidationErrors } from '@/utils/errorHandler'
import type { AxiosError } from 'axios'
import { sendToTerminal } from '@/utils/apiLogger'
import { normalizeProducts, extractPaginatedData } from '@/utils/dataNormalizer'
import { formatCurrency } from '@/utils/formatters'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import ProductForm from '@/components/products/ProductForm.vue'
import ProductGridEditor from '@/components/products/ProductGridEditor.vue'
import ExportModal from '@/components/admin/ExportModal.vue'
import { productsApi } from '@/api/endpoints/products'
import type { Product, Category } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const isProcessing = ref(false)
const products = ref<Product[]>([])
const showCreateModal = ref(false)
const showExportModal = ref(false)
const editingProduct = ref<Product | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const viewMode = ref<'table' | 'excel'>('table')
const categories = ref<Category[]>([])

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'sku', label: 'SKU', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
]

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    draft: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const loadProducts = async () => {
  isLoading.value = true
  try {
    const response = await vendorApi.getProducts()
    sendToTerminal('log', '[Vendor Products] API Response:', response)
    
    if (response && response.success !== false) {
      let productsData: any[] = []
      
      if (Array.isArray(response.data)) {
        productsData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        productsData = response.data.data
      } else {
        const extracted = extractPaginatedData<Product>(response)
        productsData = extracted.data || []
      }
      
      if (productsData && productsData.length > 0) {
        products.value = normalizeProducts(productsData)
        
        // Apply filters
        if (statusFilter.value) {
          products.value = products.value.filter(p => p.status === statusFilter.value)
        }
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          products.value = products.value.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.sku.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query)
          )
        }
      } else {
        products.value = []
      }
    } else {
      products.value = []
      uiStore.showNotification('error', response?.error || 'Failed to load products')
    }
  } catch (error) {
    uiStore.showNotification('error', 'Failed to load products')
    sendToTerminal('error', '[Vendor Products] Error loading products:', error)
    products.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  loadProducts()
}

const editProduct = (product: Product) => {
  editingProduct.value = product
}

const closeModal = () => {
  showCreateModal.value = false
  editingProduct.value = null
}

const handleProductSubmit = async (productData: any) => {
  isLoading.value = true
  try {
    let response
    if (editingProduct.value) {
      // Update existing product
      response = await vendorApi.updateProduct(editingProduct.value.id, productData)
      sendToTerminal('log', '[Vendor Products] Update response:', response)
    } else {
      // Create new product
      response = await vendorApi.createProduct(productData)
      sendToTerminal('log', '[Vendor Products] Create response:', response)
    }
    
    if (response.success) {
      uiStore.showNotification('success', editingProduct.value ? 'Product updated successfully' : 'Product created successfully')
      closeModal()
      await loadProducts()
    } else {
      // Use UI store for consistent error display
      const errorMessage = response.error || 'Failed to save product'
      uiStore.showNotification('error', errorMessage)
    }
  } catch (error: any) {
    const axiosError = error as AxiosError
    // Use centralized error handling
    uiStore.showApiError(axiosError, 'Failed to save product')
    
    // Extract validation errors if present
    const validationErrors = getValidationErrors(axiosError)
    if (validationErrors) {
      // Show validation errors notification
      uiStore.showValidationErrors(validationErrors)
    }
    
    sendToTerminal('error', '[Vendor Products] Error saving product:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteProduct = async (id: string) => {
  if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return
  
  isLoading.value = true
  try {
    const response = await vendorApi.deleteProduct(id)
    sendToTerminal('log', '[Vendor Products] Delete response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Product deleted successfully')
      await loadProducts()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete product')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete product')
    sendToTerminal('error', '[Vendor Products] Error deleting product:', error)
  } finally {
    isLoading.value = false
  }
}

const updateProductStatus = async (productId: string, newStatus: string) => {
  try {
    const response = await vendorApi.updateProduct(productId, { status: newStatus })
    sendToTerminal('log', '[Vendor Products] Update status response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Product status updated successfully')
      await loadProducts()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update product status')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update product status')
    sendToTerminal('error', '[Vendor Products] Error updating product status:', error)
  }
}

const handleImportSuccess = () => {
  setTimeout(() => {
    loadProducts()
  }, 2000)
}

const handleExportSuccess = () => {
  showExportModal.value = false
}

const handleGridSave = () => {
  loadProducts()
}

const loadCategories = async () => {
  try {
    const response = await productsApi.getCategories()
    if (response.success && response.data) {
      categories.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

onMounted(async () => {
  await loadCategories()
  await loadProducts()
})
</script>

