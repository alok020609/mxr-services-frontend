<template>
  <div class="pci-status">
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner size="md" />
    </div>
    
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="loadStatus" variant="secondary">Try Again</Button>
    </div>
    
    <div v-else-if="status" class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold">PCI Compliance Status</h3>
        <div
          :class="[
            'px-4 py-2 rounded-full font-semibold',
            status.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          ]"
        >
          {{ status.compliant ? 'Compliant' : 'Non-Compliant' }}
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div v-if="status.level" class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-1">PCI Level</p>
          <p class="text-2xl font-bold text-gray-900">Level {{ status.level }}</p>
        </div>
        <div v-if="status.score !== undefined" class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-1">Compliance Score</p>
          <p class="text-2xl font-bold text-gray-900">{{ status.score }}%</p>
        </div>
        <div v-if="status.lastAssessment" class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-1">Last Assessment</p>
          <p class="text-sm font-semibold text-gray-900">{{ formatDate(status.lastAssessment) }}</p>
        </div>
      </div>
      
      <div v-if="status.checklist && status.checklist.length > 0" class="mt-6">
        <h4 class="font-semibold mb-4">Compliance Checklist</h4>
        <div class="space-y-2">
          <div
            v-for="(item, index) in status.checklist"
            :key="index"
            class="flex items-center gap-3 p-3 rounded-lg"
            :class="getChecklistItemClass(item.status)"
          >
            <svg
              class="h-5 w-5 flex-shrink-0"
              :class="getChecklistIconClass(item.status)"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="item.status === 'pass'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                v-else-if="item.status === 'fail'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span class="flex-1">{{ item.item }}</span>
            <span
              class="px-2 py-1 rounded text-xs font-semibold"
              :class="getStatusBadgeClass(item.status)"
            >
              {{ item.status.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-if="status.updatedAt" class="mt-6 pt-6 border-t text-sm text-gray-600">
        Last updated: {{ formatDate(status.updatedAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { complianceApi } from '@/api/endpoints/compliance'
import type { PCIComplianceStatus } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const status = ref<PCIComplianceStatus | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const loadStatus = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await complianceApi.getPCIStatus()
    if (response.success && response.data) {
      status.value = response.data
    } else {
      error.value = response.error || 'Failed to load PCI status'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load PCI compliance status'
    uiStore.showNotification('error', 'Failed to load PCI compliance status')
  } finally {
    isLoading.value = false
  }
}

const getChecklistItemClass = (itemStatus: string) => {
  if (itemStatus === 'pass') return 'bg-green-50 border border-green-200'
  if (itemStatus === 'fail') return 'bg-red-50 border border-red-200'
  return 'bg-yellow-50 border border-yellow-200'
}

const getChecklistIconClass = (itemStatus: string) => {
  if (itemStatus === 'pass') return 'text-green-600'
  if (itemStatus === 'fail') return 'text-red-600'
  return 'text-yellow-600'
}

const getStatusBadgeClass = (itemStatus: string) => {
  if (itemStatus === 'pass') return 'bg-green-100 text-green-800'
  if (itemStatus === 'fail') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadStatus()
})
</script>

