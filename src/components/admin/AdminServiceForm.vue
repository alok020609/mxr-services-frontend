<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
    <div v-if="apiError" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p class="text-red-700 font-medium">{{ apiError }}</p>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Basic information</h3>
      <Input
        v-model="form.name"
        label="Name"
        placeholder="e.g. Camera Installation"
        :error="errors.name"
        required
      />
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Price <span class="text-red-500">*</span>
        </label>
        <input
          v-model.number="form.price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          class="input"
          :class="{ 'border-red-500': errors.price }"
        />
        <p v-if="errors.price" class="text-red-600 text-sm mt-1">{{ errors.price }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Type <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.type"
          class="input"
          :class="{ 'border-red-500': errors.type }"
          required
        >
          <option value="">Select type</option>
          <option value="CONSULTING">CONSULTING</option>
          <option value="REPAIR">REPAIR</option>
          <option value="INSTALLATION">INSTALLATION</option>
        </select>
        <p v-if="errors.type" class="text-red-600 text-sm mt-1">{{ errors.type }}</p>
      </div>
      <Input
        v-model="form.slug"
        label="Slug (optional)"
        placeholder="Auto-generated from name if empty"
      />
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="input"
          placeholder="Service description"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Duration (minutes, optional)</label>
        <input
          v-model.number="form.durationMinutes"
          type="number"
          min="0"
          class="input"
          placeholder="e.g. 60"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Image (optional)</label>
        <ImageUpload
          v-model="serviceImageArray"
          :multiple="false"
          folder="services"
          :optimize="true"
          @uploaded="handleImageUploaded"
        />
        <p class="text-xs text-gray-500 mt-1">If no image is set, the default placeholder will be shown on the storefront.</p>
      </div>
      <label class="flex items-center gap-2">
        <input v-model="form.isActive" type="checkbox" class="h-4 w-4 text-primary-600 rounded border-gray-300" />
        <span class="text-sm text-gray-700">Active</span>
      </label>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Scope</h3>
      <p class="text-sm text-gray-600">Link this service to a product, a category, or leave standalone.</p>
      <div class="space-y-3">
        <label class="flex items-center gap-2">
          <input v-model="scopeKind" type="radio" value="standalone" class="h-4 w-4 text-primary-600" />
          <span>Standalone</span>
        </label>
        <label class="flex items-center gap-2">
          <input v-model="scopeKind" type="radio" value="product" class="h-4 w-4 text-primary-600" />
          <span>Product</span>
        </label>
        <div v-if="scopeKind === 'product'" class="ml-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select v-model="form.productId" class="input w-full max-w-md">
            <option value="">Select product</option>
            <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <label class="flex items-center gap-2">
          <input v-model="scopeKind" type="radio" value="category" class="h-4 w-4 text-primary-600" />
          <span>Category</span>
        </label>
        <div v-if="scopeKind === 'category'" class="ml-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select v-model="form.categoryId" class="input w-full max-w-md">
            <option value="">Select category</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t">
      <Button type="button" variant="secondary" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button type="submit" variant="primary" :disabled="isSaving">
        {{ isSaving ? 'Saving...' : (service ? 'Update service' : 'Create service') }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import ImageUpload from '@/components/common/ImageUpload.vue'
import { productsApi } from '@/api/endpoints/products'
import type { Service } from '@/api/types'
import type { AdminServiceCreatePayload } from '@/api/endpoints/admin-services'
import type { Category, Product } from '@/api/types'

const props = withDefaults(
  defineProps<{
    service: Service | null
    apiError?: string | null
    isSaving?: boolean
  }>(),
  { apiError: null, isSaving: false }
)

const emit = defineEmits<{
  submit: [payload: AdminServiceCreatePayload]
  cancel: []
}>()

const categories = ref<Category[]>([])
const products = ref<Product[]>([])

const scopeKind = ref<'standalone' | 'product' | 'category'>('standalone')

const form = ref<{
  name: string
  price: number
  type: '' | 'CONSULTING' | 'REPAIR' | 'INSTALLATION'
  slug: string
  description: string
  productId: string
  categoryId: string
  durationMinutes: number | ''
  isActive: boolean
  image: string
}>({
  name: '',
  price: 0,
  type: '',
  slug: '',
  description: '',
  productId: '',
  categoryId: '',
  durationMinutes: '',
  isActive: true,
  image: ''
})

const serviceImageArray = computed({
  get: () => (form.value.image ? [form.value.image] : []),
  set: (value: string[]) => {
    form.value.image = value.length > 0 ? value[0] : ''
  }
})

function handleImageUploaded(imageUrls: string[]) {
  if (imageUrls.length > 0) form.value.image = imageUrls[0]
}

const errors = ref<Record<string, string>>({})

function initFromService(s: Service | null) {
  if (!s) {
    form.value = {
      name: '',
      price: 0,
      type: '',
      slug: '',
      description: '',
      productId: '',
      categoryId: '',
      durationMinutes: '',
      isActive: true,
      image: ''
    }
    scopeKind.value = 'standalone'
    return
  }
  const priceNum = typeof s.price === 'string' ? parseFloat(s.price) : Number(s.price)
  form.value = {
    name: s.name,
    price: Number.isNaN(priceNum) ? 0 : priceNum,
    type: s.type,
    slug: s.slug ?? '',
    description: s.description ?? '',
    productId: s.productId ?? '',
    categoryId: s.categoryId ?? '',
    durationMinutes: s.durationMinutes ?? '',
    isActive: s.isActive ?? true,
    image: s.image ?? ''
  }
  if (s.productId) scopeKind.value = 'product'
  else if (s.categoryId) scopeKind.value = 'category'
  else scopeKind.value = 'standalone'
}

watch(
  () => props.service,
  (s) => initFromService(s),
  { immediate: true }
)

watch(scopeKind, (kind) => {
  if (kind !== 'product') form.value.productId = ''
  if (kind !== 'category') form.value.categoryId = ''
})

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

onMounted(() => loadOptions())

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!form.value.name?.trim()) e.name = 'Name is required'
  if (form.value.price == null || form.value.price < 0) e.price = 'Price must be 0 or greater'
  if (!form.value.type) e.type = 'Type is required'
  errors.value = e
  return Object.keys(e).length === 0
}

function handleSubmit() {
  if (!validate()) return
  const payload: AdminServiceCreatePayload = {
    name: form.value.name.trim(),
    price: Number(form.value.price),
    type: form.value.type as AdminServiceCreatePayload['type'],
    isActive: form.value.isActive
  }
  if (form.value.slug?.trim()) payload.slug = form.value.slug.trim()
  if (form.value.description?.trim()) payload.description = form.value.description.trim()
  if (form.value.durationMinutes !== '' && form.value.durationMinutes != null) {
    payload.durationMinutes = Number(form.value.durationMinutes)
  }
  if (scopeKind.value === 'product' && form.value.productId) {
    payload.productId = form.value.productId
    payload.categoryId = null
  } else   if (scopeKind.value === 'category' && form.value.categoryId) {
    payload.categoryId = form.value.categoryId
    payload.productId = null
  } else {
    payload.productId = null
    payload.categoryId = null
  }
  if (form.value.image?.trim()) payload.image = form.value.image.trim()
  else payload.image = null
  emit('submit', payload)
}
</script>
