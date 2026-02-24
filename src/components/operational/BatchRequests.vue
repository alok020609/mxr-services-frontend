<template>
  <div class="batch-requests">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Batch Requests</h2>
      <p class="text-sm text-gray-600">Execute multiple API requests in a single HTTP call (Maximum 20 requests)</p>
    </div>

    <!-- Request Builder -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Request Builder</h3>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            {{ requests.length }} / 20 requests
          </span>
          <Button
            variant="primary"
            size="sm"
            @click="addRequest"
            :disabled="requests.length >= 20"
          >
            <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Request
          </Button>
        </div>
      </div>

      <!-- Requests List -->
      <div v-if="requests.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
        <p class="text-gray-500 mb-4">No requests added yet</p>
        <Button variant="primary" @click="addRequest">
          Add Your First Request
        </Button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(request, index) in requests"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <div class="flex items-start justify-between mb-3">
            <span class="text-sm font-medium text-gray-700">Request #{{ index + 1 }}</span>
            <button
              @click="removeRequest(index)"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Method <span class="text-red-500">*</span>
              </label>
              <select
                v-model="request.method"
                class="input"
                @change="onMethodChange(index)"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Path <span class="text-red-500">*</span>
              </label>
              <input
                v-model="request.path"
                type="text"
                class="input"
                placeholder="/products/prod_123"
                required
              />
            </div>
          </div>

          <div v-if="needsBody(request.method)" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Body (JSON)
            </label>
            <textarea
              v-model="request.bodyText"
              class="input font-mono text-sm"
              rows="4"
              placeholder='{"key": "value"}'
              @input="validateBody(index)"
            ></textarea>
            <p v-if="request.bodyError" class="text-red-600 text-xs mt-1">{{ request.bodyError }}</p>
            <p v-else class="text-gray-500 text-xs mt-1">Enter JSON body for this request</p>
          </div>
        </div>
      </div>

      <!-- Execute Button -->
      <div class="mt-6 pt-6 border-t">
        <Button
          variant="primary"
          @click="executeBatch"
          :loading="isExecuting"
          :disabled="requests.length === 0 || hasValidationErrors"
          class="w-full"
        >
          <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Execute Batch ({{ requests.length }} request{{ requests.length !== 1 ? 's' : '' }})
        </Button>
        <p v-if="hasValidationErrors" class="text-red-600 text-sm mt-2 text-center">
          Please fix validation errors before executing
        </p>
      </div>
    </div>

    <!-- Results Display -->
    <div v-if="results.length > 0" class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Execution Results</h3>
        <Button variant="secondary" size="sm" @click="clearResults">
          Clear Results
        </Button>
      </div>

      <div class="space-y-4">
        <div
          v-for="(result, index) in results"
          :key="index"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <span class="text-sm font-medium text-gray-700">Request #{{ index + 1 }}</span>
              <span :class="getStatusClass(result.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ result.status }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="copyResponse(index)"
                class="text-primary-600 hover:text-primary-800 text-sm"
                title="Copy response"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                @click="toggleExpand(index)"
                class="text-gray-600 hover:text-gray-800 text-sm"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  :class="{ 'transform rotate-180': expandedResults[index] }"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="expandedResults[index]" class="mt-3">
            <div class="bg-gray-50 rounded p-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Response Body</label>
              <pre class="text-xs overflow-x-auto">{{ formatResponse(result.body) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="mt-6 pt-6 border-t">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ results.length }}</div>
            <div class="text-sm text-gray-600">Total Requests</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ successCount }}</div>
            <div class="text-sm text-gray-600">Successful</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ errorCount }}</div>
            <div class="text-sm text-gray-600">Errors</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-800 font-medium mb-1">Batch execution failed</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <Button variant="primary" size="sm" @click="error = null">Dismiss</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { batchApi } from '@/api/endpoints/batch'
import { useUIStore } from '@/stores/ui'
import type { BatchRequest, BatchResponse } from '@/api/types'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isExecuting = ref(false)
const error = ref<string | null>(null)
const requests = ref<Array<BatchRequest & { bodyText?: string; bodyError?: string }>>([])
const results = ref<Array<BatchResponse & { expanded?: boolean }>>([])
const expandedResults = ref<Record<number, boolean>>({})

const needsBody = (method: string): boolean => {
  return ['POST', 'PUT', 'PATCH'].includes(method)
}

const hasValidationErrors = computed(() => {
  return requests.value.some(req => {
    if (!req.method || !req.path) return true
    if (needsBody(req.method) && req.bodyText && req.bodyError) return true
    return false
  })
})

const successCount = computed(() => {
  return results.value.filter(r => r.status >= 200 && r.status < 300).length
})

const errorCount = computed(() => {
  return results.value.filter(r => r.status >= 400).length
})

const addRequest = () => {
  if (requests.value.length >= 20) {
    uiStore.showNotification('error', 'Maximum 20 requests allowed per batch')
    return
  }
  requests.value.push({
    method: 'GET',
    path: '',
    bodyText: '',
    bodyError: undefined
  })
}

const removeRequest = (index: number) => {
  requests.value.splice(index, 1)
}

const onMethodChange = (index: number) => {
  const request = requests.value[index]
  if (!needsBody(request.method)) {
    request.bodyText = ''
    request.bodyError = undefined
  }
}

const validateBody = (index: number) => {
  const request = requests.value[index]
  if (!request.bodyText || !request.bodyText.trim()) {
    request.bodyError = undefined
    return
  }

  try {
    JSON.parse(request.bodyText)
    request.bodyError = undefined
  } catch (e) {
    request.bodyError = 'Invalid JSON format'
  }
}

const formatResponse = (body: any): string => {
  if (typeof body === 'string') {
    try {
      return JSON.stringify(JSON.parse(body), null, 2)
    } catch {
      return body
    }
  }
  return JSON.stringify(body, null, 2)
}

const getStatusClass = (status: number): string => {
  if (status >= 200 && status < 300) return 'bg-green-100 text-green-800'
  if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800'
  if (status >= 500) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const toggleExpand = (index: number) => {
  expandedResults.value[index] = !expandedResults.value[index]
}

const copyResponse = async (index: number) => {
  const result = results.value[index]
  try {
    const text = formatResponse(result.body)
    await navigator.clipboard.writeText(text)
    uiStore.showNotification('success', 'Response copied to clipboard')
  } catch (err) {
    uiStore.showNotification('error', 'Failed to copy response')
  }
}

const clearResults = () => {
  results.value = []
  expandedResults.value = {}
}

const executeBatch = async () => {
  if (requests.value.length === 0) {
    uiStore.showNotification('error', 'Please add at least one request')
    return
  }

  if (hasValidationErrors.value) {
    uiStore.showNotification('error', 'Please fix validation errors before executing')
    return
  }

  // Validate all bodies before sending
  requests.value.forEach((req, index) => {
    if (needsBody(req.method) && req.bodyText) {
      validateBody(index)
    }
  })

  if (hasValidationErrors.value) {
    uiStore.showNotification('error', 'Please fix JSON validation errors')
    return
  }

  isExecuting.value = true
  error.value = null
  results.value = []
  expandedResults.value = {}

  try {
    // Prepare requests for API
    const batchRequests: BatchRequest[] = requests.value.map(req => {
      const batchReq: BatchRequest = {
        method: req.method,
        path: req.path
      }
      
      // Add body if method needs it and body is provided
      if (needsBody(req.method) && req.bodyText && req.bodyText.trim()) {
        try {
          batchReq.body = JSON.parse(req.bodyText)
        } catch {
          // Should not happen as we validated, but handle just in case
          throw new Error(`Invalid JSON in request #${requests.value.indexOf(req) + 1}`)
        }
      }
      
      return batchReq
    })

    const response = await batchApi.executeBatch(batchRequests)
    
    if (response.success && response.data) {
      results.value = response.data
      uiStore.showNotification('success', `Batch executed: ${successCount.value} successful, ${errorCount.value} errors`)
    } else {
      error.value = response.error || 'Failed to execute batch requests'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to execute batch requests'
    uiStore.showNotification('error', error.value)
  } finally {
    isExecuting.value = false
  }
}
</script>

