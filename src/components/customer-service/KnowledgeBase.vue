<template>
  <div class="knowledge-base">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">Knowledge Base</h3>
      <select v-model="selectedCategory" @change="loadArticles" class="input text-sm">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="articles.length === 0" class="text-center py-8 text-gray-500">
      <p>No articles found</p>
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="article in articles"
        :key="article.id"
        class="card cursor-pointer hover:shadow-md transition-shadow"
        @click="selectedArticle = article"
      >
        <h4 class="font-semibold mb-2">{{ article.title }}</h4>
        <p class="text-sm text-gray-600 line-clamp-2">{{ article.content }}</p>
        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span v-if="article.category">{{ article.category }}</span>
          <span v-if="article.views">{{ article.views }} views</span>
        </div>
      </div>
    </div>
    
    <!-- Article Detail Modal -->
    <div
      v-if="selectedArticle"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="selectedArticle = null"
    >
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold">{{ selectedArticle.title }}</h3>
          <button @click="selectedArticle = null" class="text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="prose max-w-none" v-html="selectedArticle.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { customerServiceEnhancedApi } from '@/api/endpoints/customer-service-enhanced'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { KnowledgeBaseArticle } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const articles = ref<KnowledgeBaseArticle[]>([])
const selectedCategory = ref('')
const selectedArticle = ref<KnowledgeBaseArticle | null>(null)

const categories = computed(() => {
  const cats = new Set<string>()
  articles.value.forEach(article => {
    if (article.category) cats.add(article.category)
  })
  return Array.from(cats).sort()
})

const loadArticles = async () => {
  isLoading.value = true
  try {
    const response = await customerServiceEnhancedApi.getKnowledgeBase(selectedCategory.value || undefined)
    if (response.success && response.data) {
      articles.value = Array.isArray(response.data) ? response.data : []
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load articles')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to load articles')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadArticles()
})
</script>

