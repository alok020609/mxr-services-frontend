<template>
  <div class="product-image-gallery">
    <!-- Main Image -->
    <div class="relative mb-4">
      <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          :src="currentImage || '/placeholder.png'"
          :alt="productName"
          class="w-full h-full object-cover cursor-pointer transition-opacity"
          @click="openLightbox"
          @error="handleImageError"
        />
      </div>
      
      <!-- Zoom Indicator -->
      <div v-if="images.length > 1" class="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
      
      <!-- Navigation Arrows (for multiple images) -->
      <button
        v-if="images.length > 1"
        @click="previousImage"
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
        aria-label="Previous image"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        v-if="images.length > 1"
        @click="nextImage"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
        aria-label="Next image"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    
    <!-- Thumbnail Strip -->
    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="selectImage(index)"
        :class="[
          'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
          currentIndex === index
            ? 'border-primary-600 ring-2 ring-primary-200'
            : 'border-gray-200 hover:border-gray-300'
        ]"
        aria-label="View image {{ index + 1 }}"
      >
        <img
          :src="image || '/placeholder.png'"
          :alt="`${productName} - Image ${index + 1}`"
          class="w-full h-full object-cover"
          @error="handleThumbnailError(index)"
        />
      </button>
    </div>
    
    <!-- Lightbox Modal -->
    <div
      v-if="showLightbox"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      @click="closeLightbox"
    >
      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        aria-label="Close lightbox"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <button
        v-if="images.length > 1 && currentIndex > 0"
        @click.stop="previousImage"
        class="absolute left-4 text-white hover:text-gray-300 z-10"
        aria-label="Previous image"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        v-if="images.length > 1 && currentIndex < images.length - 1"
        @click.stop="nextImage"
        class="absolute right-4 text-white hover:text-gray-300 z-10"
        aria-label="Next image"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <div class="text-white text-center mb-4">
        <span>{{ currentIndex + 1 }} / {{ images.length }}</span>
      </div>
      
      <img
        :src="currentImage || '/placeholder.png'"
        :alt="productName"
        class="max-w-full max-h-[90vh] object-contain"
        @click.stop
        @error="handleImageError"
      />
      
      <!-- Keyboard Navigation Hint -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        <span v-if="images.length > 1">Use arrow keys or click arrows to navigate</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  images: string[]
  productName: string
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  productName: ''
})

const currentIndex = ref(0)
const showLightbox = ref(false)

const currentImage = computed(() => {
  if (props.images.length === 0) return '/placeholder.png'
  return props.images[currentIndex.value] || props.images[0] || '/placeholder.png'
})

const selectImage = (index: number) => {
  if (index >= 0 && index < props.images.length) {
    currentIndex.value = index
  }
}

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0 // Loop back to first
  }
}

const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.images.length - 1 // Loop to last
  }
}

const openLightbox = () => {
  if (props.images.length > 0) {
    showLightbox.value = true
  }
}

const closeLightbox = () => {
  showLightbox.value = false
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder.png'
}

const handleThumbnailError = (index: number) => {
  // Replace failed thumbnail with placeholder
  if (props.images[index]) {
    // Could emit an event or handle differently if needed
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!showLightbox.value) return
  
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    nextImage()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    previousImage()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    closeLightbox()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.product-image-gallery {
  position: relative;
}

/* Smooth transitions */
img {
  transition: opacity 0.3s ease;
}

/* Scrollbar styling for thumbnails */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
