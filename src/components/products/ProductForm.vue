<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
    <!-- Tabs for organizing sections -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          type="button"
          @click="activeTab = 'basic'"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'basic'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Basic Info
        </button>
        <button
          type="button"
          @click="activeTab = 'pricing'"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'pricing'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Pricing & Inventory
        </button>
        <button
          type="button"
          @click="activeTab = 'details'"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'details'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Additional Details
        </button>
        <button
          type="button"
          @click="activeTab = 'policies'"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'policies'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Policies & Info
        </button>
      </nav>
    </div>

    <!-- General error message -->
    <div v-if="apiError" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-700 font-medium">{{ apiError }}</p>
      </div>
    </div>

    <!-- Basic Info Tab -->
    <div v-show="activeTab === 'basic'" class="space-y-4">
      <Input
        v-model="form.name"
        label="Product Name"
        :error="errors.name"
      />
      <div>
        <label class="block text-sm font-medium mb-2">Description</label>
        <textarea
          v-model="form.description"
          class="input"
          rows="4"
        ></textarea>
        <p v-if="errors.description" class="text-red-600 text-sm mt-1">{{ errors.description }}</p>
      </div>
      <Input
        v-model="form.slug"
        label="Slug (URL-friendly identifier)"
        placeholder="auto-generated-from-name"
      />
      <Input
        v-model="form.sku"
        label="SKU"
        :error="errors.sku"
      />
      <div>
        <label class="block text-sm font-medium mb-2">Category</label>
        <select v-model="form.categoryId" class="input">
          <option value="">Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <p v-if="errors.categoryId" class="text-red-600 text-sm mt-1">{{ errors.categoryId }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Tags (comma-separated)</label>
        <Input
          v-model="tagsInput"
          label="Tags"
          placeholder="tag1, tag2, tag3"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Badges (comma-separated)</label>
        <Input
          v-model="badgesInput"
          label="Badges"
          placeholder="New, Sale, Featured"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Images</label>
        <ImageUpload
          v-model="form.images"
          :multiple="true"
          folder="products"
          :optimize="true"
          @uploaded="handleImagesUploaded"
          @error="handleImageError"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Active Status</label>
        <div class="flex items-center">
          <input
            v-model="form.isActive"
            type="checkbox"
            id="isActive"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="isActive" class="ml-2 text-sm text-gray-700">
            Product is active
          </label>
        </div>
      </div>
    </div>

    <!-- Pricing & Inventory Tab -->
    <div v-show="activeTab === 'pricing'" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <Input
          v-model.number="form.price"
          type="number"
          step="0.01"
          label="Price"
          :error="errors.price"
        />
        <Input
          v-model.number="form.stock"
          type="number"
          label="Stock"
          :error="errors.stock"
        />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <Input
          v-model.number="form.compareAtPrice"
          type="number"
          step="0.01"
          label="Compare At Price (Optional)"
        />
        <Input
          v-model.number="form.originalPrice"
          type="number"
          step="0.01"
          label="Original Price (Optional)"
        />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <Input
          v-model.number="form.minOrderQuantity"
          type="number"
          label="Min Order Quantity (Optional)"
        />
        <Input
          v-model.number="form.maxOrderQuantity"
          type="number"
          label="Max Order Quantity (Optional)"
        />
      </div>
    </div>

    <!-- Additional Details Tab -->
    <div v-show="activeTab === 'details'" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <Input
          v-model="form.brand"
          label="Brand (Optional)"
        />
        <Input
          v-model="form.modelNumber"
          label="Model Number (Optional)"
        />
      </div>
      <Input
        v-model="form.countryOfOrigin"
        label="Country of Origin (Optional)"
      />
      <div>
        <label class="block text-sm font-medium mb-2">Certifications (comma-separated)</label>
        <Input
          v-model="certificationsInput"
          label="Certifications"
          placeholder="ISO 9001, CE, FDA"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Warranty Info (Optional)</label>
        <textarea
          v-model="form.warrantyInfo"
          class="input"
          rows="3"
          placeholder="e.g., 1 year manufacturer warranty"
        ></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Care Instructions (Optional)</label>
        <textarea
          v-model="form.careInstructions"
          class="input"
          rows="3"
          placeholder="e.g., Hand wash only, Do not bleach"
        ></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Weight & Dimensions</label>
        <div class="space-y-3 p-3 border border-gray-200 rounded-lg">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Weight</label>
            <div class="grid grid-cols-2 gap-2">
              <Input
                v-model.number="weightDimensions.weightValue"
                type="number"
                step="0.1"
                label="Value"
                placeholder="1.5"
              />
              <Input
                v-model="weightDimensions.weightUnit"
                label="Unit"
                placeholder="kg"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Dimensions</label>
            <div class="grid grid-cols-4 gap-2">
              <Input
                v-model.number="weightDimensions.length"
                type="number"
                step="0.1"
                label="Length"
                placeholder="10"
              />
              <Input
                v-model.number="weightDimensions.width"
                type="number"
                step="0.1"
                label="Width"
                placeholder="5"
              />
              <Input
                v-model.number="weightDimensions.height"
                type="number"
                step="0.1"
                label="Height"
                placeholder="3"
              />
              <Input
                v-model="weightDimensions.dimensionUnit"
                label="Unit"
                placeholder="cm"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Specifications (JSON)</label>
        <textarea
          v-model="specificationsJson"
          class="input font-mono text-sm"
          rows="6"
          placeholder='{"material": "Cotton", "color": "Blue", "size": "Large"}'
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">Enter specifications as JSON object</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Manufacturer Info (JSON)</label>
        <textarea
          v-model="manufacturerInfoJson"
          class="input font-mono text-sm"
          rows="4"
          placeholder='{"name": "Manufacturer Name", "address": "Address"}'
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">Enter manufacturer info as JSON object</p>
      </div>
    </div>

    <!-- Policies & Info Tab -->
    <div v-show="activeTab === 'policies'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Return Policy</label>
        <div class="space-y-2 p-3 border border-gray-200 rounded-lg">
          <Input
            v-model="returnPolicy.window"
            label="Window (e.g., 30 days)"
            placeholder="30 days"
          />
          <Input
            v-model="returnPolicy.conditions"
            label="Conditions"
            placeholder="Item unused"
          />
          <Input
            v-model="returnPolicy.process"
            label="Process"
            placeholder="Contact support"
          />
          <Input
            v-model="returnPolicy.shippingCost"
            label="Shipping Cost (Optional)"
            placeholder="Free return shipping"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Refund Policy</label>
        <div class="space-y-2 p-3 border border-gray-200 rounded-lg">
          <Input
            v-model="refundPolicy.method"
            label="Method"
            placeholder="original payment method"
          />
          <Input
            v-model="refundPolicy.timeline"
            label="Timeline"
            placeholder="5-10 business days"
          />
          <Input
            v-model="refundPolicy.conditions"
            label="Conditions"
            placeholder="Refund conditions"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Shipping Policy</label>
        <div class="space-y-2 p-3 border border-gray-200 rounded-lg">
          <Input
            v-model="shippingPolicy.deliveryTime"
            label="Delivery Time"
            placeholder="2-4 business days"
          />
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Methods (comma-separated)</label>
            <Input
              v-model="shippingPolicyMethodsInput"
              label="Methods"
              placeholder="standard, express, overnight"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Costs (JSON)</label>
            <textarea
              v-model="shippingPolicyCostsJson"
              class="input font-mono text-sm"
              rows="3"
              placeholder='{"standard": 4.99, "express": 10.99}'
            ></textarea>
          </div>
          <Input
            v-model.number="shippingPolicy.freeShippingThreshold"
            type="number"
            step="0.01"
            label="Free Shipping Threshold"
            placeholder="75.00"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Exchange Policy</label>
        <div class="space-y-2 p-3 border border-gray-200 rounded-lg">
          <Input
            v-model="exchangePolicy.window"
            label="Window"
            placeholder="45 days"
          />
          <Input
            v-model="exchangePolicy.conditions"
            label="Conditions"
            placeholder="Exchange conditions"
          />
          <Input
            v-model="exchangePolicy.process"
            label="Process"
            placeholder="Exchange process"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Cancellation Policy</label>
        <div class="space-y-2 p-3 border border-gray-200 rounded-lg">
          <Input
            v-model="cancellationPolicy.window"
            label="Window"
            placeholder="48 hours"
          />
          <Input
            v-model="cancellationPolicy.terms"
            label="Terms"
            placeholder="Cancellation terms"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-4 pt-4 border-t">
      <Button type="button" variant="secondary" @click="$emit('cancel')">Cancel</Button>
      <Button type="submit" variant="primary" :loading="isLoading">Save</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, markRaw, shallowRef } from 'vue'
import { productsApi } from '@/api/endpoints/products'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import ImageUpload from '@/components/common/ImageUpload.vue'
import type { Product, Category } from '@/api/types'

const props = defineProps<{
  product?: Product
  isVendor?: boolean
}>()

const emit = defineEmits<{
  submit: [product: any]
  cancel: []
}>()

const uiStore = useUIStore()
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})
const apiError = ref<string | null>(null)
const apiFieldErrors = ref<Record<string, string[]>>({})
const categories = ref<Category[]>([])
const activeTab = ref<'basic' | 'pricing' | 'details' | 'policies'>('basic')
const tagsInput = ref('')
const badgesInput = ref('')
const certificationsInput = ref('')
const specificationsJson = ref('')
const manufacturerInfoJson = ref('')

const form = shallowRef({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  sku: '',
  slug: '',
  categoryId: '',
  isActive: true,
  images: [] as string[],
  compareAtPrice: undefined as number | undefined,
  originalPrice: undefined as number | undefined,
  tags: [] as string[],
  badges: [] as string[],
  certifications: [] as string[],
  brand: '',
  modelNumber: '',
  countryOfOrigin: '',
  warrantyInfo: '',
  careInstructions: '',
  specifications: undefined as any,
  manufacturerInfo: undefined as any,
  returnPolicy: undefined as any,
  refundPolicy: undefined as any,
  shippingPolicy: undefined as any,
  exchangePolicy: undefined as any,
  cancellationPolicy: undefined as any,
  weightDimensions: undefined as any,
  minOrderQuantity: undefined as number | undefined,
  maxOrderQuantity: undefined as number | undefined
})

const weightDimensions = ref({
  weightValue: undefined as number | undefined,
  weightUnit: '',
  length: undefined as number | undefined,
  width: undefined as number | undefined,
  height: undefined as number | undefined,
  dimensionUnit: ''
})

const returnPolicy = ref({
  window: '',
  conditions: '',
  process: '',
  shippingCost: ''
})

const refundPolicy = ref({
  method: '',
  timeline: '',
  conditions: ''
})

const shippingPolicy = ref({
  deliveryTime: '',
  methods: [] as string[],
  costs: undefined as any,
  freeShippingThreshold: undefined as number | undefined
})

const shippingPolicyMethodsInput = ref('')
const shippingPolicyCostsJson = ref('')

const exchangePolicy = ref({
  window: '',
  conditions: '',
  process: ''
})

const cancellationPolicy = ref({
  window: '',
  terms: ''
})

// Flag to prevent watchers from running during initialization (use ref for reactivity)
const isInitializing = ref(true)

// Helper to deep clone objects (avoid reactive references)
const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as any
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = deepClone((obj as any)[key])
    return acc
  }, {} as any)
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

const handleImagesUploaded = (images: any[]) => {
  // Images are already updated via v-model
  console.log('Images uploaded:', images)
}

const handleImageError = (error: string) => {
  console.error('Image upload error:', error)
}

// Helper functions to sync input fields to form (called on submit, not via watchers)
const syncInputsToForm = () => {
  // Sync tags
  form.value.tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
  
  // Sync badges
  form.value.badges = badgesInput.value
    .split(',')
    .map(badge => badge.trim())
    .filter(badge => badge.length > 0)
  
  // Sync certifications
  form.value.certifications = certificationsInput.value
    .split(',')
    .map(cert => cert.trim())
    .filter(cert => cert.length > 0)
  
  // Sync specifications
  if (specificationsJson.value.trim()) {
    try {
      form.value.specifications = JSON.parse(specificationsJson.value)
    } catch {
      // Invalid JSON, will be handled on submit
    }
  } else {
    form.value.specifications = undefined
  }
  
  // Sync manufacturer info
  if (manufacturerInfoJson.value.trim()) {
    try {
      form.value.manufacturerInfo = JSON.parse(manufacturerInfoJson.value)
    } catch {
      // Invalid JSON, will be handled on submit
    }
  } else {
    form.value.manufacturerInfo = undefined
  }
  
  // Sync shipping policy methods
  shippingPolicy.value.methods = shippingPolicyMethodsInput.value
    .split(',')
    .map(m => m.trim())
    .filter(m => m.length > 0)
  
  // Sync shipping policy costs
  if (shippingPolicyCostsJson.value.trim()) {
    try {
      shippingPolicy.value.costs = JSON.parse(shippingPolicyCostsJson.value)
    } catch {
      // Invalid JSON, will be handled on submit
    }
  } else {
    shippingPolicy.value.costs = undefined
  }
}

// Helper function to compute weightDimensions from form
const computeWeightDimensions = () => {
  const wd = weightDimensions.value
  const hasWeight = wd.weightValue !== undefined && wd.weightUnit
  const hasDimensions = wd.length !== undefined && wd.width !== undefined && wd.height !== undefined && wd.dimensionUnit
  
  if (hasWeight || hasDimensions) {
    const result: any = {}
    if (hasWeight) {
      result.weight = {
        value: wd.weightValue,
        unit: wd.weightUnit
      }
    }
    if (hasDimensions) {
      result.dimensions = {
        length: wd.length,
        width: wd.width,
        height: wd.height,
        unit: wd.dimensionUnit
      }
    }
    return result
  }
  return undefined
}

// Helper function to check if policy has values
const hasPolicyValue = (policy: any): boolean => {
  return Object.values(policy).some(v => {
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'object' && v !== null) return Object.keys(v).length > 0
    return v !== '' && v !== undefined && v !== null
  })
}

onMounted(async () => {
  try {
    await loadCategories()
    
    if (!props.product) {
      // If no product, we're creating a new one - disable initialization flag
      isInitializing.value = false
      return
    }
    
    console.log('[ProductForm Debug] Starting initialization for product:', props.product.id)
    console.log('[ProductForm Debug] Product data:', JSON.parse(JSON.stringify(props.product)))
    
    // Clone product data to avoid reactive references
    const productData = deepClone(props.product)
    console.log('[ProductForm Debug] Product data cloned')
    
    // Map status to isActive
    const isActive = productData.status === 'active' || (productData as any).isActive === true
    console.log('[ProductForm Debug] isActive:', isActive)
    
    // Create a new form object and mark nested objects as non-reactive to prevent recursive updates
    console.log('[ProductForm Debug] Creating newFormData...')
    const newFormData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      sku: productData.sku,
      slug: productData.slug || '',
      categoryId: productData.categoryId,
      isActive: isActive,
      images: productData.images ? markRaw(deepClone(productData.images)) : [],
      compareAtPrice: productData.compareAtPrice,
      originalPrice: productData.originalPrice,
      tags: productData.tags ? markRaw(deepClone(productData.tags)) : [],
      badges: productData.badges ? markRaw(deepClone(productData.badges)) : [],
      certifications: productData.certifications ? markRaw(deepClone(productData.certifications)) : [],
      brand: productData.brand || '',
      modelNumber: productData.modelNumber || '',
      countryOfOrigin: productData.countryOfOrigin || '',
      warrantyInfo: productData.warrantyInfo || '',
      careInstructions: productData.careInstructions || '',
      specifications: productData.specifications ? markRaw(deepClone(productData.specifications)) : undefined,
      manufacturerInfo: productData.manufacturerInfo ? markRaw(deepClone(productData.manufacturerInfo)) : undefined,
      returnPolicy: productData.returnPolicy ? markRaw(deepClone(productData.returnPolicy)) : undefined,
      refundPolicy: productData.refundPolicy ? markRaw(deepClone(productData.refundPolicy)) : undefined,
      shippingPolicy: productData.shippingPolicy ? markRaw(deepClone(productData.shippingPolicy)) : undefined,
      exchangePolicy: productData.exchangePolicy ? markRaw(deepClone(productData.exchangePolicy)) : undefined,
      cancellationPolicy: productData.cancellationPolicy ? markRaw(deepClone(productData.cancellationPolicy)) : undefined,
      weightDimensions: productData.weightDimensions ? markRaw(deepClone(productData.weightDimensions)) : undefined,
      minOrderQuantity: productData.minOrderQuantity,
      maxOrderQuantity: productData.maxOrderQuantity
    }
    console.log('[ProductForm Debug] newFormData created')
    
    // Use multiple nextTick calls and setTimeout to ensure component is fully mounted
    // and all reactive effects have settled before assigning
    console.log('[ProductForm Debug] Waiting for nextTick (1/3)...')
    await nextTick()
    console.log('[ProductForm Debug] Waiting for nextTick (2/3)...')
    await nextTick()
    console.log('[ProductForm Debug] Waiting for nextTick (3/3)...')
    await nextTick()
    
    // Use setTimeout to defer assignment to next event loop
    // This ensures all reactive effects from mounting have completed
    await new Promise(resolve => setTimeout(resolve, 0))
    
    console.log('[ProductForm Debug] After all delays, assigning form.value...')
    
    // Replace the entire form.value at once
    // Using shallowRef means only top-level changes trigger reactivity, not nested object changes
    form.value = { ...newFormData }
    console.log('[ProductForm Debug] form.value assigned (including images)')
    
    // Wait for next tick to ensure ImageUpload component has processed the initial value
    await nextTick()
    console.log('[ProductForm Debug] After form assignment, waiting for ImageUpload to initialize...')
    
    // Wait for next tick before setting input fields
    console.log('[ProductForm Debug] Waiting for nextTick before setting input fields...')
    await nextTick()
    console.log('[ProductForm Debug] Setting input fields...')
    
    // Initialize input fields after form is set
    if (productData.tags && Array.isArray(productData.tags)) {
      tagsInput.value = productData.tags.join(', ')
      console.log('[ProductForm Debug] tagsInput set')
    }
    if (productData.badges && Array.isArray(productData.badges)) {
      badgesInput.value = productData.badges.join(', ')
      console.log('[ProductForm Debug] badgesInput set')
    }
    if (productData.certifications && Array.isArray(productData.certifications)) {
      certificationsInput.value = productData.certifications.join(', ')
      console.log('[ProductForm Debug] certificationsInput set')
    }
    if (productData.specifications) {
      specificationsJson.value = JSON.stringify(productData.specifications, null, 2)
      console.log('[ProductForm Debug] specificationsJson set')
    }
    if (productData.manufacturerInfo) {
      manufacturerInfoJson.value = JSON.stringify(productData.manufacturerInfo, null, 2)
      console.log('[ProductForm Debug] manufacturerInfoJson set')
    }
    
    // Parse weightDimensions structure
    if (productData.weightDimensions) {
      const wd = productData.weightDimensions as any
      if (wd.weight) {
        weightDimensions.value.weightValue = wd.weight.value
        weightDimensions.value.weightUnit = wd.weight.unit || ''
      }
      if (wd.dimensions) {
        weightDimensions.value.length = wd.dimensions.length
        weightDimensions.value.width = wd.dimensions.width
        weightDimensions.value.height = wd.dimensions.height
        weightDimensions.value.dimensionUnit = wd.dimensions.unit || ''
      }
      console.log('[ProductForm Debug] weightDimensions set')
    }
    
    // Initialize policy objects
    if (productData.returnPolicy) {
      const rp = productData.returnPolicy as any
      returnPolicy.value.window = rp.window || ''
      returnPolicy.value.conditions = rp.conditions || ''
      returnPolicy.value.process = rp.process || ''
      returnPolicy.value.shippingCost = rp.shippingCost || ''
      console.log('[ProductForm Debug] returnPolicy set')
    }
    if (productData.refundPolicy) {
      const rfp = productData.refundPolicy as any
      refundPolicy.value.method = rfp.method || ''
      refundPolicy.value.timeline = rfp.timeline || ''
      refundPolicy.value.conditions = rfp.conditions || ''
      console.log('[ProductForm Debug] refundPolicy set')
    }
    if (productData.shippingPolicy) {
      const sp = productData.shippingPolicy as any
      shippingPolicy.value.deliveryTime = sp.deliveryTime || ''
      shippingPolicy.value.methods = Array.isArray(sp.methods) ? deepClone(sp.methods) : []
      shippingPolicy.value.costs = sp.costs ? deepClone(sp.costs) : undefined
      shippingPolicy.value.freeShippingThreshold = sp.freeShippingThreshold
      shippingPolicyMethodsInput.value = Array.isArray(sp.methods) ? sp.methods.join(', ') : ''
      if (sp.costs) {
        shippingPolicyCostsJson.value = JSON.stringify(sp.costs, null, 2)
      }
      console.log('[ProductForm Debug] shippingPolicy set')
    }
    if (productData.exchangePolicy) {
      const ep = productData.exchangePolicy as any
      exchangePolicy.value.window = ep.window || ''
      exchangePolicy.value.conditions = ep.conditions || ''
      exchangePolicy.value.process = ep.process || ''
      console.log('[ProductForm Debug] exchangePolicy set')
    }
    if (productData.cancellationPolicy) {
      const cp = productData.cancellationPolicy as any
      cancellationPolicy.value.window = cp.window || ''
      cancellationPolicy.value.terms = cp.terms || ''
      console.log('[ProductForm Debug] cancellationPolicy set')
    }
    
    console.log('[ProductForm Debug] All fields initialized, setting isInitializing to false')
  } catch (error: any) {
    console.error('[ProductForm Debug] ERROR during initialization:', error)
    console.error('[ProductForm Debug] Error stack:', error?.stack)
    console.error('[ProductForm Debug] Error message:', error?.message)
    console.error('[ProductForm Debug] Current form.value:', JSON.parse(JSON.stringify(form.value)))
    console.error('[ProductForm Debug] Current isInitializing:', isInitializing.value)
    
    // Re-throw to see the full error
    throw error
  } finally {
    // Disable initialization flag after all updates are complete
    isInitializing.value = false
    console.log('[ProductForm Debug] Initialization complete, isInitializing set to false')
  }
})

const handleSubmit = () => {
  errors.value = {}
  apiError.value = null
  apiFieldErrors.value = {}
  
  // Sync all input fields to form before validation/submission
  syncInputsToForm()
  
  // Validation with tab switching
  if (!form.value.name) {
    errors.value.name = 'Product name is required'
    activeTab.value = 'basic'
  }
  if (!form.value.description) {
    errors.value.description = 'Description is required'
    activeTab.value = 'basic'
  }
  if (form.value.price <= 0) {
    errors.value.price = 'Price must be greater than 0'
    activeTab.value = 'pricing'
  }
  if (form.value.stock < 0) {
    errors.value.stock = 'Stock cannot be negative'
    activeTab.value = 'pricing'
  }
  if (!form.value.sku) {
    errors.value.sku = 'SKU is required'
    activeTab.value = 'basic'
  }
  if (!form.value.categoryId) {
    errors.value.categoryId = 'Category is required'
    activeTab.value = 'basic'
  }
  
  if (Object.keys(errors.value).length > 0) {
    // Show notification
    const errorCount = Object.keys(errors.value).length
    uiStore.showNotification('error', `Please fix ${errorCount} error(s) in the form`, 5000)
    // Scroll to first error after tab switch
    nextTick(() => {
      const firstErrorField = document.querySelector('.input.border-red-500, textarea.border-red-500, select.border-red-500')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return
  }
  
  // Validate JSON fields
  if (specificationsJson.value.trim()) {
    try {
      JSON.parse(specificationsJson.value)
    } catch {
      errors.value.specifications = 'Invalid JSON format in specifications'
      activeTab.value = 'details'
      return
    }
  }
  
  if (manufacturerInfoJson.value.trim()) {
    try {
      JSON.parse(manufacturerInfoJson.value)
    } catch {
      errors.value.manufacturerInfo = 'Invalid JSON format in manufacturer info'
      activeTab.value = 'details'
      return
    }
  }
  
  if (shippingPolicyCostsJson.value.trim()) {
    try {
      JSON.parse(shippingPolicyCostsJson.value)
    } catch {
      errors.value.shippingPolicy = 'Invalid JSON format in shipping policy costs'
      activeTab.value = 'policies'
      return
    }
  }
  
  // Prepare product data according to API spec
  const productData: any = {
    name: form.value.name,
    description: form.value.description,
    price: form.value.price,
    stock: form.value.stock,
    sku: form.value.sku,
    categoryId: form.value.categoryId,
    isActive: form.value.isActive,
    images: form.value.images
  }
  
  // Add optional fields if they have values
  if (form.value.slug) productData.slug = form.value.slug
  if (form.value.compareAtPrice !== undefined && form.value.compareAtPrice > 0) {
    productData.compareAtPrice = form.value.compareAtPrice
  }
  if (form.value.originalPrice !== undefined && form.value.originalPrice > 0) {
    productData.originalPrice = form.value.originalPrice
  }
  if (form.value.tags.length > 0) productData.tags = form.value.tags
  if (form.value.badges.length > 0) productData.badges = form.value.badges
  if (form.value.certifications.length > 0) productData.certifications = form.value.certifications
  if (form.value.brand) productData.brand = form.value.brand
  if (form.value.modelNumber) productData.modelNumber = form.value.modelNumber
  if (form.value.countryOfOrigin) productData.countryOfOrigin = form.value.countryOfOrigin
  if (form.value.warrantyInfo) productData.warrantyInfo = form.value.warrantyInfo
  if (form.value.careInstructions) productData.careInstructions = form.value.careInstructions
  if (form.value.specifications) productData.specifications = form.value.specifications
  if (form.value.manufacturerInfo) productData.manufacturerInfo = form.value.manufacturerInfo
  
  // Policies - only include if they have values
  if (hasPolicyValue(returnPolicy.value)) {
    productData.returnPolicy = { ...returnPolicy.value }
  }
  if (hasPolicyValue(refundPolicy.value)) {
    productData.refundPolicy = { ...refundPolicy.value }
  }
  if (hasPolicyValue(shippingPolicy.value)) {
    productData.shippingPolicy = { ...shippingPolicy.value }
  }
  if (hasPolicyValue(exchangePolicy.value)) {
    productData.exchangePolicy = { ...exchangePolicy.value }
  }
  if (hasPolicyValue(cancellationPolicy.value)) {
    productData.cancellationPolicy = { ...cancellationPolicy.value }
  }
  
  // WeightDimensions - compute from form inputs
  const weightDims = computeWeightDimensions()
  if (weightDims) {
    productData.weightDimensions = weightDims
  }
  
  if (form.value.minOrderQuantity !== undefined) productData.minOrderQuantity = form.value.minOrderQuantity
  if (form.value.maxOrderQuantity !== undefined) productData.maxOrderQuantity = form.value.maxOrderQuantity
  
  emit('submit', productData)
}
</script>

