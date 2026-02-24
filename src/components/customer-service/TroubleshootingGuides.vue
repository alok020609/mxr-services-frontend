<template>
  <div class="troubleshooting-guides">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">Troubleshooting Guides</h3>
      <select v-model="selectedCategory" @change="loadGuides" class="input text-sm">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="guides.length === 0" class="text-center py-8 text-gray-500">
      <p>No guides found</p>
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="guide in guides"
        :key="guide.id"
        class="card"
      >
        <h4 class="font-semibold mb-2">{{ guide.title }}</h4>
        <p class="text-sm text-gray-600 mb-4">{{ guide.description }}</p>
        
        <div class="space-y-3">
          <div
            v-for="step in guide.steps"
            :key="step.step"
            class="flex gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              {{ step.step }}
            </div>
            <div class="flex-1">
              <h5 class="font-medium mb-1">{{ step.title }}</h5>
              <p class="text-sm text-gray-600">{{ step.description }}</p>
              <img v-if="step.image" :src="step.image" :alt="step.title" class="mt-2 rounded-lg max-w-md" />
            </div>
          </div>
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
import type { TroubleshootingGuide } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const guides = ref<TroubleshootingGuide[]>([])
const selectedCategory = ref('')

const categories = computed(() => {
  const cats = new Set<string>()
  guides.value.forEach(guide => {
    if (guide.category) cats.add(guide.category)
  })
  return Array.from(cats).sort()
})

const loadGuides = async () => {
  isLoading.value = true
  try {
    const response = await customerServiceEnhancedApi.getTroubleshootingGuides(selectedCategory.value || undefined)
    if (response.success && response.data) {
      guides.value = Array.isArray(response.data) ? response.data : []
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load guides')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to load guides')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadGuides()
})
</script>

