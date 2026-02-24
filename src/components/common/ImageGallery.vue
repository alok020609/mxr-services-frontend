<template>
  <div class="image-gallery">
    <!-- Image Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="(image, index) in images"
        :key="image.id || index"
        class="relative group cursor-pointer"
        @click="openLightbox(index)"
      >
        <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2" :class="image.isPrimary ? 'border-primary-500' : 'border-gray-200'">
          <img
            :src="image.url"
            :alt="image.filename || `Image ${index + 1}`"
            class="w-full h-full object-cover"
          />
        </div>
        
        <!-- Primary Badge -->
        <div v-if="image.isPrimary" class="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
          Primary
        </div>
        
        <!-- Actions Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div class="flex space-x-2">
            <button
              v-if="allowReorder && index > 0"
              @click.stop="moveImage(index, index - 1)"
              class="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Move left"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              v-if="allowSetPrimary && !image.isPrimary"
              @click.stop="setAsPrimary(index)"
              class="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Set as primary"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              v-if="allowDelete"
              @click.stop="deleteImage(index)"
              class="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              title="Delete"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              v-if="allowReorder && index < images.length - 1"
              @click.stop="moveImage(index, index + 1)"
              class="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Move right"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Lightbox Modal -->
    <div
      v-if="lightboxIndex !== null"
      class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      @click="closeLightbox"
    >
      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <button
        v-if="lightboxIndex > 0"
        @click.stop="previousImage"
        class="absolute left-4 text-white hover:text-gray-300 z-10"
      >
        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        v-if="lightboxIndex < images.length - 1"
        @click.stop="nextImage"
        class="absolute right-4 text-white hover:text-gray-300 z-10"
      >
        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <img
        :src="images[lightboxIndex]?.url"
        :alt="images[lightboxIndex]?.filename || 'Image'"
        class="max-w-full max-h-full object-contain"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { productsApi } from '@/api/endpoints/products'
import { useUIStore } from '@/stores/ui'

interface ImageItem {
  id: string
  url: string
  filename?: string
  isPrimary?: boolean
}

const props = withDefaults(defineProps<{
  images: ImageItem[]
  productId: string
  allowReorder?: boolean
  allowSetPrimary?: boolean
  allowDelete?: boolean
}>(), {
  allowReorder: true,
  allowSetPrimary: true,
  allowDelete: true
})

const emit = defineEmits<{
  'reordered': [fromIndex: number, toIndex: number]
  'primary-changed': [imageId: string]
  'deleted': [imageId: string]
}>()

const uiStore = useUIStore()
const lightboxIndex = ref<number | null>(null)

const openLightbox = (index: number) => {
  lightboxIndex.value = index
}

const closeLightbox = () => {
  lightboxIndex.value = null
}

const previousImage = () => {
  if (lightboxIndex.value !== null && lightboxIndex.value > 0) {
    lightboxIndex.value--
  }
}

const nextImage = () => {
  if (lightboxIndex.value !== null && lightboxIndex.value < props.images.length - 1) {
    lightboxIndex.value++
  }
}

const moveImage = async (fromIndex: number, toIndex: number) => {
  const newOrder = [...props.images]
  const [moved] = newOrder.splice(fromIndex, 1)
  newOrder.splice(toIndex, 0, moved)
  
  const imageIds = newOrder.map(img => img.id)
  
  try {
    const response = await productsApi.reorderProductImages(props.productId, imageIds)
    if (response.success) {
      emit('reordered', fromIndex, toIndex)
      uiStore.showNotification('success', 'Images reordered successfully')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to reorder images')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to reorder images')
  }
}

const setAsPrimary = async (index: number) => {
  const image = props.images[index]
  
  try {
    const response = await productsApi.setPrimaryImage(props.productId, image.id)
    if (response.success) {
      emit('primary-changed', image.id)
      uiStore.showNotification('success', 'Primary image updated successfully')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to set primary image')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to set primary image')
  }
}

const deleteImage = async (index: number) => {
  if (!confirm('Are you sure you want to delete this image?')) {
    return
  }
  
  const image = props.images[index]
  
  try {
    const response = await productsApi.deleteProductImage(props.productId, image.id)
    if (response.success) {
      emit('deleted', image.id)
      uiStore.showNotification('success', 'Image deleted successfully')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete image')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete image')
  }
}

// Keyboard navigation for lightbox
const handleKeydown = (event: KeyboardEvent) => {
  if (lightboxIndex.value === null) return
  
  if (event.key === 'Escape') {
    closeLightbox()
  } else if (event.key === 'ArrowLeft') {
    previousImage()
  } else if (event.key === 'ArrowRight') {
    nextImage()
  }
}

// Add keyboard event listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped>
.image-gallery {
  @apply w-full;
}
</style>

