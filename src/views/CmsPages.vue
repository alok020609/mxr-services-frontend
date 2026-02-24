<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-4">Pages</h1>
        <p class="text-gray-600">Browse our informational pages</p>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="loadPages" class="btn btn-primary">Try Again</button>
      </div>
      
      <div v-else-if="pages.length === 0" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-600 text-lg mb-4">No pages available at the moment</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="page in publishedPages"
          :key="page.slug"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
          @click="$router.push(`/pages/${page.slug}`)"
        >
          <div class="p-6">
            <h2 class="text-xl font-bold mb-3 text-gray-900">{{ page.title }}</h2>
            <p v-if="page.content" class="text-gray-600 mb-4 line-clamp-3">
              {{ getExcerpt(page.content) }}
            </p>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span v-if="page.createdAt">
                {{ formatDate(page.createdAt) }}
              </span>
              <span class="text-primary-600 font-medium">Read More →</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { cmsApi } from '@/api/endpoints/cms'
import { useUIStore } from '@/stores/ui'
import type { CMSPage } from '@/api/types'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const sidebarOpen = ref(false)
const pages = ref<CMSPage[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const publishedPages = computed(() => {
  return pages.value.filter(page => page.status === 'published' || !page.status)
})

const loadPages = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await cmsApi.getPages()
    if (response.success && response.data) {
      pages.value = Array.isArray(response.data) ? response.data : []
    } else {
      error.value = response.error || 'Failed to load pages'
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred while loading pages'
    uiStore.showNotification('error', 'Failed to load pages')
  } finally {
    isLoading.value = false
  }
}

const getExcerpt = (content: string, length: number = 150): string => {
  // Remove HTML tags for excerpt
  const text = content.replace(/<[^>]*>/g, '')
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadPages()
})
</script>

