<template>
  <div class="api-keys">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">API Keys</h3>
      <Button variant="primary" size="sm" @click="showCreateModal = true">
        Create API Key
      </Button>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="apiKeys.length === 0" class="text-center py-8 text-gray-500">
      <p>No API keys</p>
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="key in apiKeys"
        :key="key.id"
        class="card"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold">{{ key.name }}</p>
            <code class="text-sm text-gray-600 font-mono">{{ key.key }}</code>
            <p class="text-xs text-gray-500 mt-1">
              Created: {{ formatDate(key.createdAt) }}
              <span v-if="key.lastUsed"> • Last used: {{ formatDate(key.lastUsed) }}</span>
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            @click="revokeKey(key.id)"
            :loading="revokingKeyId === key.id"
          >
            Revoke
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Create Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showCreateModal = false"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h4 class="text-lg font-bold mb-4">Create API Key</h4>
        <form @submit.prevent="createKey">
          <Input
            v-model="newKeyName"
            label="Key Name"
            placeholder="Enter a name for this key"
            required
          />
          <div class="flex gap-2 justify-end mt-4">
            <Button variant="secondary" @click="showCreateModal = false">Cancel</Button>
            <Button type="submit" variant="primary" :loading="isCreating">Create</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { securityApi, type ApiKey } from '@/api/endpoints/security'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const isCreating = ref(false)
const apiKeys = ref<ApiKey[]>([])
const showCreateModal = ref(false)
const newKeyName = ref('')
const revokingKeyId = ref<string | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadKeys = async () => {
  isLoading.value = true
  try {
    const response = await securityApi.getApiKeys()
    if (response.success && response.data) {
      apiKeys.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load API keys')
  } finally {
    isLoading.value = false
  }
}

const createKey = async () => {
  if (!newKeyName.value.trim()) return
  
  isCreating.value = true
  try {
    const response = await securityApi.createApiKey(newKeyName.value.trim())
    if (response.success && response.data) {
      uiStore.showNotification('success', 'API key created successfully')
      showCreateModal.value = false
      newKeyName.value = ''
      await loadKeys()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to create API key')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to create API key')
  } finally {
    isCreating.value = false
  }
}

const revokeKey = async (keyId: string) => {
  if (!confirm('Are you sure you want to revoke this API key?')) return
  
  revokingKeyId.value = keyId
  try {
    const response = await securityApi.revokeApiKey(keyId)
    if (response.success) {
      uiStore.showNotification('success', 'API key revoked successfully')
      await loadKeys()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to revoke API key')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to revoke API key')
  } finally {
    revokingKeyId.value = null
  }
}

onMounted(() => {
  loadKeys()
})
</script>

