<template>
  <div class="image-upload">
    <!-- Drag and Drop Area -->
    <div
      v-if="!images.length && !isUploading"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
        isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
      ]"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragenter.prevent
    >
      <input
        ref="fileInput"
        type="file"
        :accept="acceptTypes"
        :multiple="multiple"
        class="hidden"
        @change="handleFileSelect"
      />
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p class="text-gray-600 mb-2">
        <button
          type="button"
          @click="$refs.fileInput?.click()"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          Click to upload
        </button>
        or drag and drop
      </p>
      <p class="text-sm text-gray-500">
        {{ acceptTypesText }} (Max {{ maxSizeMB }}MB per file)
      </p>
    </div>

    <!-- Image Preview Grid -->
    <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div
        v-for="(image, index) in images"
        :key="image.id || index"
        class="relative group"
      >
        <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
          <img
            v-if="image.url || image.preview"
            :src="image.url || image.preview"
            :alt="image.filename || `Image ${index + 1}`"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <LoadingSpinner size="sm" />
          </div>
        </div>
        
        <!-- Upload Progress -->
        <div v-if="image.uploading" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div class="text-center text-white">
            <LoadingSpinner size="sm" class="mb-2" />
            <p class="text-xs">{{ image.progress || 0 }}%</p>
          </div>
        </div>
        
        <!-- Actions Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div class="flex space-x-2">
            <button
              v-if="allowReorder && index > 0"
              @click="moveImage(index, index - 1)"
              class="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Move left"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              @click="removeImage(index)"
              class="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              title="Remove"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              v-if="allowReorder && index < images.length - 1"
              @click="moveImage(index, index + 1)"
              class="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Move right"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Primary Badge -->
        <div v-if="image.isPrimary" class="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
          Primary
        </div>
      </div>
    </div>

    <!-- Add More Button -->
    <div v-if="images.length > 0 && !isUploading && (multiple || images.length === 0)" class="mb-4">
      <button
        type="button"
        @click="$refs.fileInput?.click()"
        class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        + Add More Images
      </button>
    </div>

    <!-- URL Input (Optional) -->
    <div v-if="allowUrlInput" class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Or enter image URL</label>
      <div class="flex space-x-2">
        <input
          v-model="urlInput"
          type="url"
          placeholder="https://example.com/image.jpg"
          class="flex-1 input"
          @keyup.enter="addImageFromUrl"
        />
        <button
          type="button"
          @click="addImageFromUrl"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Add
        </button>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="errors.length > 0" class="mb-4">
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
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { mediaApi, type ImageData } from '@/api/endpoints/media'
import { useUploadStore } from '@/stores/upload'
import { normalizeImageUrl } from '@/utils/formatters'
import LoadingSpinner from './LoadingSpinner.vue'

interface ImageItem {
  id?: string
  url?: string
  preview?: string
  filename?: string
  file?: File
  uploading?: boolean
  progress?: number
  isPrimary?: boolean
}

const props = withDefaults(defineProps<{
  modelValue?: string[]
  multiple?: boolean
  maxSizeMB?: number
  acceptTypes?: string
  folder?: string
  optimize?: boolean
  allowUrlInput?: boolean
  allowReorder?: boolean
}>(), {
  modelValue: () => [],
  multiple: true,
  maxSizeMB: 10,
  acceptTypes: 'image/jpeg,image/png,image/webp,image/gif',
  folder: 'products',
  optimize: true,
  allowUrlInput: false,
  allowReorder: true
})

const emit = defineEmits<{
  'update:modelValue': [urls: string[]]
  'uploaded': [images: ImageData[]]
  'removed': [index: number]
  'reordered': [fromIndex: number, toIndex: number]
  'error': [error: string]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const images = ref<ImageItem[]>([])
const urlInput = ref('')
const errors = ref<string[]>([])
const isUploading = ref(false)
const uploadStore = useUploadStore()

const acceptTypesText = computed(() => {
  const types = props.acceptTypes.split(',').map(t => t.split('/')[1]?.toUpperCase() || t)
  return types.join(', ')
})

// Track if we're initializing to prevent circular updates
const isInitializing = ref(true)

// Initialize images from modelValue on mount
onMounted(() => {
  // Initialize images from modelValue immediately on mount
  if (props.modelValue && props.modelValue.length > 0) {
    images.value = props.modelValue.map(url => ({ url: normalizeImageUrl(url) }))
  } else {
    images.value = []
  }
  
  // Mark initialization as complete after first render
  nextTick(() => {
    isInitializing.value = false
  })
})

// Watch for modelValue changes (both during and after initialization)
watch(() => props.modelValue, (urls, oldUrls) => {
  // During initialization, only set if not already set in onMounted
  if (isInitializing.value) {
    // If images are empty and we have URLs, set them
    if ((!images.value || images.value.length === 0) && urls && urls.length > 0) {
      images.value = urls.map(url => ({ url: normalizeImageUrl(url) }))
    }
    return
  }
  
  // After initialization, only update if the URLs actually changed
  const currentUrls = images.value
    .filter(img => img.url && !img.uploading)
    .map(img => img.url!)
    .sort()
  const newUrls = (urls || []).map(url => normalizeImageUrl(url)).sort()
  
  // Only update if URLs have actually changed
  if (JSON.stringify(currentUrls) !== JSON.stringify(newUrls)) {
    if (urls && urls.length > 0) {
      images.value = urls.map(url => ({ url: normalizeImageUrl(url) }))
    } else {
      images.value = []
    }
  }
}, { immediate: true, deep: true })

// Emit updated URLs when images change
watch(images, (newImages) => {
  // Skip if we're initializing to prevent circular updates
  if (isInitializing.value) return
  
  const urls = newImages
    .filter(img => img.url && !img.uploading)
    .map(img => img.url!)
  emit('update:modelValue', urls)
}, { deep: true })

const validateFile = (file: File): string | null => {
  // Check file type
  if (!props.acceptTypes.split(',').some(type => file.type.match(type.trim()))) {
    return `File type not allowed. Allowed types: ${acceptTypesText.value}`
  }
  
  // Check file size
  const maxSizeBytes = props.maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return `File size exceeds maximum limit of ${props.maxSizeMB}MB`
  }
  
  return null
}

const createPreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

const uploadFile = async (file: File): Promise<ImageData> => {
  const maxSizeBytes = props.maxSizeMB * 1024 * 1024
  
  // Use chunked upload for large files
  if (file.size > maxSizeBytes) {
    return await uploadChunked(file)
  }
  
  // Regular upload for smaller files
  const response = await mediaApi.uploadImage(file, {
    folder: props.folder,
    optimize: props.optimize
  })
  
  if (response.success && response.data) {
    return response.data
  }
  
  throw new Error(response.error || 'Upload failed')
}

const uploadChunked = async (file: File): Promise<ImageData> => {
  const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Upload chunks
  for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
    const start = chunkNumber * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)
    
    const response = await mediaApi.uploadChunk(
      chunk,
      uploadId,
      chunkNumber,
      totalChunks,
      file.name,
      file.size,
      props.folder
    )
    
    if (!response.success) {
      throw new Error(response.error || 'Chunk upload failed')
    }
    
    // Update progress
    const imageIndex = images.value.findIndex(img => img.file === file)
    if (imageIndex !== -1) {
      const progress = Math.round(((chunkNumber + 1) / totalChunks) * 100)
      images.value[imageIndex].progress = progress
    }
    
    // Poll for status on last chunk
    if (chunkNumber === totalChunks - 1 && response.data?.completed) {
      return response.data.image
    }
  }
  
  // Poll for completion
  let attempts = 0
  while (attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const statusResponse = await mediaApi.getUploadStatus(uploadId)
    
    if (statusResponse.success && statusResponse.data) {
      const status = statusResponse.data
      
      const imageIndex = images.value.findIndex(img => img.file === file)
      if (imageIndex !== -1) {
        images.value[imageIndex].progress = status.progress
      }
      
      if (status.status === 'completed') {
        // Get the image data - might need to be handled differently
        throw new Error('Chunked upload completed but image data not available')
      } else if (status.status === 'failed') {
        throw new Error(status.error || 'Upload failed')
      }
    }
    
    attempts++
  }
  
  throw new Error('Upload timeout')
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    await processFiles(Array.from(target.files))
    target.value = '' // Reset input
  }
}

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    await processFiles(Array.from(event.dataTransfer.files))
  }
}

const processFiles = async (files: File[]) => {
  errors.value = []
  isUploading.value = true
  
  for (const file of files) {
    const error = validateFile(file)
    if (error) {
      errors.value.push(`${file.name}: ${error}`)
      emit('error', error)
      continue
    }
    
    // Create preview
    const preview = await createPreview(file)
    const imageItem: ImageItem = {
      file,
      preview,
      filename: file.name,
      uploading: true,
      progress: 0
    }
    
    images.value.push(imageItem)
    
    try {
      const imageData = await uploadFile(file)
      const index = images.value.findIndex(img => img.file === file)
      if (index !== -1) {
        images.value[index] = {
          id: imageData.id,
          url: normalizeImageUrl(imageData.url),
          filename: imageData.filename,
          uploading: false,
          progress: 100
        }
      }
    } catch (error: any) {
      const index = images.value.findIndex(img => img.file === file)
      if (index !== -1) {
        images.value.splice(index, 1)
      }
      errors.value.push(`${file.name}: ${error.message || 'Upload failed'}`)
      emit('error', error.message || 'Upload failed')
    }
  }
  
  isUploading.value = false
  
  // Emit uploaded images
  const uploadedImages = images.value
    .filter(img => img.url && !img.uploading)
    .map(img => ({
      id: img.id || '',
      url: img.url!,
      filename: img.filename || '',
      mimeType: 'image/jpeg',
      size: 0,
      uploadedAt: new Date().toISOString()
    } as ImageData))
  
  if (uploadedImages.length > 0) {
    emit('uploaded', uploadedImages)
  }
}

const addImageFromUrl = () => {
  if (urlInput.value.trim()) {
    const imageItem: ImageItem = {
      url: urlInput.value.trim()
    }
    images.value.push(imageItem)
    urlInput.value = ''
  }
}

const removeImage = (index: number) => {
  const image = images.value[index]
  images.value.splice(index, 1)
  emit('removed', index)
}

const moveImage = (fromIndex: number, toIndex: number) => {
  const image = images.value[fromIndex]
  images.value.splice(fromIndex, 1)
  images.value.splice(toIndex, 0, image)
  emit('reordered', fromIndex, toIndex)
}
</script>

<style scoped>
.image-upload {
  @apply w-full;
}
</style>

