<template>
  <div class="product-videos">
    <h3 class="text-lg font-bold mb-4">Product Videos</h3>
    
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="videos.length === 0" class="text-center py-8 text-gray-500">
      <p>No videos available for this product.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="video in videos"
        :key="video.id"
        class="relative cursor-pointer group"
        @click="openVideo(video)"
      >
        <div class="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <img
            v-if="video.thumbnail"
            :src="video.thumbnail"
            :alt="video.title || 'Video thumbnail'"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-800">
            <svg class="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          
          <!-- Play Button Overlay -->
          <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity">
            <div class="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform">
              <svg class="h-8 w-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          
          <!-- Duration Badge -->
          <div v-if="video.duration" class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {{ formatDuration(video.duration) }}
          </div>
        </div>
        
        <p v-if="video.title" class="mt-2 text-sm font-medium text-gray-700">{{ video.title }}</p>
      </div>
    </div>
    
    <!-- Video Modal -->
    <div
      v-if="selectedVideo"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click.self="closeVideo"
    >
      <div class="bg-white rounded-lg max-w-4xl w-full p-4">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-bold">{{ selectedVideo.title || 'Product Video' }}</h4>
          <button
            @click="closeVideo"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="aspect-video">
          <iframe
            v-if="selectedVideo.type === 'youtube'"
            :src="getYouTubeEmbedUrl(selectedVideo.url)"
            class="w-full h-full rounded"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <iframe
            v-else-if="selectedVideo.type === 'vimeo'"
            :src="getVimeoEmbedUrl(selectedVideo.url)"
            class="w-full h-full rounded"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
          ></iframe>
          <video
            v-else
            :src="selectedVideo.url"
            controls
            class="w-full h-full rounded"
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { experienceApi } from '@/api/endpoints/experience'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { ProductVideo } from '@/api/types'

interface Props {
  productId: string
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const isLoading = ref(false)
const videos = ref<ProductVideo[]>([])
const selectedVideo = ref<ProductVideo | null>(null)

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

const getVimeoEmbedUrl = (url: string) => {
  const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url
}

const openVideo = (video: ProductVideo) => {
  selectedVideo.value = video
}

const closeVideo = () => {
  selectedVideo.value = null
}

const loadVideos = async () => {
  isLoading.value = true
  try {
    const response = await experienceApi.getProductVideos(props.productId)
    if (response.success && response.data) {
      videos.value = Array.isArray(response.data) ? response.data : []
      // Sort by order if available
      videos.value.sort((a, b) => (a.order || 0) - (b.order || 0))
    } else {
      // Check if it's a 404 (videos not found) - this is expected for many products
      const is404 = response.error?.toLowerCase().includes('not found') || 
                    response.error?.toLowerCase().includes('404')
      if (!is404) {
        // Only show error for actual errors (not 404s)
        uiStore.showNotification('error', response.error || 'Failed to load videos')
      }
      videos.value = []
    }
  } catch (error: any) {
    // Check if it's a 404 error - this is expected for products without videos
    const is404 = error.response?.status === 404 || 
                  error.message?.toLowerCase().includes('not found') ||
                  error.message?.toLowerCase().includes('404')
    
    if (!is404) {
      // Only show error for actual errors (not 404s)
      uiStore.showNotification('error', error.message || 'Failed to load videos')
    }
    videos.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadVideos()
})
</script>

