<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
    <Input
      v-model="form.name"
      label="Category Name"
      :error="errors.name"
      @input="generateSlug"
    />
    <Input
      v-model="form.slug"
      label="Slug"
      :error="errors.slug"
      placeholder="category-slug"
    />
    <div>
      <label class="block text-sm font-medium mb-2">Description</label>
      <textarea
        v-model="form.description"
        class="input"
        rows="4"
        placeholder="Enter category description (optional)"
      ></textarea>
      <p v-if="errors.description" class="text-red-600 text-sm mt-1">{{ errors.description }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium mb-2">Parent Category (Optional)</label>
      <select v-model="form.parentId" class="input">
        <option value="">None (Top-level category)</option>
        <option 
          v-for="category in availableParentCategories" 
          :key="category.id" 
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
      <p class="text-sm text-gray-500 mt-1">Select a parent category to create a subcategory</p>
    </div>
    <div>
      <label class="block text-sm font-medium mb-2">Category Image (Optional)</label>
      <ImageUpload
        v-model="imageArray"
        :multiple="false"
        folder="categories"
        :optimize="true"
        @uploaded="handleImageUploaded"
        @error="handleImageError"
      />
      <p v-if="errors.image" class="text-red-600 text-sm mt-1">{{ errors.image }}</p>
    </div>
    <div class="flex justify-end space-x-4">
      <Button type="button" variant="secondary" @click="$emit('cancel')">Cancel</Button>
      <Button type="submit" variant="primary" :loading="isLoading">Save</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { productsApi } from '@/api/endpoints/products'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import ImageUpload from '@/components/common/ImageUpload.vue'
import type { Category } from '@/api/types'

const props = defineProps<{
  category?: Category
}>()

const emit = defineEmits<{
  submit: [category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>]
  cancel: []
}>()

const uiStore = useUIStore()
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})
const categories = ref<Category[]>([])

const form = ref({
  name: '',
  slug: '',
  description: '',
  parentId: '',
  image: ''
})

// Computed property to handle image array for ImageUpload component
const imageArray = computed({
  get: () => form.value.image ? [form.value.image] : [],
  set: (value: string[]) => {
    form.value.image = value.length > 0 ? value[0] : ''
  }
})

// Filter out the current category from parent options (to prevent circular references)
const availableParentCategories = computed(() => {
  if (!props.category) {
    return categories.value
  }
  return categories.value.filter(cat => cat.id !== props.category.id)
})

// Watch for category prop changes to populate form
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    form.value = {
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description || '',
      parentId: newCategory.parentId || '',
      image: newCategory.image || ''
    }
  } else {
    // Reset form for new category
    form.value = {
      name: '',
      slug: '',
      description: '',
      parentId: '',
      image: ''
    }
  }
}, { immediate: true })

const loadCategories = async () => {
  try {
    const response = await productsApi.getCategories()
    if (response.success && response.data) {
      categories.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
    uiStore.showNotification('error', 'Failed to load categories')
  }
}

const generateSlug = () => {
  if (!props.category) {
    // Only auto-generate slug when creating new category
    form.value.slug = form.value.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

const handleImageUploaded = (imageUrls: string[]) => {
  if (imageUrls.length > 0) {
    form.value.image = imageUrls[0]
  }
}

const handleImageError = (error: string) => {
  uiStore.showNotification('error', `Image upload error: ${error}`)
}

const handleSubmit = async () => {
  errors.value = {}

  // Validation
  if (!form.value.name || form.value.name.trim() === '') {
    errors.value.name = 'Category name is required'
  }

  if (!form.value.slug || form.value.slug.trim() === '') {
    errors.value.slug = 'Slug is required'
  }

  // Validate slug format
  if (form.value.slug && !/^[a-z0-9-]+$/.test(form.value.slug)) {
    errors.value.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
  }

  if (Object.keys(errors.value).length > 0) {
    uiStore.showNotification('error', 'Please correct the form errors')
    return
  }

  isLoading.value = true
  try {
    const categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> = {
      name: form.value.name.trim(),
      slug: form.value.slug.trim(),
      description: form.value.description?.trim() || undefined,
      parentId: form.value.parentId || undefined,
      image: form.value.image || undefined
    }

    emit('submit', categoryData)
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to prepare category data')
    console.error('Category form error:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

