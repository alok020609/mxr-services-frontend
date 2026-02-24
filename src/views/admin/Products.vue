<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Product Management</h1>
      <div class="flex items-center space-x-4">
        <Button
          variant="secondary"
          @click="viewMode = viewMode === 'table' ? 'excel' : 'table'"
        >
          {{ viewMode === 'table' ? 'Excel View' : 'Table View' }}
        </Button>
        <Button variant="secondary" @click="$router.push({ name: 'AdminImportProducts' })">
          Import Products
        </Button>
        <Button variant="secondary" @click="showExportModal = true">
          Export Products
        </Button>
        <Button
          v-if="selectedProducts.length > 0 && viewMode === 'table'"
          variant="secondary"
          @click="showBulkActions = true"
        >
          Bulk Actions ({{ selectedProducts.length }})
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
      <div>
        <select v-model="categoryFilter" @change="loadProducts" class="input">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <input
          v-model.number="priceRange.min"
          type="number"
          step="0.01"
          placeholder="Min Price"
          class="input"
          @input="loadProducts"
        />
        <input
          v-model.number="priceRange.max"
          type="number"
          step="0.01"
          placeholder="Max Price"
          class="input"
          @input="loadProducts"
        />
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
      :is-vendor="false"
      :categories="categories"
      @save="handleGridSave"
    />
    
    <!-- Products Table -->
    <template v-else>
      <div v-if="products.length === 0 && !isLoading" class="text-center py-12 border rounded-lg">
        <p class="text-gray-500">No products found</p>
      </div>
      
      <DataTable
        v-else
        :key="`products-${featuredProductIds.length}-${products.length}`"
        :columns="columns"
        :data="filteredProducts"
        :actions="true"
        row-key="id"
        :selectable="true"
        @selection-change="handleSelectionChange"
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
        <template #cell-featured="{ row }">
          <span 
            v-if="isFeatured(row.id)" 
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
          >
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </span>
          <span v-else class="text-gray-400 text-xs">—</span>
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
            :is-vendor="false"
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
    
    <!-- Bulk Actions Modal -->
    <div
      v-if="showBulkActions"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showBulkActions = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 class="text-2xl font-bold mb-4">Bulk Actions</h2>
        <div class="space-y-4">
          <p class="text-gray-600">{{ selectedProducts.length }} product(s) selected</p>
          <div class="space-y-2">
            <Button
              variant="secondary"
              class="w-full"
              @click="handleBulkStatusUpdate"
            >
              Update Status
            </Button>
            <Button
              variant="primary"
              class="w-full"
              @click="handleSetFeatured"
            >
              Set as Featured Products
            </Button>
            <Button
              variant="danger"
              class="w-full"
              @click="handleBulkDelete"
            >
              Delete Selected
            </Button>
          </div>
          <div class="flex justify-end space-x-4 mt-6">
            <Button variant="secondary" @click="showBulkActions = false">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { productsApi } from '@/api/endpoints/products'
import { operationalApi } from '@/api/endpoints/operational'
import { productManagementApi } from '@/api/endpoints/product-management'
import { useUIStore } from '@/stores/ui'
import { extractErrorMessage, getValidationErrors } from '@/utils/errorHandler'
import type { AxiosError } from 'axios'
import { sendToTerminal } from '@/utils/apiLogger'
import { normalizeProducts, extractPaginatedData } from '@/utils/dataNormalizer'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import DataTable from '@/components/admin/DataTable.vue'

const { formatPrice: formatCurrency } = usePriceFormatter()
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import ProductForm from '@/components/products/ProductForm.vue'
import ProductGridEditor from '@/components/products/ProductGridEditor.vue'
import ExportModal from '@/components/admin/ExportModal.vue'
import type { Product, Category } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const isProcessing = ref(false)
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const showCreateModal = ref(false)
const showExportModal = ref(false)
const showBulkActions = ref(false)
const editingProduct = ref<Product | null>(null)
const selectedProducts = ref<string[]>([])
const featuredProductIds = ref<string[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const priceRange = ref({ min: undefined as number | undefined, max: undefined as number | undefined })
const viewMode = ref<'table' | 'excel'>('table')

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'sku', label: 'SKU', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'featured', label: 'Featured', sortable: false }
]

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    draft: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const filteredProducts = computed(() => {
  let filtered = [...products.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(p => p.status === statusFilter.value)
  }
  
  if (categoryFilter.value) {
    filtered = filtered.filter(p => p.categoryId === categoryFilter.value)
  }
  
  if (priceRange.value.min !== undefined) {
    filtered = filtered.filter(p => p.price >= priceRange.value.min!)
  }
  
  if (priceRange.value.max !== undefined) {
    filtered = filtered.filter(p => p.price <= priceRange.value.max!)
  }
  
  return filtered
})

// Function to check if a product is featured (reactive to featuredProductIds changes)
const isFeatured = (productId: string) => {
  // Access featuredProductIds.value to ensure reactivity
  const ids = featuredProductIds.value
  return ids.includes(productId)
}

const handleSelectionChange = (selected: string[]) => {
  selectedProducts.value = selected
}

const handleSearch = () => {
  // Filtering is handled by computed property
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

const loadFeaturedProducts = async () => {
  try {
    const response = await productManagementApi.getFeaturedProducts()
    console.log('Get featured products response:', response)
    
    if (response.success && response.data) {
      // Backend returns data as array directly, or as object with products property
      let products: Product[] = []
      
      if (Array.isArray(response.data)) {
        // Data is directly an array
        products = response.data
      } else if (response.data.products && Array.isArray(response.data.products)) {
        // Data is object with products property
        products = response.data.products
      }
      
      const productIds = products.map((p: Product) => p.id)
      // Force reactivity update by creating new array
      featuredProductIds.value = [...productIds]
      console.log('Loaded featured products IDs:', featuredProductIds.value, 'Count:', featuredProductIds.value.length)
    } else {
      console.warn('No featured products data in response:', response)
      featuredProductIds.value = []
    }
  } catch (error) {
    // Silently fail - featured products are optional
    console.error('Failed to load featured products:', error)
    featuredProductIds.value = []
  }
}

const handleSetFeatured = async () => {
  if (selectedProducts.value.length === 0) return
  
  isProcessing.value = true
  try {
    const response = await productManagementApi.setFeaturedProducts(selectedProducts.value)
    console.log('Set featured response:', response)
    
    if (response.success) {
      // The backend returns { success: true, message: "..." } without data
      // So we need to fetch the updated featured products list
      uiStore.showNotification('success', `Set ${selectedProducts.value.length} product(s) as featured!`)
      showBulkActions.value = false
      selectedProducts.value = []
      
      // Reload featured products to get the updated list
      await loadFeaturedProducts()
      
      console.log('Featured products reloaded, current IDs:', featuredProductIds.value)
    } else {
      uiStore.showNotification('error', response.error || 'Failed to set featured products')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to set featured products')
    console.error('Failed to set featured products:', error)
  } finally {
    isProcessing.value = false
  }
}

const loadProducts = async () => {
  isLoading.value = true
  try {
    const response = await productsApi.getProducts({ page: 1, limit: 100 })
    sendToTerminal('log', '[Products] API Response:', response)
    console.log('[Products] Raw API Response:', response)
    
    if (response && response.success !== false) {
      let productsData: any[] = []
      
      if (Array.isArray(response.data)) {
        productsData = response.data
        sendToTerminal('log', '[Products] Data is direct array, length:', productsData.length)
      } else if (response.data && Array.isArray(response.data.data)) {
        productsData = response.data.data
        sendToTerminal('log', '[Products] Data is nested array, length:', productsData.length)
      } else {
        const extracted = extractPaginatedData<Product>(response)
        productsData = extracted.data || []
        sendToTerminal('log', '[Products] Using extractPaginatedData, length:', productsData.length)
      }
      
      if (productsData && productsData.length > 0) {
        products.value = normalizeProducts(productsData)
        sendToTerminal('log', '[Products] Normalized products:', products.value)
        console.log('[Products] Normalized products:', products.value)
      } else {
        products.value = []
        sendToTerminal('warn', '[Products] No products data found')
      }
    } else {
      sendToTerminal('warn', '[Products] Response success is false:', response)
      products.value = []
      uiStore.showNotification('error', response?.error || 'Failed to load products')
    }
  } catch (error) {
    uiStore.showNotification('error', 'Failed to load products')
    sendToTerminal('error', '[Products] Error loading products:', error)
    console.error('[Products] Error:', error)
    products.value = []
  } finally {
    isLoading.value = false
    console.log('[Products] Final products array length:', products.value.length)
  }
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
      response = await productsApi.updateProduct(editingProduct.value.id, productData)
      sendToTerminal('log', '[Products] Update response:', response)
    } else {
      // Create new product
      response = await productsApi.createProduct(productData)
      sendToTerminal('log', '[Products] Create response:', response)
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
    
    sendToTerminal('error', '[Products] Error saving product:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteProduct = async (id: string) => {
  if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return
  
  isLoading.value = true
  try {
    const response = await productsApi.deleteProduct(id)
    sendToTerminal('log', '[Products] Delete response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Product deleted successfully')
      await loadProducts()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete product')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete product')
    sendToTerminal('error', '[Products] Error deleting product:', error)
  } finally {
    isLoading.value = false
  }
}

const updateProductStatus = async (productId: string, newStatus: string) => {
  try {
    const response = await productsApi.updateProduct(productId, { status: newStatus })
    sendToTerminal('log', '[Products] Update status response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Product status updated successfully')
      await loadProducts()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update product status')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update product status')
    sendToTerminal('error', '[Products] Error updating product status:', error)
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

const handleBulkStatusUpdate = async () => {
  const newStatus = prompt('Enter new status (active/inactive/draft):')
  if (!newStatus || !['active', 'inactive', 'draft'].includes(newStatus)) {
    return
  }
  
  isProcessing.value = true
  try {
    const updates = selectedProducts.value.map(id => ({
      id,
      status: newStatus
    }))
    
    const response = await operationalApi.bulkProducts('update', updates)
    
    if (response.success) {
      uiStore.showNotification('success', `Updated ${selectedProducts.value.length} product(s)`)
      selectedProducts.value = []
      showBulkActions.value = false
      await loadProducts()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update products')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update products')
  } finally {
    isProcessing.value = false
  }
}

const handleBulkDelete = async () => {
  if (!confirm(`Are you sure you want to delete ${selectedProducts.value.length} product(s)? This action cannot be undone.`)) {
    return
  }
  
  isProcessing.value = true
  try {
    const response = await operationalApi.bulkProducts('delete', selectedProducts.value.map(id => ({ id })))
    
    if (response.success) {
      uiStore.showNotification('success', `Deleted ${selectedProducts.value.length} product(s)`)
      selectedProducts.value = []
      showBulkActions.value = false
      await loadProducts()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete products')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete products')
  } finally {
    isProcessing.value = false
  }
}

const handleGridSave = () => {
  loadProducts()
}

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadProducts(),
    loadFeaturedProducts()
  ])
})
</script>

