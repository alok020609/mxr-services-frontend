<template>
  <div class="product-questions-admin">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-2">Product Questions</h1>
      <p class="text-gray-600">Manage and answer customer questions about products</p>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Product</label>
          <select v-model="filters.productId" @change="loadQuestions" class="input w-full">
            <option value="">All Products</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Status</label>
          <select v-model="filters.answered" @change="loadQuestions" class="input w-full">
            <option :value="undefined">All Questions</option>
            <option :value="false">Unanswered</option>
            <option :value="true">Answered</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search questions..."
            class="input w-full"
            @input="debouncedSearch"
          />
        </div>
        
        <div class="flex items-end">
          <Button variant="secondary" @click="clearFilters" class="w-full">
            Clear Filters
          </Button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Questions</p>
            <p class="text-2xl font-bold">{{ stats.total }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Unanswered</p>
            <p class="text-2xl font-bold text-orange-600">{{ stats.unanswered }}</p>
          </div>
          <div class="p-3 bg-orange-100 rounded-full">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Answered</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.answered }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Questions List -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="questions.length === 0" class="card text-center py-12">
      <p class="text-gray-500">No questions found</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="question in questions"
        :key="question.id"
        class="card"
        :class="{ 'border-l-4 border-orange-500': !question.answer }"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- Product Info -->
            <div class="mb-3">
              <router-link
                :to="`/products/${question.productId}`"
                class="text-sm text-primary-600 hover:underline font-medium"
              >
                {{ getProductName(question.productId) }}
              </router-link>
            </div>
            
            <!-- Question -->
            <div class="mb-3">
              <p class="font-semibold text-gray-800 mb-1">Q: {{ question.question }}</p>
              <p class="text-xs text-gray-500">
                Asked {{ formatDate(question.createdAt) }}
                <span v-if="question.askedBy"> by {{ question.askedBy }}</span>
              </p>
            </div>
            
            <!-- Answer Display/Edit -->
            <div v-if="question.answer" class="mt-3 pt-3 border-t">
              <!-- Edit Mode -->
              <div v-if="editingAnswers[question.id]" class="space-y-3">
                <label class="block text-sm font-medium">Edit Answer</label>
                <textarea
                  v-model="editAnswerForms[question.id]"
                  rows="3"
                  placeholder="Enter your answer..."
                  class="input w-full"
                ></textarea>
                <div class="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    @click="updateAnswer(question.id)"
                    :loading="updatingAnswers[question.id]"
                    :disabled="!editAnswerForms[question.id]?.trim()"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    @click="cancelEditAnswer(question.id)"
                    :disabled="updatingAnswers[question.id]"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              
              <!-- Display Mode -->
              <div v-else>
                <p class="text-gray-700 mb-1">
                  <span class="font-semibold">A:</span> {{ question.answer }}
                </p>
                <p class="text-xs text-gray-500 mb-2">
                  Answered {{ formatDate(question.answeredAt || question.createdAt) }}
                  <span v-if="question.answeredBy"> by {{ question.answeredBy }}</span>
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  @click="startEditAnswer(question.id, question.answer)"
                >
                  Edit Answer
                </Button>
              </div>
            </div>
            
            <!-- Answer Form -->
            <div v-else class="mt-4 pt-4 border-t">
              <div class="space-y-3">
                <label class="block text-sm font-medium">Your Answer</label>
                <textarea
                  v-model="answerForms[question.id]"
                  rows="3"
                  placeholder="Enter your answer..."
                  class="input w-full"
                ></textarea>
                <div class="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    @click="submitAnswer(question.id)"
                    :loading="submittingAnswers[question.id]"
                    :disabled="!answerForms[question.id]?.trim()"
                  >
                    Submit Answer
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    @click="deleteQuestion(question.id)"
                    :loading="deletingQuestions[question.id]"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Status Badge -->
          <div class="ml-4">
            <span
              v-if="question.answer"
              class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              Answered
            </span>
            <span
              v-else
              class="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
            >
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
      <Button
        variant="secondary"
        size="sm"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Previous
      </Button>
      <span class="text-sm text-gray-600">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <Button
        variant="secondary"
        size="sm"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { experienceApi } from '@/api/endpoints/experience'
import { productsApi } from '@/api/endpoints/products'
import { useUIStore } from '@/stores/ui'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { ProductQuestion, Product } from '@/api/types'

const uiStore = useUIStore()

const isLoading = ref(false)
const questions = ref<ProductQuestion[]>([])
const products = ref<Product[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalQuestions = ref(0)

const filters = ref({
  productId: '',
  answered: undefined as boolean | undefined
})

const answerForms = ref<Record<string, string>>({})
const editAnswerForms = ref<Record<string, string>>({})
const editingAnswers = ref<Record<string, boolean>>({})
const submittingAnswers = ref<Record<string, boolean>>({})
const updatingAnswers = ref<Record<string, boolean>>({})
const deletingQuestions = ref<Record<string, boolean>>({})

// Store all questions for stats calculation (not filtered)
const allQuestionsForStats = ref<ProductQuestion[]>([])

const stats = computed(() => {
  // Use allQuestionsForStats for accurate stats regardless of current filter
  const total = totalQuestions.value || allQuestionsForStats.value.length
  const answered = allQuestionsForStats.value.filter(q => q.answer).length
  const unanswered = total - answered
  return { total, answered, unanswered }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getProductName = (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  return product?.name || `Product ${productId.slice(0, 8)}...`
}

const loadProducts = async () => {
  try {
    const response = await productsApi.getProducts({ limit: 1000 })
    if (response.success && response.data) {
      products.value = Array.isArray(response.data) ? response.data : response.data.data || []
    }
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

// Load all questions without filters for accurate stats
const loadAllQuestionsForStats = async () => {
  try {
    const response = await experienceApi.getAllQuestions({ limit: 1000 })
    if (response.success && response.data) {
      if (Array.isArray(response.data)) {
        allQuestionsForStats.value = response.data
      } else {
        allQuestionsForStats.value = response.data.data || []
      }
    }
  } catch (error) {
    // Silently fail - stats will use filtered questions
    console.error('Failed to load all questions for stats:', error)
  }
}

const loadQuestions = async () => {
  isLoading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      limit: 20
    }
    
    if (filters.value.productId) {
      params.productId = filters.value.productId
    }
    
    if (filters.value.answered !== undefined) {
      params.answered = filters.value.answered
    }
    
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    
    const response = await experienceApi.getAllQuestions(params)
    if (response.success && response.data) {
      if (Array.isArray(response.data)) {
        questions.value = response.data
        totalQuestions.value = response.data.length
        totalPages.value = 1
      } else {
        questions.value = response.data.data || []
        totalQuestions.value = response.data.pagination?.total || response.data.data?.length || 0
        totalPages.value = response.data.pagination?.totalPages || 1
      }
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load questions')
      questions.value = []
    }
  } catch (error: any) {
    // Handle 404 gracefully (no questions yet)
    if (error.response?.status === 404) {
      questions.value = []
      totalQuestions.value = 0
      totalPages.value = 1
    } else {
      uiStore.showNotification('error', error.message || 'Failed to load questions')
      questions.value = []
    }
  } finally {
    isLoading.value = false
  }
}

const submitAnswer = async (questionId: string) => {
  const answer = answerForms.value[questionId]?.trim()
  if (!answer) return
  
  submittingAnswers.value[questionId] = true
  try {
    const response = await experienceApi.answerQuestion(questionId, answer)
    if (response.success) {
      uiStore.showNotification('success', 'Answer submitted successfully!')
      delete answerForms.value[questionId]
      // Reload questions and stats
      await loadQuestions()
      await loadAllQuestionsForStats()
    } else {
      // Show the actual error message from backend
      const errorMsg = response.error || 'Failed to submit answer'
      uiStore.showNotification('error', errorMsg)
      console.error('Answer submission error:', response)
    }
  } catch (error: any) {
    // Extract error message from response
    const errorMsg = error.response?.data?.error || 
                     error.response?.data?.message || 
                     error.message || 
                     'Failed to submit answer'
    uiStore.showNotification('error', errorMsg)
    console.error('Answer submission error:', error)
  } finally {
    submittingAnswers.value[questionId] = false
  }
}

const startEditAnswer = (questionId: string, currentAnswer: string) => {
  editingAnswers.value[questionId] = true
  editAnswerForms.value[questionId] = currentAnswer
}

const cancelEditAnswer = (questionId: string) => {
  editingAnswers.value[questionId] = false
  delete editAnswerForms.value[questionId]
}

const updateAnswer = async (questionId: string) => {
  const answer = editAnswerForms.value[questionId]?.trim()
  if (!answer) return
  
  updatingAnswers.value[questionId] = true
  try {
    const response = await experienceApi.updateAnswer(questionId, answer)
    if (response.success) {
      uiStore.showNotification('success', 'Answer updated successfully!')
      editingAnswers.value[questionId] = false
      delete editAnswerForms.value[questionId]
      // Reload questions and stats
      await loadQuestions()
      await loadAllQuestionsForStats()
    } else {
      // Show the actual error message from backend
      const errorMsg = response.error || 'Failed to update answer'
      uiStore.showNotification('error', errorMsg)
      console.error('Answer update error:', response)
    }
  } catch (error: any) {
    // Extract error message from response
    const errorMsg = error.response?.data?.error || 
                     error.response?.data?.message || 
                     error.message || 
                     'Failed to update answer'
    uiStore.showNotification('error', errorMsg)
    console.error('Answer update error:', error)
  } finally {
    updatingAnswers.value[questionId] = false
  }
}

const deleteQuestion = async (questionId: string) => {
  if (!confirm('Are you sure you want to delete this question?')) return
  
  deletingQuestions.value[questionId] = true
  try {
    const response = await experienceApi.deleteQuestion(questionId)
    if (response.success) {
      uiStore.showNotification('success', 'Question deleted successfully!')
      await loadQuestions()
      await loadAllQuestionsForStats()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete question')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete question')
  } finally {
    deletingQuestions.value[questionId] = false
  }
}

const clearFilters = () => {
  filters.value = {
    productId: '',
    answered: undefined
  }
  searchQuery.value = ''
  currentPage.value = 1
  loadQuestions()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadQuestions()
  }
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadQuestions()
  }, 500)
}

onMounted(async () => {
  await loadProducts()
  await loadQuestions()
  // Load all questions for stats
  await loadAllQuestionsForStats()
})
</script>

<style scoped>
.product-questions-admin {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
