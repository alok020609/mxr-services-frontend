<template>
  <div class="size-guide">
    <h3 class="text-lg font-bold mb-4">Size Guide</h3>
    
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="text-center py-8 text-red-600">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="guide">
      <!-- Text Description -->
      <p v-if="guide.description" class="mb-4 text-gray-700">{{ guide.description }}</p>
      
      <!-- Table Format -->
      <div v-if="guide.guideType === 'table' && guide.table" class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th class="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold">Size</th>
              <th
                v-for="measurement in guide.measurements"
                :key="measurement"
                class="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold"
              >
                {{ measurement }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in guide.table" :key="index">
              <td class="border border-gray-300 px-4 py-2 font-medium">
                {{ guide.sizes?.[index] || row.size || index + 1 }}
              </td>
              <td
                v-for="measurement in guide.measurements"
                :key="measurement"
                class="border border-gray-300 px-4 py-2 text-center"
              >
                {{ row[measurement] || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Text Format -->
      <div v-else-if="guide.guideType === 'text'" class="prose max-w-none">
        <div v-html="guide.data"></div>
      </div>
      
      <!-- Chart/Other Format -->
      <div v-else class="p-4 bg-gray-50 rounded-lg">
        <pre class="whitespace-pre-wrap text-sm">{{ JSON.stringify(guide.data, null, 2) }}</pre>
      </div>
    </div>
    
    <div v-else class="text-center py-8 text-gray-500">
      <p>Size guide not available for this product.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { experienceApi } from '@/api/endpoints/experience'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { SizeGuide } from '@/api/types'

interface Props {
  productId: string
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref('')
const guide = ref<SizeGuide | null>(null)

const loadSizeGuide = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await experienceApi.getSizeGuide(props.productId)
    if (response.success && response.data) {
      guide.value = response.data
    } else {
      // Check if it's a 404 (size guide not found) - this is expected for many products
      const is404 = response.error?.toLowerCase().includes('not found') || 
                    response.error?.toLowerCase().includes('404')
      if (is404) {
        // 404 is expected - size guide doesn't exist for this product
        guide.value = null
        error.value = ''
      } else {
        error.value = response.error || 'Failed to load size guide'
      }
    }
  } catch (err: any) {
    // Check if it's a 404 error - this is expected for products without size guides
    const is404 = err.response?.status === 404 || 
                  err.message?.toLowerCase().includes('not found') ||
                  err.message?.toLowerCase().includes('404')
    
    if (is404) {
      // 404 is expected - size guide doesn't exist for this product
      guide.value = null
      error.value = ''
    } else {
      // Only show error for actual errors (not 404s)
      error.value = err.message || 'Failed to load size guide'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSizeGuide()
})
</script>

