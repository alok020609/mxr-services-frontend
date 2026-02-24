<template>
  <div class="legal-document-viewer">
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner size="md" />
    </div>
    
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="loadDocument" variant="secondary">Try Again</Button>
    </div>
    
    <div v-else-if="document" class="card">
      <div class="mb-6 pb-4 border-b">
        <h2 class="text-2xl font-bold mb-2">{{ document.title }}</h2>
        <div class="flex items-center gap-4 text-sm text-gray-600">
          <span>Version: {{ document.version }}</span>
          <span v-if="document.updatedAt">
            Last updated: {{ formatDate(document.updatedAt) }}
          </span>
        </div>
      </div>
      
      <div
        class="prose prose-lg max-w-none legal-content mb-6"
        v-html="document.content"
      ></div>
      
      <div v-if="showAcceptButton && isAuthenticated" class="mt-6 pt-6 border-t">
        <div v-if="acceptanceStatus.accepted" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center gap-2 text-green-800">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">You have accepted this document (Version {{ acceptanceStatus.version }})</span>
          </div>
        </div>
        <div v-else class="space-y-4">
          <p class="text-gray-700">
            Please read and accept this document to continue using our services.
          </p>
          <Button
            @click="handleAccept"
            :loading="isAccepting"
            variant="primary"
            class="w-full sm:w-auto"
          >
            Accept {{ document.title }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { complianceApi } from '@/api/endpoints/compliance'
import type { LegalDocument } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

interface Props {
  documentType: string
  showAcceptButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAcceptButton: true
})

const authStore = useAuthStore()
const uiStore = useUIStore()
const document = ref<LegalDocument | null>(null)
const acceptanceStatus = ref<{ accepted: boolean; version: string }>({ accepted: false, version: '' })
const isLoading = ref(false)
const isAccepting = ref(false)
const error = ref<string | null>(null)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const loadDocument = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await complianceApi.getDocument(props.documentType)
    if (response.success && response.data) {
      document.value = response.data
      // Check acceptance if authenticated
      if (isAuthenticated.value && props.showAcceptButton) {
        await checkAcceptance()
      }
    } else {
      error.value = response.error || 'Document not found'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load document'
  } finally {
    isLoading.value = false
  }
}

const checkAcceptance = async () => {
  try {
    const response = await complianceApi.checkAcceptance(props.documentType)
    if (response.success && response.data) {
      acceptanceStatus.value = response.data
    }
  } catch (err) {
    // Ignore errors for acceptance check
    console.error('Failed to check acceptance:', err)
  }
}

const handleAccept = async () => {
  if (!document.value) return
  
  isAccepting.value = true
  try {
    const response = await complianceApi.recordAcceptance(props.documentType, document.value.version)
    if (response.success) {
      acceptanceStatus.value = {
        accepted: true,
        version: document.value.version
      }
      uiStore.showNotification('success', 'Document accepted successfully')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to accept document')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to accept document')
  } finally {
    isAccepting.value = false
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

watch(() => props.documentType, () => {
  loadDocument()
})

onMounted(() => {
  loadDocument()
})
</script>

<style scoped>
.legal-content :deep(h1),
.legal-content :deep(h2),
.legal-content :deep(h3) {
  @apply font-bold mb-4 mt-6;
}

.legal-content :deep(p) {
  @apply mb-4 text-gray-700 leading-relaxed;
}

.legal-content :deep(ul),
.legal-content :deep(ol) {
  @apply mb-4 ml-6;
}

.legal-content :deep(li) {
  @apply mb-2;
}

.legal-content :deep(a) {
  @apply text-primary-600 hover:underline;
}
</style>

