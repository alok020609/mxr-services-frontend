<template>
  <div v-if="activeBanners.length > 0" class="banner-carousel relative">
    <div class="relative overflow-hidden rounded-lg">
      <div
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(banner, index) in activeBanners"
          :key="banner.id"
          class="w-full flex-shrink-0 relative"
        >
          <a
            v-if="banner.linkUrl"
            :href="banner.linkUrl"
            class="block"
            :target="isExternalLink(banner.linkUrl) ? '_blank' : '_self'"
            :rel="isExternalLink(banner.linkUrl) ? 'noopener noreferrer' : undefined"
          >
            <img
              :src="banner.imageUrl"
              :alt="banner.title"
              class="w-full h-auto object-cover"
              :style="{ maxHeight: height }"
              @error="handleImageError"
            />
          </a>
          <div v-else>
            <img
              :src="banner.imageUrl"
              :alt="banner.title"
              class="w-full h-auto object-cover"
              :style="{ maxHeight: height }"
              @error="handleImageError"
            />
          </div>
          
          <!-- Banner Title Overlay (Optional) -->
          <div
            v-if="showTitle && banner.title"
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6"
          >
            <h3 class="text-white text-xl font-bold">{{ banner.title }}</h3>
          </div>
        </div>
      </div>
      
      <!-- Navigation Arrows -->
      <button
        v-if="activeBanners.length > 1"
        @click="previousBanner"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
        aria-label="Previous banner"
      >
        <svg class="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        v-if="activeBanners.length > 1"
        @click="nextBanner"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
        aria-label="Next banner"
      >
        <svg class="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <!-- Dots Indicator -->
      <div
        v-if="activeBanners.length > 1 && showDots"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
      >
        <button
          v-for="(banner, index) in activeBanners"
          :key="banner.id"
          @click="goToBanner(index)"
          :class="[
            'w-2 h-2 rounded-full transition-all',
            index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
          ]"
          :aria-label="`Go to banner ${index + 1}`"
        />
      </div>
    </div>
  </div>
  
  <div v-else-if="isLoading" class="banner-carousel flex items-center justify-center" :style="{ minHeight: height }">
    <LoadingSpinner size="md" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { cmsApi } from '@/api/endpoints/cms'
import type { Banner } from '@/api/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

interface Props {
  height?: string
  autoRotate?: boolean
  rotateInterval?: number
  showTitle?: boolean
  showDots?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  autoRotate: true,
  rotateInterval: 5000,
  showTitle: false,
  showDots: true
})

const banners = ref<Banner[]>([])
const isLoading = ref(false)
const currentIndex = ref(0)
let autoRotateTimer: ReturnType<typeof setInterval> | null = null

const activeBanners = computed(() => {
  return banners.value.filter(banner => banner.status === 'active')
})

const loadBanners = async () => {
  isLoading.value = true
  try {
    const response = await cmsApi.getBanners()
    if (response.success && response.data) {
      banners.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    console.error('Failed to load banners:', error)
  } finally {
    isLoading.value = false
  }
}

const nextBanner = () => {
  if (activeBanners.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % activeBanners.value.length
}

const previousBanner = () => {
  if (activeBanners.value.length === 0) return
  currentIndex.value = currentIndex.value === 0 ? activeBanners.value.length - 1 : currentIndex.value - 1
}

const goToBanner = (index: number) => {
  if (index >= 0 && index < activeBanners.value.length) {
    currentIndex.value = index
  }
}

const startAutoRotate = () => {
  if (props.autoRotate && activeBanners.value.length > 1) {
    autoRotateTimer = setInterval(() => {
      nextBanner()
    }, props.rotateInterval)
  }
}

const stopAutoRotate = () => {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer)
    autoRotateTimer = null
  }
}

const isExternalLink = (url: string): boolean => {
  try {
    const link = new URL(url, window.location.href)
    return link.origin !== window.location.origin
  } catch {
    return false
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder.jpg'
}

onMounted(() => {
  loadBanners().then(() => {
    if (activeBanners.value.length > 0) {
      startAutoRotate()
    }
  })
})

onUnmounted(() => {
  stopAutoRotate()
})
</script>

<style scoped>
.banner-carousel {
  width: 100%;
}
</style>

