<template>
  <Modal :is-open="isOpen" @close="$emit('close')">
    <template #header>
      <h2 class="text-2xl font-bold">Import Products</h2>
    </template>
    
    <template #body>
      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'file'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'file'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            File Upload
          </button>
          <button
            @click="activeTab = 'manual'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'manual'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Manual Entry
          </button>
        </nav>
      </div>

      <!-- File Upload Tab -->
      <div v-if="activeTab === 'file'" class="space-y-6">
        <!-- Sample Template Downloads -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="text-sm font-medium text-blue-900 mb-3">Download Sample Templates</h3>
          <div class="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" @click="downloadTemplate('csv')">
              <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CSV Template
            </Button>
            <Button variant="secondary" size="sm" @click="downloadTemplate('json')">
              <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download JSON Template
            </Button>
            <Button variant="secondary" size="sm" @click="downloadTemplate('xlsx')">
              <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download XLSX Template
            </Button>
          </div>
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium mb-2">Select File (CSV, JSON, XLSX)</label>
          <input
            ref="fileInput"
            type="file"
            @change="handleFileSelect"
            accept=".csv,.json,.xlsx"
            class="input"
          />
          <p class="text-xs text-gray-500 mt-1">
            Supported formats: CSV, JSON, XLSX. Max file size: 10MB
          </p>
        </div>
        
        <!-- Format Requirements -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium mb-2">Format Requirements:</h3>
          <ul class="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>CSV: Headers in first row (name, description, price, sku, stock, categoryId, status, images, compareAtPrice, tags)</li>
            <li>JSON: Array of product objects with all fields</li>
            <li>XLSX: Same structure as CSV</li>
          </ul>
        </div>
        
        <!-- Progress Indicator -->
        <div v-if="importJobId" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium">Import Status:</span>
            <span :class="getStatusClass(importStatus)" class="px-2 py-1 rounded">
              {{ importStatus || 'Processing...' }}
            </span>
          </div>
          <div v-if="importProgress > 0" class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all"
              :style="{ width: `${importProgress}%` }"
            ></div>
          </div>
          <p v-if="importProgress > 0" class="text-xs text-gray-600">
            {{ importProgress }}% complete
          </p>
        </div>
        
        <!-- Error Display -->
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>
        
        <!-- Success Display -->
        <div v-if="importResult && importStatus === 'completed'" class="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p class="text-green-700 text-sm font-medium mb-2">Import completed successfully!</p>
          <ul class="text-xs text-green-600 space-y-1">
            <li v-if="importResult.successful">Successfully imported: {{ importResult.successful }}</li>
            <li v-if="importResult.failed">Failed: {{ importResult.failed }}</li>
            <li v-if="importResult.errors && importResult.errors.length > 0">
              Errors:
              <ul class="list-disc list-inside ml-2">
                <li v-for="(err, idx) in importResult.errors.slice(0, 5)" :key="idx">{{ err }}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <!-- Manual Entry Tab -->
      <div v-if="activeTab === 'manual'" class="space-y-4">
        <!-- Toolbar -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <Button variant="secondary" size="sm" @click="addProduct">
              + Add Row
            </Button>
            <span class="text-sm text-gray-600">
              {{ manualProducts.length }} product(s)
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">
              {{ validProductsCount }} ready to create
            </span>
            <Button
              variant="primary"
              @click="createAllProducts"
              :loading="isCreatingBatch"
              :disabled="validProductsCount === 0"
            >
              Create All ({{ validProductsCount }})
            </Button>
          </div>
        </div>

        <!-- Table Structure -->
        <div v-if="manualProducts.length === 0" class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p class="text-gray-500 mb-4">No products added yet</p>
          <Button variant="secondary" @click="addProduct">
            Add Your First Product
          </Button>
        </div>

        <div v-else class="border rounded-lg overflow-auto max-h-[500px]">
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Header Row -->
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r w-12">#</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[150px]">
                  Name <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[200px]">
                  Description <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  Price <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  SKU <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[80px]">
                  Stock <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[150px]">
                  Category <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  Status
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  Compare At Price
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[120px]">
                  Tags
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[150px]">
                  Images
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-20">Actions</th>
              </tr>
            </thead>
            <!-- Data Rows -->
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(product, index) in manualProducts"
                :key="product.id"
                :class="[
                  'hover:bg-gray-50',
                  !isProductValid(product) ? 'bg-red-50' : ''
                ]"
              >
                <td class="px-3 py-2 text-sm text-gray-500 border-r">{{ index + 1 }}</td>
                
                <!-- Name -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.name"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :class="getFieldErrorClass(product, 'name')"
                    placeholder="Product name"
                    @keydown="handleKeydown($event, index, 'name')"
                  />
                </td>
                
                <!-- Description -->
                <td class="px-3 py-2 border-r">
                  <textarea
                    v-model="product.description"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    :class="getFieldErrorClass(product, 'description')"
                    rows="2"
                    placeholder="Product description"
                    @keydown="handleKeydown($event, index, 'description')"
                  ></textarea>
                </td>
                
                <!-- Price -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model.number="product.price"
                    type="number"
                    step="0.01"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :class="getFieldErrorClass(product, 'price')"
                    placeholder="0.00"
                    @keydown="handleKeydown($event, index, 'price')"
                  />
                </td>
                
                <!-- SKU -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.sku"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :class="getFieldErrorClass(product, 'sku')"
                    placeholder="SKU-001"
                    @keydown="handleKeydown($event, index, 'sku')"
                  />
                </td>
                
                <!-- Stock -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model.number="product.stock"
                    type="number"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :class="getFieldErrorClass(product, 'stock')"
                    placeholder="0"
                    @keydown="handleKeydown($event, index, 'stock')"
                  />
                </td>
                
                <!-- Category -->
                <td class="px-3 py-2 border-r">
                  <select
                    v-model="product.categoryId"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :class="getFieldErrorClass(product, 'categoryId')"
                    @keydown="handleKeydown($event, index, 'categoryId')"
                  >
                    <option value="">Select category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </td>
                
                <!-- Status -->
                <td class="px-3 py-2 border-r">
                  <select
                    v-model="product.status"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    @keydown="handleKeydown($event, index, 'status')"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                
                <!-- Compare At Price -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model.number="product.compareAtPrice"
                    type="number"
                    step="0.01"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                    @keydown="handleKeydown($event, index, 'compareAtPrice')"
                  />
                </td>
                
                <!-- Tags -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.tagsInput"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="tag1, tag2"
                    @keydown="handleKeydown($event, index, 'tagsInput')"
                  />
                </td>
                
                <!-- Images -->
                <td class="px-3 py-2 border-r">
                  <div class="flex items-center space-x-2">
                    <div v-if="product.images && product.images.length > 0" class="flex space-x-1">
                      <img
                        v-for="(img, idx) in product.images.slice(0, 2)"
                        :key="idx"
                        :src="img"
                        alt="Product image"
                        class="h-8 w-8 object-cover rounded border"
                      />
                      <span v-if="product.images.length > 2" class="text-xs text-gray-500 self-center">
                        +{{ product.images.length - 2 }}
                      </span>
                    </div>
                    <input
                      :ref="el => setImageInputRef(el, index)"
                      type="file"
                      accept="image/*"
                      multiple
                      class="hidden"
                      @change="handleImageUpload($event, index)"
                    />
                    <button
                      @click="triggerImageUpload(index)"
                      class="text-xs text-primary-600 hover:text-primary-800 px-2 py-1 border border-primary-300 rounded hover:bg-primary-50"
                    >
                      Upload
                    </button>
                  </div>
                </td>
                
                <!-- Actions -->
                <td class="px-3 py-2">
                  <button
                    @click="removeProduct(index)"
                    class="text-red-600 hover:text-red-800 text-sm"
                    title="Delete row"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Batch Create Progress & Results -->
        <div v-if="manualProducts.length > 0" class="border-t pt-4 space-y-4">
          <!-- Batch Create Progress -->
          <div v-if="batchCreateProgress.total > 0" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span>Creating products: {{ batchCreateProgress.current }} / {{ batchCreateProgress.total }}</span>
              <span>{{ Math.round((batchCreateProgress.current / batchCreateProgress.total) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary-600 h-2 rounded-full transition-all"
                :style="{ width: `${(batchCreateProgress.current / batchCreateProgress.total) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Batch Create Results -->
          <div v-if="batchCreateResults.length > 0" class="space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="(result, idx) in batchCreateResults"
              :key="idx"
              :class="[
                'p-2 rounded text-xs',
                result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              ]"
            >
              Product {{ idx + 1 }} ({{ result.product.name }}): {{ result.success ? 'Created' : result.error }}
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <template #footer>
      <div class="flex justify-end space-x-4">
        <Button variant="secondary" @click="$emit('close')" :disabled="isProcessing || isCreatingBatch">
          {{ (importStatus === 'completed' || batchCreateResults.length > 0) ? 'Close' : 'Cancel' }}
        </Button>
        <Button
          v-if="activeTab === 'file'"
          variant="primary"
          @click="handleImport"
          :loading="isProcessing"
          :disabled="!selectedFile || isProcessing"
        >
          Import
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { operationalApi } from '@/api/endpoints/operational'
import { productsApi } from '@/api/endpoints/products'
import { vendorApi } from '@/api/endpoints/vendor'
import { mediaApi } from '@/api/endpoints/media'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import Modal from '@/components/common/Modal.vue'

const { formatPrice } = usePriceFormatter()
import Button from '@/components/common/Button.vue'
import type { Category } from '@/api/types'

const props = defineProps<{
  isOpen: boolean
  isVendor?: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const uiStore = useUIStore()
const authStore = useAuthStore()
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isProcessing = ref(false)
const importJobId = ref<string | null>(null)
const importStatus = ref<string>('')
const importProgress = ref(0)
const importResult = ref<any>(null)
const error = ref<string | null>(null)
const activeTab = ref<'file' | 'manual'>('file')
const manualProducts = ref<any[]>([])
const categories = ref<Category[]>([])
const isCreatingBatch = ref(false)
const batchCreateProgress = ref({ current: 0, total: 0 })
const batchCreateResults = ref<any[]>([])
const imageInputRefs = ref<Map<string, HTMLInputElement>>(new Map())
let statusPollInterval: number | null = null

const validProductsCount = computed(() => {
  return manualProducts.value.filter(p => isProductValid(p)).length
})

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

const downloadTemplate = (format: 'csv' | 'json' | 'xlsx') => {
  let content = ''
  let filename = ''
  let mimeType = ''

  if (format === 'csv') {
    const headers = ['name', 'description', 'price', 'sku', 'stock', 'categoryId', 'status', 'images', 'compareAtPrice', 'tags']
    const example = [
      'Sample Product',
      'This is a sample product description',
      '99.99',
      'SKU-001',
      '100',
      'category-id-here',
      'active',
      'https://example.com/image1.jpg,https://example.com/image2.jpg',
      '149.99',
      'tag1, tag2, tag3'
    ]
    content = [headers.join(','), example.join(',')].join('\n')
    filename = 'products-template.csv'
    mimeType = 'text/csv'
  } else if (format === 'json') {
    const example = [{
      name: 'Sample Product',
      description: 'This is a sample product description',
      price: 99.99,
      sku: 'SKU-001',
      stock: 100,
      categoryId: 'category-id-here',
      status: 'active',
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      compareAtPrice: 149.99,
      tags: ['tag1', 'tag2', 'tag3']
    }]
    content = JSON.stringify(example, null, 2)
    filename = 'products-template.json'
    mimeType = 'application/json'
  } else if (format === 'xlsx') {
    // For XLSX, we'll create a simple CSV-like structure that can be opened in Excel
    // Note: For true XLSX, you'd need a library like xlsx, but for simplicity, we'll use CSV
    const headers = ['name', 'description', 'price', 'sku', 'stock', 'categoryId', 'status', 'images', 'compareAtPrice', 'tags']
    const example = [
      'Sample Product',
      'This is a sample product description',
      '99.99',
      'SKU-001',
      '100',
      'category-id-here',
      'active',
      'https://example.com/image1.jpg,https://example.com/image2.jpg',
      '149.99',
      'tag1, tag2, tag3'
    ]
    content = [headers.join('\t'), example.join('\t')].join('\n')
    filename = 'products-template.xlsx'
    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  
  uiStore.showNotification('success', `Template downloaded: ${filename}`)
}

const addProduct = () => {
  const newProduct = {
    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    categoryId: '',
    status: 'draft' as 'active' | 'inactive' | 'draft',
    images: [] as string[],
    compareAtPrice: undefined as number | undefined,
    tagsInput: '',
    tags: [] as string[]
  }
  manualProducts.value.push(newProduct)
}

const removeProduct = (index: number) => {
  manualProducts.value.splice(index, 1)
  batchCreateResults.value = []
}

const handleKeydown = (event: KeyboardEvent, rowIndex: number, field: string) => {
  // Tab navigation - move to next cell
  if (event.key === 'Tab') {
    event.preventDefault()
    // Simple implementation: focus next input in same row or next row
    const inputs = document.querySelectorAll(`tbody tr:nth-child(${rowIndex + 1}) input, tbody tr:nth-child(${rowIndex + 1}) select, tbody tr:nth-child(${rowIndex + 1}) textarea`)
    const currentIndex = Array.from(inputs).indexOf(event.target as HTMLElement)
    const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1
    
    if (nextIndex >= 0 && nextIndex < inputs.length) {
      (inputs[nextIndex] as HTMLElement).focus()
    } else if (nextIndex >= inputs.length && rowIndex < manualProducts.value.length - 1) {
      // Move to first input of next row
      const nextRowInputs = document.querySelectorAll(`tbody tr:nth-child(${rowIndex + 2}) input, tbody tr:nth-child(${rowIndex + 2}) select, tbody tr:nth-child(${rowIndex + 2}) textarea`)
      if (nextRowInputs.length > 0) {
        (nextRowInputs[0] as HTMLElement).focus()
      }
    }
  }
  // Enter key - move to next row same field
  else if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (rowIndex < manualProducts.value.length - 1) {
      const nextRowInputs = document.querySelectorAll(`tbody tr:nth-child(${rowIndex + 2}) input, tbody tr:nth-child(${rowIndex + 2}) select, tbody tr:nth-child(${rowIndex + 2}) textarea`)
      const currentInputs = document.querySelectorAll(`tbody tr:nth-child(${rowIndex + 1}) input, tbody tr:nth-child(${rowIndex + 1}) select, tbody tr:nth-child(${rowIndex + 1}) textarea`)
      const currentIndex = Array.from(currentInputs).indexOf(event.target as HTMLElement)
      if (nextRowInputs[currentIndex]) {
        (nextRowInputs[currentIndex] as HTMLElement).focus()
      }
    }
  }
}

const setImageInputRef = (el: any, index: number) => {
  if (el) {
    imageInputRefs.value.set(`image_${index}`, el)
  }
}

const triggerImageUpload = (index: number) => {
  const input = imageInputRefs.value.get(`image_${index}`)
  if (input) {
    input.click()
  }
}

const handleImageUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const files = Array.from(target.files)
  const product = manualProducts.value[index]

  try {
    // Upload images
    const response = await mediaApi.uploadMultipleImages(files, {
      folder: 'products',
      optimize: true
    })

    if (response.success && response.data) {
      const uploadedImages = Array.isArray(response.data) 
        ? response.data.map((img: any) => img.url || img)
        : [response.data.url || response.data]
      
      product.images = [...(product.images || []), ...uploadedImages]
      uiStore.showNotification('success', `Uploaded ${uploadedImages.length} image(s)`)
    } else {
      uiStore.showNotification('error', response.error || 'Failed to upload images')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to upload images')
  } finally {
    // Reset input
    if (target) {
      target.value = ''
    }
  }
}

const validateProduct = (product: any): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  if (!product.name || product.name.trim() === '') {
    errors.name = 'Product name is required'
  }
  if (!product.description || product.description.trim() === '') {
    errors.description = 'Description is required'
  }
  if (!product.price || product.price <= 0) {
    errors.price = 'Price must be greater than 0'
  }
  if (product.stock === undefined || product.stock < 0) {
    errors.stock = 'Stock cannot be negative'
  }
  if (!product.sku || product.sku.trim() === '') {
    errors.sku = 'SKU is required'
  }
  if (!product.categoryId) {
    errors.categoryId = 'Category is required'
  }
  
  return errors
}

const isProductValid = (product: any): boolean => {
  const errors = validateProduct(product)
  return Object.keys(errors).length === 0
}

const getFieldError = (product: any, field: string): string => {
  const errors = validateProduct(product)
  return errors[field] || ''
}

const getFieldErrorClass = (product: any, field: string): string => {
  const error = getFieldError(product, field)
  return error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
}

const prepareProductData = (product: any) => {
  // Convert tagsInput to tags array
  const tags = product.tagsInput
    ? product.tagsInput.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
    : []

  const productData: any = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    sku: product.sku,
    categoryId: product.categoryId,
    status: product.status,
    images: product.images || []
  }

  if (product.compareAtPrice !== undefined && product.compareAtPrice > 0) {
    productData.compareAtPrice = product.compareAtPrice
  }

  if (tags.length > 0) {
    productData.tags = tags
  }

  return productData
}

const createAllProducts = async () => {
  const validProducts = manualProducts.value.filter(p => isProductValid(p))
  
  if (validProducts.length === 0) {
    uiStore.showNotification('error', 'No valid products to create')
    return
  }

  isCreatingBatch.value = true
  batchCreateProgress.value = { current: 0, total: validProducts.length }
  batchCreateResults.value = []

  const results: any[] = []

  for (let i = 0; i < validProducts.length; i++) {
    const product = validProducts[i]
    batchCreateProgress.value.current = i + 1

    try {
      const productData = prepareProductData(product)
      const response = props.isVendor
        ? await vendorApi.createProduct(productData)
        : await productsApi.createProduct(productData)
      
      results.push({
        success: response.success,
        product: product,
        error: response.error || null
      })

      if (response.success) {
        batchCreateResults.value.push({
          success: true,
          product: product,
          error: null
        })
      } else {
        batchCreateResults.value.push({
          success: false,
          product: product,
          error: response.error || 'Failed to create product'
        })
      }
    } catch (error: any) {
      results.push({
        success: false,
        product: product,
        error: error.message || 'Failed to create product'
      })
      batchCreateResults.value.push({
        success: false,
        product: product,
        error: error.message || 'Failed to create product'
      })
    }
  }

  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length

  if (successCount > 0) {
    uiStore.showNotification('success', `Successfully created ${successCount} product(s)`)
    emit('success')
  }
  if (failCount > 0) {
    uiStore.showNotification('error', `Failed to create ${failCount} product(s)`)
  }

  isCreatingBatch.value = false
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    error.value = null
    
    // Validate file type
    const validTypes = ['.csv', '.json', '.xlsx']
    const fileName = selectedFile.value.name.toLowerCase()
    if (!validTypes.some(type => fileName.endsWith(type))) {
      error.value = 'Invalid file type. Please select a CSV, JSON, or XLSX file.'
      selectedFile.value = null
      return
    }
    
    // Validate file size (10MB)
    if (selectedFile.value.size > 10 * 1024 * 1024) {
      error.value = 'File size exceeds 10MB limit.'
      selectedFile.value = null
      return
    }
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    queued: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const pollImportStatus = async () => {
  if (!importJobId.value) return
  
  try {
    const response = await operationalApi.getImportStatus(importJobId.value)
    
    if (response.success && response.data) {
      importStatus.value = response.data.status || 'processing'
      importProgress.value = response.data.progress || 0
      
      if (importStatus.value === 'completed') {
        stopPolling()
        await fetchImportResult()
      } else if (importStatus.value === 'failed') {
        stopPolling()
        error.value = response.data.error || 'Import failed'
      }
    }
  } catch (err: any) {
    console.error('Error polling import status:', err)
    stopPolling()
    error.value = err.message || 'Failed to check import status'
  }
}

const fetchImportResult = async () => {
  if (!importJobId.value) return
  
  try {
    const response = await operationalApi.getImportResult(importJobId.value)
    if (response.success && response.data) {
      importResult.value = response.data
      emit('success')
    }
  } catch (err: any) {
    console.error('Error fetching import result:', err)
  }
}

const startPolling = () => {
  if (statusPollInterval) {
    clearInterval(statusPollInterval)
  }
  statusPollInterval = window.setInterval(pollImportStatus, 2000)
}

const stopPolling = () => {
  if (statusPollInterval) {
    clearInterval(statusPollInterval)
    statusPollInterval = null
  }
}

const handleImport = async () => {
  if (!selectedFile.value) {
    error.value = 'Please select a file'
    return
  }
  
  isProcessing.value = true
  error.value = null
  importStatus.value = ''
  importProgress.value = 0
  importResult.value = null
  
  try {
    const response = await operationalApi.importData(selectedFile.value, 'PRODUCTS')
    
    if (response.success && response.data) {
      importJobId.value = response.data.jobId || response.data.id
      importStatus.value = 'queued'
      startPolling()
    } else {
      error.value = response.error || 'Failed to start import'
      isProcessing.value = false
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to import products'
    isProcessing.value = false
    uiStore.showNotification('error', 'Failed to import products')
  }
}

// Cleanup on close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    stopPolling()
    selectedFile.value = null
    importJobId.value = null
    importStatus.value = ''
    importProgress.value = 0
    importResult.value = null
    error.value = null
    activeTab.value = 'file'
    manualProducts.value = []
    batchCreateResults.value = []
    batchCreateProgress.value = { current: 0, total: 0 }
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
})

onMounted(() => {
  loadCategories()
})
</script>
