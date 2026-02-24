<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="error || !post" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-3xl font-bold mb-4">Post Not Found</h1>
        <p class="text-gray-600 mb-6">{{ error || 'The blog post you are looking for does not exist.' }}</p>
        <div class="flex gap-4 justify-center">
          <router-link to="/blog" class="btn btn-primary">Back to Blog</router-link>
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
              <router-link to="/blog" class="hover:text-primary-600">Blog</router-link>
            </li>
            <li>/</li>
            <li class="text-gray-900 font-medium line-clamp-1">{{ post.title }}</li>
          </ol>
        </nav>
        
        <!-- Post Content -->
        <article class="card">
          <header class="mb-6 pb-6 border-b">
            <h1 class="text-4xl font-bold mb-4 text-gray-900">{{ post.title }}</h1>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div v-if="post.author" class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ post.author }}
              </div>
              <div v-if="post.createdAt" class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Published on {{ formatDate(post.createdAt) }}
              </div>
            </div>
          </header>
          
          <div v-if="post.excerpt" class="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-primary-600">
            <p class="text-lg text-gray-700 italic">{{ post.excerpt }}</p>
          </div>
          
          <div
            class="prose prose-lg max-w-none cms-content"
            v-html="post.content"
          ></div>
        </article>
        
        <!-- Navigation -->
        <div class="mt-8 flex justify-between items-center">
          <router-link to="/blog" class="btn btn-secondary inline-flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </router-link>
          
          <!-- Social Sharing (Optional) -->
          <div class="flex gap-2">
            <button
              @click="shareOnTwitter"
              class="p-2 text-gray-600 hover:text-blue-400 transition-colors"
              title="Share on Twitter"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </button>
            <button
              @click="shareOnFacebook"
              class="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Share on Facebook"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </button>
            <button
              @click="copyLink"
              class="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Copy link"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
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
import type { BlogPost } from '@/api/types'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const uiStore = useUIStore()
const sidebarOpen = ref(false)
const post = ref<BlogPost | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const loadPost = async () => {
  const slug = route.params.slug as string
  if (!slug) {
    error.value = 'Invalid post slug'
    return
  }
  
  isLoading.value = true
  error.value = null
  try {
    const response = await cmsApi.getBlogPost(slug)
    if (response.success && response.data) {
      // Only show published posts
      if (response.data.status === 'draft') {
        error.value = 'This post is not available'
        return
      }
      post.value = response.data
    } else {
      error.value = response.error || 'Post not found'
    }
  } catch (err: any) {
    if (err.response?.status === 404) {
      error.value = 'Post not found'
    } else {
      error.value = err.message || 'An error occurred while loading the post'
      uiStore.showNotification('error', 'Failed to load blog post')
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

const shareOnTwitter = () => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.value?.title || '')}&url=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank')
}

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    uiStore.showNotification('success', 'Link copied to clipboard!')
  } catch (err) {
    uiStore.showNotification('error', 'Failed to copy link')
  }
}

onMounted(() => {
  loadPost()
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

