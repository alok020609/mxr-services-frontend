<template>
  <div class="data-export">
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">Export My Data</h3>
      <p class="text-gray-600 mb-4 text-sm">
        Download a copy of all your personal data stored in our system. This includes your profile information, orders, addresses, and other account data.
      </p>
      <Button
        @click="handleExport"
        :loading="isExporting"
        variant="primary"
        class="w-full sm:w-auto"
      >
        <svg v-if="!isExporting" class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {{ isExporting ? 'Exporting...' : 'Export My Data' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { complianceApi } from '@/api/endpoints/compliance'
import Button from '@/components/common/Button.vue'

const authStore = useAuthStore()
const uiStore = useUIStore()
const isExporting = ref(false)

const handleExport = async () => {
  if (!authStore.user?.id) {
    uiStore.showNotification('error', 'You must be logged in to export your data')
    return
  }
  
  isExporting.value = true
  try {
    const blob = await complianceApi.exportUserData(authStore.user.id)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `my-data-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    uiStore.showNotification('success', 'Your data has been exported successfully')
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to export your data')
  } finally {
    isExporting.value = false
  }
}
</script>

