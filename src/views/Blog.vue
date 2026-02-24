<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-4">Blog</h1>
        <p class="text-gray-600">Latest news, updates, and insights</p>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="loadBlogPosts" class="btn btn-primary">Try Again</button>
      </div>
      
      <div v-else-if="publishedPosts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p class="text-gray-600 text-lg mb-4">No blog posts available at the moment</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="post in publishedPosts"
          :key="post.slug"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
          @click="$router.push(`/blog/${post.slug}`)"
        >
          <div class="p-6">
            <h2 class="text-xl font-bold mb-3 text-gray-900 line-clamp-2">{{ post.title }}</h2>
            <p v-if="post.excerpt" class="text-gray-600 mb-4 line-clamp-3">
              {{ post.excerpt }}
            </p>
            <p v-else-if="post.content" class="text-gray-600 mb-4 line-clamp-3">
              {{ getExcerpt(post.content) }}
            </p>
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span v-if="post.author">{{ post.author }}</span>
                <span v-else>Admin</span>
              </div>
              <span v-if="post.createdAt">
                {{ formatDate(post.createdAt) }}
              </span>
            </div>
            <div class="text-primary-600 font-medium">Read More →</div>
          </div>
        </article>
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
import type { BlogPost } from '@/api/types'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const sidebarOpen = ref(false)
const blogPosts = ref<BlogPost[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const publishedPosts = computed(() => {
  return blogPosts.value.filter(post => post.status === 'published' || !post.status)
})

const loadBlogPosts = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await cmsApi.getBlog()
    if (response.success && response.data) {
      blogPosts.value = Array.isArray(response.data) ? response.data : []
    } else {
      error.value = response.error || 'Failed to load blog posts'
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred while loading blog posts'
    uiStore.showNotification('error', 'Failed to load blog posts')
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
  loadBlogPosts()
})
</script>

