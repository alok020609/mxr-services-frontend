<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="error || !page" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-3xl font-bold mb-4">Page Not Found</h1>
        <p class="text-gray-600 mb-6">{{ error || 'The page you are looking for does not exist.' }}</p>
        <div class="flex gap-4 justify-center">
          <router-link to="/pages" class="btn btn-primary">Back to Pages</router-link>
          <router-link to="/" class="btn btn-secondary">Go Home</router-link>
        </div>
      </div>
      
      <div v-else class="max-w-4xl mx-auto">
        <!-- Breadcrumb -->
        <nav class="mb-6 text-sm">
          <ol class="flex items-center space-x-2 text-gray-600">
            <li>
              <router-link to="/" class="hover:text-primary-600">Home</router-link>
            </li>
            <li>/</li>
            <li>
              <router-link to="/pages" class="hover:text-primary-600">Pages</router-link>
            </li>
            <li>/</li>
            <li class="text-gray-900 font-medium">{{ page.title }}</li>
          </ol>
        </nav>
        
        <!-- Page Content -->
        <article class="card">
          <header class="mb-6 pb-6 border-b">
            <h1 class="text-4xl font-bold mb-4 text-gray-900">{{ page.title }}</h1>
            <div v-if="page.createdAt" class="flex items-center text-sm text-gray-500">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Published on {{ formatDate(page.createdAt) }}
            </div>
          </header>
          
          <div
            class="prose prose-lg max-w-none cms-content"
            v-html="page.content"
          ></div>
        </article>
        
        <!-- Back Button -->
        <div class="mt-8">
          <router-link to="/pages" class="btn btn-secondary inline-flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Pages
          </router-link>
        </div>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { cmsApi } from '@/api/endpoints/cms'
import { useUIStore } from '@/stores/ui'
import type { CMSPage } from '@/api/types'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const uiStore = useUIStore()
const sidebarOpen = ref(false)
const page = ref<CMSPage | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const loadPage = async () => {
  const slug = route.params.slug as string
  if (!slug) {
    error.value = 'Invalid page slug'
    return
  }
  
  isLoading.value = true
  error.value = null
  try {
    const response = await cmsApi.getPage(slug)
    if (response.success && response.data) {
      // Only show published pages
      if (response.data.status === 'draft') {
        error.value = 'This page is not available'
        return
      }
      page.value = response.data
    } else {
      error.value = response.error || 'Page not found'
    }
  } catch (err: any) {
    if (err.response?.status === 404) {
      error.value = 'Page not found'
    } else {
      error.value = err.message || 'An error occurred while loading the page'
      uiStore.showNotification('error', 'Failed to load page')
    }
  } finally {
    isLoading.value = false
  }
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
  loadPage()
})
</script>

<style scoped>
.cms-content :deep(h1),
.cms-content :deep(h2),
.cms-content :deep(h3),
.cms-content :deep(h4),
.cms-content :deep(h5),
.cms-content :deep(h6) {
  @apply font-bold mb-4 mt-6;
}

.cms-content :deep(h1) {
  @apply text-3xl;
}

.cms-content :deep(h2) {
  @apply text-2xl;
}

.cms-content :deep(h3) {
  @apply text-xl;
}

.cms-content :deep(p) {
  @apply mb-4 text-gray-700 leading-relaxed;
}

.cms-content :deep(ul),
.cms-content :deep(ol) {
  @apply mb-4 ml-6;
}

.cms-content :deep(li) {
  @apply mb-2;
}

.cms-content :deep(a) {
  @apply text-primary-600 hover:underline;
}

.cms-content :deep(img) {
  @apply rounded-lg my-4 max-w-full;
}

.cms-content :deep(blockquote) {
  @apply border-l-4 border-primary-600 pl-4 italic my-4;
}

.cms-content :deep(code) {
  @apply bg-gray-100 px-2 py-1 rounded text-sm;
}

.cms-content :deep(pre) {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto my-4;
}
</style>

