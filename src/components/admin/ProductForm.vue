<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <Input
      v-model="form.name"
      label="Product Name"
      required
      :error="errors.name"
    />
    <div>
      <label class="block text-sm font-medium mb-2">Description</label>
      <textarea
        v-model="form.description"
        class="input"
        rows="4"
        required
      ></textarea>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <Input
        v-model.number="form.price"
        type="number"
        label="Price"
        required
        :error="errors.price"
      />
      <Input
        v-model.number="form.stock"
        type="number"
        label="Stock"
        required
        :error="errors.stock"
      />
    </div>
    <Input
      v-model="form.sku"
      label="SKU"
      required
      :error="errors.sku"
    />
    <div>
      <label class="block text-sm font-medium mb-2">Category</label>
      <select v-model="form.categoryId" class="input" required>
        <option value="">Select a category</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <p v-if="errors.categoryId" class="text-red-600 text-sm mt-1">{{ errors.categoryId }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium mb-2">Images (URLs, one per line)</label>
      <textarea
        v-model="imagesText"
        class="input"
        rows="3"
        placeholder="Enter image URLs, one per line"
        @input="updateImages"
      ></textarea>
    </div>
    <div>
      <label class="block text-sm font-medium mb-2">Status</label>
      <select v-model="form.status" class="input">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="draft">Draft</option>
      </select>
    </div>
    <div class="flex justify-end space-x-4">
      <Button type="button" variant="secondary" @click="$emit('cancel')">Cancel</Button>
      <Button type="submit" variant="primary" :loading="isLoading">Save</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productsApi } from '@/api/endpoints/products'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import type { Product, Category } from '@/api/types'

const props = defineProps<{
  product?: Product
}>()

const emit = defineEmits<{
  submit: [product: any]
  cancel: []
}>()

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})
const categories = ref<Category[]>([])
const imagesText = ref('')

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  sku: '',
  categoryId: '',
  status: 'active' as 'active' | 'inactive' | 'draft',
  images: [] as string[]
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

const updateImages = () => {
  form.value.images = imagesText.value
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)
}

onMounted(async () => {
  await loadCategories()
  
  if (props.product) {
    form.value = {
      name: props.product.name,
      description: props.product.description,
      price: props.product.price,
      stock: props.product.stock,
      sku: props.product.sku,
      categoryId: props.product.categoryId,
      status: props.product.status,
      images: props.product.images || []
    }
    imagesText.value = (props.product.images || []).join('\n')
  }
})

const handleSubmit = () => {
  errors.value = {}
  
  // Validation
  if (!form.value.name) errors.value.name = 'Product name is required'
  if (!form.value.description) errors.value.description = 'Description is required'
  if (form.value.price <= 0) errors.value.price = 'Price must be greater than 0'
  if (form.value.stock < 0) errors.value.stock = 'Stock cannot be negative'
  if (!form.value.sku) errors.value.sku = 'SKU is required'
  if (!form.value.categoryId) errors.value.categoryId = 'Category is required'
  
  if (Object.keys(errors.value).length > 0) {
    return
  }
  
  // Ensure images array is updated
  updateImages()
  
  emit('submit', { ...form.value })
}
</script>

