<template>
  <div class="faqs">
    <div class="mb-4">
      <select v-model="selectedCategory" @change="loadFAQs" class="input text-sm">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="faqs.length === 0" class="text-center py-8 text-gray-500">
      <p>No FAQs found</p>
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="faq in faqs"
        :key="faq.id"
        class="card"
      >
        <button
          @click="toggleFAQ(faq.id)"
          class="w-full text-left flex items-center justify-between"
        >
          <h4 class="font-semibold">{{ faq.question }}</h4>
          <svg
            :class="['h-5 w-5 transition-transform', expandedFAQs.includes(faq.id) ? 'rotate-180' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="expandedFAQs.includes(faq.id)" class="mt-3 text-gray-600">
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supportApi, type FAQ } from '@/api/endpoints/support'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const isLoading = ref(false)
const faqs = ref<FAQ[]>([])
const selectedCategory = ref('')
const expandedFAQs = ref<string[]>([])

const categories = computed(() => {
  const cats = new Set<string>()
  faqs.value.forEach(faq => {
    if (faq.category) cats.add(faq.category)
  })
  return Array.from(cats).sort()
})

const toggleFAQ = (id: string) => {
  const index = expandedFAQs.value.indexOf(id)
  if (index > -1) {
    expandedFAQs.value.splice(index, 1)
  } else {
    expandedFAQs.value.push(id)
  }
}

const loadFAQs = async () => {
  isLoading.value = true
  try {
    const response = await supportApi.getFAQs(selectedCategory.value || undefined)
    if (response.success && response.data) {
      faqs.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    console.error('Failed to load FAQs:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadFAQs()
})
</script>

