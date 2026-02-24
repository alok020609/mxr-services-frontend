<template>
  <div class="product-questions">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">Questions & Answers</h3>
      <div class="flex items-center gap-2">
        <!-- Filter Toggle -->
        <select
          v-model="showFilter"
          @change="applyFilter"
          class="input text-sm"
          style="width: auto; padding: 0.375rem 0.75rem;"
        >
          <option value="all">All Questions</option>
          <option value="answered">Answered Only</option>
          <option value="unanswered">Unanswered Only</option>
        </select>
        <Button
          v-if="isAuthenticated"
          variant="primary"
          size="sm"
          @click="showAskForm = !showAskForm"
        >
          Ask a Question
        </Button>
      </div>
    </div>
    
    <!-- Ask Question Form -->
    <div v-if="showAskForm && isAuthenticated" class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h4 class="font-semibold mb-3">Ask a Question</h4>
      <div class="space-y-3">
        <textarea
          v-model="newQuestion"
          placeholder="Enter your question about this product..."
          rows="4"
          class="input w-full"
        ></textarea>
        <div class="flex justify-end gap-2">
          <Button variant="secondary" size="sm" @click="cancelAsk">Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            @click="submitQuestion"
            :loading="isSubmitting"
            :disabled="!newQuestion.trim()"
          >
            Submit Question
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Questions List -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="questions.length === 0" class="text-center py-8 text-gray-500">
      <p>No questions yet. Be the first to ask!</p>
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="question in questions"
        :key="question.id"
        class="border rounded-lg p-4"
      >
        <div class="mb-2">
          <p class="font-semibold text-gray-800 mb-1">Q: {{ question.question }}</p>
          <p class="text-xs text-gray-500">
            Asked {{ formatDate(question.createdAt) }}
            <span v-if="question.askedBy"> by {{ question.askedBy }}</span>
          </p>
        </div>
        
        <div v-if="question.answer" class="mt-3 pt-3 border-t">
          <p class="text-gray-700 mb-1">
            <span class="font-semibold">A:</span> {{ question.answer }}
          </p>
          <p class="text-xs text-gray-500">
            Answered {{ formatDate(question.answeredAt || question.createdAt) }}
            <span v-if="question.answeredBy"> by {{ question.answeredBy }}</span>
          </p>
        </div>
        
        <div v-else class="mt-3 pt-3 border-t">
          <p class="text-sm text-gray-500 italic">Waiting for answer...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { experienceApi } from '@/api/endpoints/experience'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { ProductQuestion } from '@/api/types'

interface Props {
  productId: string
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const authStore = useAuthStore()
const isLoading = ref(false)
const isSubmitting = ref(false)
const questions = ref<ProductQuestion[]>([])
const allQuestions = ref<ProductQuestion[]>([]) // Store all questions
const showAskForm = ref(false)
const newQuestion = ref('')
const showFilter = ref('all') // 'all', 'answered', 'unanswered'

const isAuthenticated = computed(() => authStore.isAuthenticated)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadQuestions = async () => {
  isLoading.value = true
  try {
    // Fetch all questions (both answered and unanswered) - don't pass answeredOnly to get all
    const response = await experienceApi.getProductQuestions(props.productId)
    if (response.success && response.data) {
      // Handle both array and object with data property
      let loadedQuestions: ProductQuestion[] = []
      if (Array.isArray(response.data)) {
        loadedQuestions = response.data
      } else if (response.data.data && Array.isArray(response.data.data)) {
        loadedQuestions = response.data.data
      }
      
      // Store all questions
      allQuestions.value = loadedQuestions
      
      // Sort by creation date (newest first)
      allQuestions.value.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      })
      
      // Apply filter
      applyFilter()
    } else {
      // Check if it's a 404 (questions not found) - this is expected for new products
      const is404 = response.error?.toLowerCase().includes('not found') || 
                    response.error?.toLowerCase().includes('404')
      if (!is404) {
        // Only show error for actual errors (not 404s)
        uiStore.showNotification('error', response.error || 'Failed to load questions')
      }
      allQuestions.value = []
      questions.value = []
    }
  } catch (error: any) {
    // Check if it's a 404 error - this is expected for products without questions
    const is404 = error.response?.status === 404 || 
                  error.message?.toLowerCase().includes('not found') ||
                  error.message?.toLowerCase().includes('404')
    
    if (!is404) {
      // Only show error for actual errors (not 404s)
      uiStore.showNotification('error', error.message || 'Failed to load questions')
    }
    allQuestions.value = []
    questions.value = []
  } finally {
    isLoading.value = false
  }
}

// Apply filter to questions
const applyFilter = () => {
  if (showFilter.value === 'all') {
    questions.value = [...allQuestions.value]
  } else if (showFilter.value === 'answered') {
    questions.value = allQuestions.value.filter(q => q.answer)
  } else if (showFilter.value === 'unanswered') {
    questions.value = allQuestions.value.filter(q => !q.answer)
  }
}

const submitQuestion = async () => {
  if (!newQuestion.value.trim()) return
  
  isSubmitting.value = true
  try {
    const response = await experienceApi.askQuestion(props.productId, newQuestion.value.trim())
    if (response.success) {
      uiStore.showNotification('success', 'Question submitted successfully!')
      newQuestion.value = ''
      showAskForm.value = false
      // Wait a bit for the backend to process, then reload questions
      await new Promise(resolve => setTimeout(resolve, 500))
      await loadQuestions()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to submit question')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to submit question')
  } finally {
    isSubmitting.value = false
  }
}

const cancelAsk = () => {
  showAskForm.value = false
  newQuestion.value = ''
}

onMounted(() => {
  loadQuestions()
})
</script>

