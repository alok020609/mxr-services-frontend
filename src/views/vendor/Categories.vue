<template>
  <div class="space-y-6">
    <!-- Modern Header Section -->
    <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 flex items-center">
            <svg class="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Category Management
          </h1>
          <p class="text-indigo-100">Manage product categories and subcategories</p>
        </div>
        <div class="flex items-center space-x-3">
          <Button 
            variant="primary" 
            @click="showCreateModal = true"
            class="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg"
          >
            <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Categories</p>
            <p class="text-2xl font-bold text-gray-900">{{ categories.length }}</p>
          </div>
          <div class="bg-blue-100 rounded-full p-3">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Top-Level Categories</p>
            <p class="text-2xl font-bold text-gray-900">{{ topLevelCategoriesCount }}</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Subcategories</p>
            <p class="text-2xl font-bold text-gray-900">{{ subcategoriesCount }}</p>
          </div>
          <div class="bg-purple-100 rounded-full p-3">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V7a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Categories with Images</p>
            <p class="text-2xl font-bold text-gray-900">{{ categoriesWithImagesCount }}</p>
          </div>
          <div class="bg-orange-100 rounded-full p-3">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filters and Search Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Categories</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or slug..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              @input="handleSearch"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Parent Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Parent</label>
          <select 
            v-model="parentFilter" 
            @change="handleSearch" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="">All Categories</option>
            <option value="top-level">Top-Level Only</option>
            <option value="subcategories">Subcategories Only</option>
            <option 
              v-for="category in topLevelCategories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
        <span class="text-sm text-gray-600 font-medium">Active filters:</span>
        <span v-if="parentFilter" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
          Parent: {{ getParentFilterLabel() }}
          <button @click="clearFilter('parent')" class="hover:text-blue-900 font-bold">×</button>
        </span>
        <span v-if="searchQuery" class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2">
          Search: {{ searchQuery }}
          <button @click="clearSearch" class="hover:text-purple-900 font-bold">×</button>
        </span>
        <button @click="clearAllFilters" class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors">
          Clear All
        </button>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
      <LoadingSpinner size="md" />
      <span class="ml-3 text-gray-600">Loading categories...</span>
    </div>
    
    <!-- Error Message -->
    <div v-if="lastError && !isLoading" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-semibold text-red-800">Error Loading Categories</p>
          <p class="text-sm text-red-600">{{ lastError }}</p>
        </div>
      </div>
    </div>
    
    <!-- Categories Table -->
    <div v-if="!isLoading && !lastError" class="bg-white rounded-lg shadow-md overflow-hidden">
      <DataTable
        :columns="columns"
        :data="filteredCategories"
        :actions="true"
        row-key="id"
      >
        <template #cell-name="{ value, row }">
          <div class="flex items-center">
            <div v-if="row.image" class="flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden mr-3">
              <img :src="row.image" :alt="value" class="h-full w-full object-cover" />
            </div>
            <div v-else class="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">{{ value?.charAt(0)?.toUpperCase() || 'C' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-gray-900">{{ value || 'N/A' }}</div>
              <div class="text-sm text-gray-500">{{ row.slug }}</div>
            </div>
          </div>
        </template>
        
        <template #cell-description="{ value }">
          <span class="text-sm text-gray-600">{{ value || '—' }}</span>
        </template>
        
        <template #cell-parent="{ value, row }">
          <span v-if="value" class="text-sm text-gray-600">
            {{ getCategoryName(value) }}
          </span>
          <span v-else class="text-sm text-gray-400 italic">Top-level</span>
        </template>
        
        <template #cell-createdAt="{ value }">
          <span class="text-sm text-gray-600">{{ formatDate(value) }}</span>
        </template>
        
        <template #actions="{ row }">
          <div class="flex items-center space-x-2">
            <button 
              @click="editCategory(row)" 
              class="px-3 py-1 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              title="Edit Category"
            >
              Edit
            </button>
            <button 
              @click="deleteCategory(row.id)" 
              class="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
              title="Delete Category"
            >
              Delete
            </button>
          </div>
        </template>
      </DataTable>
      
      <!-- Empty State -->
      <div v-if="filteredCategories.length === 0 && !isLoading" class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <p class="mt-4 text-gray-500 font-medium text-lg">No categories found</p>
        <p class="text-sm text-gray-400 mt-1">
          <span v-if="hasActiveFilters">Try adjusting your filters</span>
          <span v-else>Get started by creating a new category</span>
        </p>
      </div>
    </div>
    
    <!-- Create/Edit Category Modal -->
    <Modal
      :is-open="showCreateModal || !!editingCategory"
      :title="editingCategory ? 'Edit Category' : 'Create New Category'"
      @close="closeModal"
    >
      <CategoryForm
        :category="editingCategory"
        @submit="handleCategorySubmit"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { productsApi } from '@/api/endpoints/products'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatDate } from '@/utils/formatters'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Modal from '@/components/common/Modal.vue'
import CategoryForm from '@/components/categories/CategoryForm.vue'
import type { Category } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const categories = ref<Category[]>([])
const showCreateModal = ref(false)
const editingCategory = ref<Category | null>(null)
const searchQuery = ref('')
const parentFilter = ref('')
const lastError = ref<string | null>(null)

const columns = [
  { key: 'name', label: 'Category', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'parent', label: 'Parent', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true }
]

const topLevelCategories = computed(() => {
  return categories.value.filter(cat => !cat.parentId)
})

const topLevelCategoriesCount = computed(() => {
  return topLevelCategories.value.length
})

const subcategoriesCount = computed(() => {
  return categories.value.filter(cat => cat.parentId).length
})

const categoriesWithImagesCount = computed(() => {
  return categories.value.filter(cat => cat.image).length
})

const filteredCategories = computed(() => {
  let filtered = [...categories.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(cat => 
      cat.name.toLowerCase().includes(query) ||
      cat.slug.toLowerCase().includes(query) ||
      (cat.description && cat.description.toLowerCase().includes(query))
    )
  }
  
  // Parent filter
  if (parentFilter.value) {
    if (parentFilter.value === 'top-level') {
      filtered = filtered.filter(cat => !cat.parentId)
    } else if (parentFilter.value === 'subcategories') {
      filtered = filtered.filter(cat => cat.parentId)
    } else {
      filtered = filtered.filter(cat => cat.parentId === parentFilter.value)
    }
  }
  
  return filtered
})

const hasActiveFilters = computed(() => {
  return !!searchQuery.value || !!parentFilter.value
})

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category?.name || categoryId
}

const getParentFilterLabel = () => {
  if (parentFilter.value === 'top-level') return 'Top-Level Only'
  if (parentFilter.value === 'subcategories') return 'Subcategories Only'
  const category = categories.value.find(cat => cat.id === parentFilter.value)
  return category?.name || parentFilter.value
}

const handleSearch = () => {
  // Filtering is handled by computed property
}

const clearFilter = (type: string) => {
  if (type === 'parent') {
    parentFilter.value = ''
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const clearAllFilters = () => {
  searchQuery.value = ''
  parentFilter.value = ''
}

const loadCategories = async () => {
  isLoading.value = true
  lastError.value = null
  try {
    const response = await productsApi.getCategories()
    sendToTerminal('log', '[Vendor Categories] API Response:', response)

    if (response.success && response.data) {
      categories.value = Array.isArray(response.data) ? response.data : []
    } else {
      lastError.value = response.error || 'Failed to load categories'
      uiStore.showNotification('error', lastError.value)
    }
  } catch (error: any) {
    lastError.value = error.message || 'Failed to load categories'
    uiStore.showNotification('error', lastError.value)
    sendToTerminal('error', '[Vendor Categories] Error loading categories:', error)
  } finally {
    isLoading.value = false
  }
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingCategory.value = null
}

const handleCategorySubmit = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
  isLoading.value = true
  try {
    let response
    if (editingCategory.value) {
      // Update existing category
      response = await productsApi.updateCategory(editingCategory.value.id, categoryData)
      sendToTerminal('log', '[Vendor Categories] Update response:', response)
      
      if (response.success) {
        uiStore.showNotification('success', 'Category updated successfully')
        closeModal()
        await loadCategories()
      } else {
        uiStore.showNotification('error', response.error || 'Failed to update category')
      }
    } else {
      // Create new category
      response = await productsApi.createCategory(categoryData)
      sendToTerminal('log', '[Vendor Categories] Create response:', response)
      
      if (response.success) {
        uiStore.showNotification('success', 'Category created successfully')
        closeModal()
        await loadCategories()
      } else {
        uiStore.showNotification('error', response.error || 'Failed to create category')
      }
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to save category')
    sendToTerminal('error', '[Vendor Categories] Error saving category:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteCategory = async (id: string) => {
  if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
    return
  }

  isLoading.value = true
  try {
    const response = await productsApi.deleteCategory(id)
    sendToTerminal('log', '[Vendor Categories] Delete response:', response)

    if (response.success) {
      uiStore.showNotification('success', 'Category deleted successfully')
      await loadCategories()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete category')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete category')
    sendToTerminal('error', '[Vendor Categories] Error deleting category:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

