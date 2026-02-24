<template>
  <div class="video-tutorials">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">Video Tutorials</h3>
      <select v-model="selectedCategory" @change="loadTutorials" class="input text-sm">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="tutorials.length === 0" class="text-center py-8 text-gray-500">
      <p>No tutorials found</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="tutorial in tutorials"
        :key="tutorial.id"
        class="card cursor-pointer group"
        @click="openVideo(tutorial)"
      >
        <div class="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3">
          <img
            v-if="tutorial.thumbnail"
            :src="tutorial.thumbnail"
            :alt="tutorial.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-800">
            <svg class="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity">
            <div class="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform">
              <svg class="h-8 w-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <h4 class="font-semibold mb-1">{{ tutorial.title }}</h4>
        <p v-if="tutorial.description" class="text-sm text-gray-600 line-clamp-2">{{ tutorial.description }}</p>
        <div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <span v-if="tutorial.duration">{{ formatDuration(tutorial.duration) }}</span>
          <span v-if="tutorial.views">{{ tutorial.views }} views</span>
        </div>
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
          <h4 class="text-lg font-bold">{{ selectedVideo.title }}</h4>
          <button @click="closeVideo" class="text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="aspect-video">
          <iframe
            :src="getEmbedUrl(selectedVideo.url)"
            class="w-full h-full rounded"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { customerServiceEnhancedApi } from '@/api/endpoints/customer-service-enhanced'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { VideoTutorial } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const tutorials = ref<VideoTutorial[]>([])
const selectedCategory = ref('')
const selectedVideo = ref<VideoTutorial | null>(null)

const categories = computed(() => {
  const cats = new Set<string>()
  tutorials.value.forEach(tutorial => {
    if (tutorial.category) cats.add(tutorial.category)
  })
  return Array.from(cats).sort()
})

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getEmbedUrl = (url: string) => {
  // Handle YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  
  // Handle Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  return url
}

const openVideo = (tutorial: VideoTutorial) => {
  selectedVideo.value = tutorial
}

const closeVideo = () => {
  selectedVideo.value = null
}

const loadTutorials = async () => {
  isLoading.value = true
  try {
    const response = await customerServiceEnhancedApi.getVideoTutorials(selectedCategory.value || undefined)
    if (response.success && response.data) {
      tutorials.value = Array.isArray(response.data) ? response.data : []
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load tutorials')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to load tutorials')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTutorials()
})
</script>

