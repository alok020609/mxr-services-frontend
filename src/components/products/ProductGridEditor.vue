<template>
  <div class="product-grid-editor">
    <!-- Toolbar -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-4">
        <Button variant="secondary" @click="addNewRow">
          + Add Row
        </Button>
        <Button variant="secondary" @click="handleCopy">
          Copy
        </Button>
        <Button variant="secondary" @click="handlePaste">
          Paste
        </Button>
      </div>
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600">
          {{ modifiedRows.length }} modified, {{ newRows.length }} new
        </span>
        <Button variant="primary" @click="handleSave" :loading="isSaving">
          Save Changes
        </Button>
      </div>
    </div>
    
    <!-- Grid Container -->
    <div class="border rounded-lg overflow-auto max-h-[600px]">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Header Row -->
        <thead class="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">#</th>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r"
              :style="{ minWidth: column.width || '150px' }"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <!-- Data Rows -->
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, rowIndex) in gridData"
            :key="rowIndex"
            :class="[
              'hover:bg-gray-50',
              row._isNew ? 'bg-green-50' : '',
              row._isModified ? 'bg-yellow-50' : ''
            ]"
          >
            <td class="px-4 py-2 text-sm text-gray-500 border-r">{{ rowIndex + 1 }}</td>
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-2 border-r"
              @click="selectCell(rowIndex, column.key)"
            >
              <!-- Editable Cell -->
              <input
                v-if="column.editable && column.key !== 'images'"
                :ref="el => setCellRef(el, rowIndex, column.key)"
                :value="getCellValue(row, column.key)"
                :type="column.type || 'text'"
                :step="column.type === 'number' ? '0.01' : undefined"
                class="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-transparent"
                :class="getCellError(rowIndex, column.key) ? 'bg-red-50' : ''"
                @input="updateCell(rowIndex, column.key, ($event.target as HTMLInputElement).value)"
                @keydown="handleKeydown($event, rowIndex, column.key)"
              />
              <!-- Category Dropdown -->
              <select
                v-else-if="column.key === 'categoryId'"
                :value="getCellValue(row, column.key)"
                class="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-transparent"
                @change="updateCell(rowIndex, column.key, ($event.target as HTMLSelectElement).value)"
                @keydown="handleKeydown($event, rowIndex, column.key)"
              >
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <!-- Status Dropdown -->
              <select
                v-else-if="column.key === 'status'"
                :value="getCellValue(row, column.key)"
                class="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-transparent"
                @change="updateCell(rowIndex, column.key, ($event.target as HTMLSelectElement).value)"
                @keydown="handleKeydown($event, rowIndex, column.key)"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
              <!-- Image Upload Cell -->
              <div v-else-if="column.key === 'images'" class="flex items-center space-x-2">
                <input
                  ref="imageInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUpload($event, rowIndex)"
                />
                <button
                  type="button"
                  @click="triggerImageUpload(rowIndex)"
                  class="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Upload
                </button>
                <div v-if="getCellValue(row, column.key)" class="flex-1">
                  <img
                    :src="getCellValue(row, column.key)"
                    alt="Product image"
                    class="h-10 w-10 object-cover rounded"
                  />
                </div>
                <span v-if="row._imageUploading" class="text-xs text-gray-500">Uploading...</span>
              </div>
              <!-- Read-only Cell (ID) -->
              <span v-else class="px-2 py-1 text-sm text-gray-600">
                {{ getCellValue(row, column.key) || '-' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Error Messages -->
    <div v-if="errors.length > 0" class="mt-4">
      <div
        v-for="(error, index) in errors"
        :key="index"
        class="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm mb-2"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { mediaApi } from '@/api/endpoints/media'
import { productsApi } from '@/api/endpoints/products'
import { vendorApi } from '@/api/endpoints/vendor'
import { useUIStore } from '@/stores/ui'
import Button from '@/components/common/Button.vue'
import type { Product, Category } from '@/api/types'

interface GridRow extends Partial<Product> {
  _isNew?: boolean
  _isModified?: boolean
  _imageUploading?: boolean
}

const props = defineProps<{
  products: Product[]
  isVendor?: boolean
  categories: Category[]
}>()

const emit = defineEmits<{
  'save': [changes: any[]]
  'row-added': [rowIndex: number]
  'row-deleted': [rowIndex: number]
}>()

const uiStore = useUIStore()
const gridData = ref<GridRow[]>([])
const cellRefs = ref<Map<string, HTMLInputElement>>(new Map())
const imageInput = ref<HTMLInputElement>()
const selectedCell = ref<{ row: number; col: string } | null>(null)
const isSaving = ref(false)
const errors = ref<string[]>([])
const clipboard = ref<string>('')

const columns = [
  { key: 'id', label: 'ID', editable: false, width: '100px' },
  { key: 'name', label: 'Name', editable: true, width: '200px' },
  { key: 'description', label: 'Description', editable: true, width: '250px' },
  { key: 'price', label: 'Price', editable: true, type: 'number', width: '120px' },
  { key: 'sku', label: 'SKU', editable: true, width: '150px' },
  { key: 'stock', label: 'Stock', editable: true, type: 'number', width: '100px' },
  { key: 'categoryId', label: 'Category', editable: true, width: '150px' },
  { key: 'status', label: 'Status', editable: true, width: '120px' },
  { key: 'compareAtPrice', label: 'Compare At Price', editable: true, type: 'number', width: '150px' },
  { key: 'tags', label: 'Tags', editable: true, width: '150px' },
  { key: 'images', label: 'Images', editable: false, width: '200px' }
]

const modifiedRows = computed(() => {
  return gridData.value.filter(row => row._isModified && !row._isNew)
})

const newRows = computed(() => {
  return gridData.value.filter(row => row._isNew)
})

const setCellRef = (el: any, rowIndex: number, colKey: string) => {
  if (el) {
    cellRefs.value.set(`${rowIndex}-${colKey}`, el)
  }
}

const getCellValue = (row: GridRow, key: string): any => {
  if (key === 'images' && Array.isArray(row.images)) {
    return row.images[0] || ''
  }
  return row[key as keyof GridRow] || ''
}

const getCellError = (rowIndex: number, colKey: string): boolean => {
  const row = gridData.value[rowIndex]
  if (!row) return false
  
  // Basic validation
  if (colKey === 'name' && !row.name) return true
  if (colKey === 'price' && (row.price === undefined || row.price <= 0)) return true
  if (colKey === 'stock' && row.stock !== undefined && row.stock < 0) return true
  if (colKey === 'sku' && !row.sku) return true
  if (colKey === 'categoryId' && !row.categoryId) return true
  
  return false
}

const updateCell = (rowIndex: number, colKey: string, value: any) => {
  const row = gridData.value[rowIndex]
  if (!row) return
  
  // Convert value based on type
  if (colKey === 'price' || colKey === 'stock' || colKey === 'compareAtPrice') {
    value = value === '' ? undefined : Number(value)
  }
  
  // Mark as modified if not new
  if (!row._isNew && row.id) {
    row._isModified = true
  }
  
  // Update the cell value
  if (colKey === 'images') {
    if (!row.images) row.images = []
    if (Array.isArray(row.images)) {
      row.images[0] = value
    } else {
      row.images = [value]
    }
  } else {
    (row as any)[colKey] = value
  }
}

const selectCell = (rowIndex: number, colKey: string) => {
  selectedCell.value = { row: rowIndex, col: colKey }
  nextTick(() => {
    const cell = cellRefs.value.get(`${rowIndex}-${colKey}`)
    if (cell) {
      cell.focus()
      cell.select()
    }
  })
}

const handleKeydown = (event: KeyboardEvent, rowIndex: number, colKey: string) => {
  const currentIndex = columns.findIndex(c => c.key === colKey)
  
  if (event.key === 'Tab') {
    event.preventDefault()
    if (event.shiftKey) {
      // Previous cell
      if (currentIndex > 0) {
        selectCell(rowIndex, columns[currentIndex - 1].key)
      } else if (rowIndex > 0) {
        selectCell(rowIndex - 1, columns[columns.length - 1].key)
      }
    } else {
      // Next cell
      if (currentIndex < columns.length - 1) {
        selectCell(rowIndex, columns[currentIndex + 1].key)
      } else if (rowIndex < gridData.value.length - 1) {
        selectCell(rowIndex + 1, columns[0].key)
      }
    }
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (rowIndex < gridData.value.length - 1) {
      selectCell(rowIndex + 1, colKey)
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (rowIndex < gridData.value.length - 1) {
      selectCell(rowIndex + 1, colKey)
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (rowIndex > 0) {
      selectCell(rowIndex - 1, colKey)
    }
  } else if (event.ctrlKey && event.key === 'c') {
    // Copy
    event.preventDefault()
    handleCopy()
  } else if (event.ctrlKey && event.key === 'v') {
    // Paste
    event.preventDefault()
    handlePaste()
  }
}

const addNewRow = () => {
  const newRow: GridRow = {
    _isNew: true,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    categoryId: '',
    status: 'draft',
    images: []
  }
  gridData.value.push(newRow)
  emit('row-added', gridData.value.length - 1)
  nextTick(() => {
    selectCell(gridData.value.length - 1, 'name')
  })
}

const triggerImageUpload = (rowIndex: number) => {
  // Create a file input for this specific row
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => handleImageUpload(e, rowIndex)
  input.click()
}

const handleImageUpload = async (event: Event, rowIndex: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  const row = gridData.value[rowIndex]
  if (!row) return
  
  row._imageUploading = true
  
  try {
    const response = await mediaApi.uploadImage(file, {
      folder: 'products',
      optimize: true
    })
    
    if (response.success && response.data) {
      updateCell(rowIndex, 'images', response.data.url)
      row._imageUploading = false
    } else {
      throw new Error(response.error || 'Upload failed')
    }
  } catch (error: any) {
    row._imageUploading = false
    uiStore.showNotification('error', error.message || 'Failed to upload image')
  }
}

const handleCopy = () => {
  if (!selectedCell.value) return
  
  const row = gridData.value[selectedCell.value.row]
  if (!row) return
  
  const value = getCellValue(row, selectedCell.value.col)
  clipboard.value = String(value || '')
}

const handlePaste = () => {
  if (!selectedCell.value || !clipboard.value) return
  
  updateCell(selectedCell.value.row, selectedCell.value.col, clipboard.value)
}

const handleSave = async () => {
  errors.value = []
  isSaving.value = true
  
  try {
    const changes: any[] = []
    
    // Process new rows
    for (const row of newRows.value) {
      if (!row.name || !row.sku || !row.categoryId) {
        errors.value.push(`Row ${gridData.value.indexOf(row) + 1}: Missing required fields`)
        continue
      }
      
      changes.push({
        type: 'create',
        data: {
          name: row.name,
          description: row.description || '',
          price: row.price || 0,
          stock: row.stock || 0,
          sku: row.sku,
          categoryId: row.categoryId,
          status: row.status || 'draft',
          compareAtPrice: row.compareAtPrice,
          tags: row.tags ? String(row.tags).split(',').map(t => t.trim()) : [],
          images: Array.isArray(row.images) ? row.images.filter(Boolean) : []
        }
      })
    }
    
    // Process modified rows
    for (const row of modifiedRows.value) {
      if (!row.id) continue
      
      changes.push({
        type: 'update',
        id: row.id,
        data: {
          name: row.name,
          description: row.description,
          price: row.price,
          stock: row.stock,
          sku: row.sku,
          categoryId: row.categoryId,
          status: row.status,
          compareAtPrice: row.compareAtPrice,
          tags: row.tags ? String(row.tags).split(',').map(t => t.trim()) : [],
          images: Array.isArray(row.images) ? row.images.filter(Boolean) : []
        }
      })
    }
    
    // Save changes
    const results = await Promise.allSettled(
      changes.map(async (change) => {
        if (change.type === 'create') {
          if (props.isVendor) {
            return await vendorApi.createProduct(change.data)
          } else {
            return await productsApi.createProduct(change.data)
          }
        } else {
          if (props.isVendor) {
            return await vendorApi.updateProduct(change.id, change.data)
          } else {
            return await productsApi.updateProduct(change.id, change.data)
          }
        }
      })
    )
    
    const failed = results.filter(r => r.status === 'rejected')
    if (failed.length > 0) {
      errors.value.push(`${failed.length} operation(s) failed`)
    } else {
      uiStore.showNotification('success', 'All changes saved successfully')
      emit('save', changes)
      
      // Reset modification flags
      gridData.value.forEach(row => {
        row._isModified = false
        row._isNew = false
      })
    }
  } catch (error: any) {
    errors.value.push(error.message || 'Failed to save changes')
    uiStore.showNotification('error', 'Failed to save changes')
  } finally {
    isSaving.value = false
  }
}

// Initialize grid data
onMounted(() => {
  gridData.value = props.products.map(product => ({
    ...product,
    _isNew: false,
    _isModified: false
  }))
})
</script>

<style scoped>
.product-grid-editor {
  @apply w-full;
}

.product-grid-editor table {
  @apply border-collapse;
}

.product-grid-editor th,
.product-grid-editor td {
  @apply border border-gray-300;
}
</style>

