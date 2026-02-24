<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-6">
        <svg class="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p class="text-gray-600 mb-6">
        We're sorry, but something unexpected happened. Please try refreshing the page.
      </p>
      <div class="space-y-3">
        <button
          @click="handleReload"
          class="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Reload Page
        </button>
        <button
          @click="handleReset"
          class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Go Home
        </button>
      </div>
      <details v-if="showDetails" class="mt-6 text-left">
        <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          Error Details
        </summary>
        <pre class="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hasError = ref(false)
const errorDetails = ref<string>('')
const showDetails = ref(false)

onErrorCaptured((err: Error) => {
  hasError.value = true
  errorDetails.value = err.stack || err.message || 'Unknown error'
  
  // Log error for debugging
  console.error('[Error Boundary]', {
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  })
  
  // In development, show details by default
  if (import.meta.env.DEV) {
    showDetails.value = true
  }
  
  return false // Prevent error from propagating
})

onMounted(() => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    hasError.value = true
    errorDetails.value = event.reason?.message || 'Unhandled promise rejection'
    console.error('[Error Boundary] Unhandled rejection:', event.reason)
    event.preventDefault()
  })
})

const handleReload = () => {
  window.location.reload()
}

const handleReset = () => {
  hasError.value = false
  errorDetails.value = ''
  router.push('/')
}
</script>

