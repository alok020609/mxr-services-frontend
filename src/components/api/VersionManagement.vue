<template>
  <div class="version-management">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Version Management</h2>
      <p class="text-sm text-gray-600">View API version information and deprecate versions</p>
    </div>

    <!-- Get Version Info Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Get API Version Info</h3>
      <div class="flex items-end space-x-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            API Version <span class="text-red-500">*</span>
          </label>
          <input
            v-model="versionInput"
            type="text"
            class="input"
            placeholder="e.g., 1.0 or v1.0"
            @keyup.enter="loadVersionInfo"
          />
        </div>
        <Button variant="primary" @click="loadVersionInfo" :loading="isLoadingInfo">
          Get Info
        </Button>
      </div>
    </div>

    <!-- Version Info Display -->
    <div v-if="versionInfo" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Version {{ versionInfo.version }}</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <span :class="getStatusClass(versionInfo.status)" class="px-3 py-1 rounded-full text-sm font-medium">
            {{ versionInfo.status }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-if="versionInfo.releaseDate">
            <label class="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
            <p class="text-gray-900">{{ formatDate(versionInfo.releaseDate) }}</p>
          </div>
          <div v-if="versionInfo.deprecationDate">
            <label class="block text-sm font-medium text-gray-700 mb-1">Deprecation Date</label>
            <p class="text-gray-900">{{ formatDate(versionInfo.deprecationDate) }}</p>
          </div>
          <div v-if="versionInfo.removalDate">
            <label class="block text-sm font-medium text-gray-700 mb-1">Removal Date</label>
            <p class="text-gray-900">{{ formatDate(versionInfo.removalDate) }}</p>
          </div>
        </div>
        <div v-if="versionInfo.endpoints && versionInfo.endpoints.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-2">Endpoints</label>
          <div class="flex flex-wrap gap-2">
            <code
              v-for="endpoint in versionInfo.endpoints"
              :key="endpoint"
              class="text-sm bg-gray-100 px-2 py-1 rounded"
            >
              {{ endpoint }}
            </code>
          </div>
        </div>
        <div v-if="versionInfo.changelog">
          <label class="block text-sm font-medium text-gray-700 mb-1">Changelog</label>
          <p class="text-gray-900 whitespace-pre-wrap">{{ versionInfo.changelog }}</p>
        </div>
      </div>
    </div>

    <!-- Deprecate Version Form -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold mb-4">Deprecate API Version</h3>
      
      <form @submit.prevent="deprecateVersion" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Version <span class="text-red-500">*</span>
          </label>
          <input
            v-model="deprecateForm.version"
            type="text"
            class="input"
            placeholder="e.g., 1.0"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Deprecation Date (Optional)
            </label>
            <input
              v-model="deprecateForm.deprecationDate"
              type="date"
              class="input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Removal Date (Optional)
            </label>
            <input
              v-model="deprecateForm.removalDate"
              type="date"
              class="input"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notice (Optional)
          </label>
          <textarea
            v-model="deprecateForm.notice"
            class="input"
            rows="4"
            placeholder="Enter deprecation notice..."
          ></textarea>
        </div>

        <div v-if="deprecateError" class="p-3 bg-red-50 border border-red-200 rounded">
          <p class="text-red-800 text-sm">{{ deprecateError }}</p>
        </div>

        <Button type="submit" variant="primary" :loading="isDeprecating" class="w-full">
          Deprecate Version
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { apiGatewayApi } from '@/api/endpoints/api-gateway'
import { useUIStore } from '@/stores/ui'
import type { ApiVersionInfo, DeprecateVersionRequest } from '@/api/types'
import Button from '@/components/common/Button.vue'
import { formatDate } from '@/utils/formatters'

const uiStore = useUIStore()
const isLoadingInfo = ref(false)
const isDeprecating = ref(false)
const versionInput = ref('')
const versionInfo = ref<ApiVersionInfo | null>(null)
const deprecateError = ref<string | null>(null)

const deprecateForm = ref<DeprecateVersionRequest>({
  version: '',
  deprecationDate: undefined,
  removalDate: undefined,
  notice: undefined
})

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    deprecated: 'bg-yellow-100 text-yellow-800',
    sunset: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const loadVersionInfo = async () => {
  if (!versionInput.value.trim()) {
    uiStore.showNotification('error', 'Please enter a version number')
    return
  }

  isLoadingInfo.value = true
  versionInfo.value = null
  
  // Remove 'v' prefix if present
  const version = versionInput.value.trim().replace(/^v/i, '')
  
  try {
    const response = await apiGatewayApi.getApiVersionInfo(version)
    if (response.success && response.data) {
      versionInfo.value = response.data
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load version info')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.response?.data?.error || err.message || 'Failed to load version info')
  } finally {
    isLoadingInfo.value = false
  }
}

const deprecateVersion = async () => {
  if (!deprecateForm.value.version.trim()) {
    uiStore.showNotification('error', 'Please enter a version number')
    return
  }

  isDeprecating.value = true
  deprecateError.value = null
  
  // Remove 'v' prefix if present
  const version = deprecateForm.value.version.trim().replace(/^v/i, '')
  const request: DeprecateVersionRequest = {
    ...deprecateForm.value,
    version
  }
  
  try {
    const response = await apiGatewayApi.deprecateApiVersion(request)
    if (response.success) {
      uiStore.showNotification('success', 'API version deprecated successfully')
      deprecateForm.value = {
        version: '',
        deprecationDate: undefined,
        removalDate: undefined,
        notice: undefined
      }
      // Reload version info if it matches
      if (versionInput.value && versionInput.value.replace(/^v/i, '') === version) {
        await loadVersionInfo()
      }
    } else {
      deprecateError.value = response.error || 'Failed to deprecate version'
    }
  } catch (err: any) {
    deprecateError.value = err.response?.data?.error || err.message || 'Failed to deprecate version'
    uiStore.showNotification('error', deprecateError.value)
  } finally {
    isDeprecating.value = false
  }
}
</script>

