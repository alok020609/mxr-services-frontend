<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-2xl w-full">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to Ecommerce Setup</h1>
        <p class="text-gray-600 mb-8">Let's get your store up and running in a few steps</p>
        
        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Step {{ currentStepIndex + 1 }} of {{ totalSteps }}</span>
            <span class="text-sm text-gray-500">{{ Math.round(((currentStepIndex + 1) / totalSteps) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Step Content -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ currentStep.title }}</h2>
          <p class="text-gray-600 mb-6">{{ currentStep.description }}</p>
          
          <!-- Step Components -->
          <component :is="currentStepComponent" @next="handleNext" @back="handleBack" />
        </div>
        
        <!-- Navigation Buttons -->
        <div class="flex justify-between">
          <Button
            v-if="currentStepIndex > 0"
            variant="secondary"
            @click="handleBack"
          >
            Previous
          </Button>
          <div v-else></div>
          
          <Button
            variant="primary"
            @click="handleNext"
            :loading="isValidating"
          >
            {{ currentStepIndex === totalSteps - 1 ? 'Complete Setup' : 'Next' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { setupSteps } from './setupSteps'
import { useConfigStore } from '@/config/store'
import Button from '@/components/common/Button.vue'

const router = useRouter()
const configStore = useConfigStore()

const currentStepIndex = ref(0)
const isValidating = ref(false)

const totalSteps = computed(() => setupSteps.length)
const currentStep = computed(() => setupSteps[currentStepIndex.value])
const currentStepComponent = computed(() => {
  // Return component name - would need to import actual components
  return 'div'
})

const handleNext = async () => {
  isValidating.value = true
  
  try {
    // Validate current step
    if (currentStep.value.validate) {
      const isValid = await currentStep.value.validate()
      if (!isValid) {
        return
      }
    }
    
    // Move to next step or complete
    if (currentStepIndex.value < totalSteps.value - 1) {
      currentStepIndex.value++
    } else {
      // Complete setup
      configStore.setInitialized(true)
      router.push({ name: 'Home' })
    }
  } finally {
    isValidating.value = false
  }
}

const handleBack = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

onMounted(() => {
  // Check if already initialized
  if (configStore.config.initialized) {
    router.push({ name: 'Home' })
  }
})
</script>

