<template>
  <div class="active-sessions">
    <h3 class="text-lg font-bold mb-4">Active Sessions</h3>
    
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner />
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="session in sessions"
        :key="session.id"
        :class="[
          'card flex items-center justify-between',
          session.current ? 'border-2 border-primary-600' : ''
        ]"
      >
        <div>
          <div class="flex items-center gap-2">
            <p class="font-semibold">{{ session.deviceName }}</p>
            <span v-if="session.current" class="px-2 py-0.5 bg-primary-100 text-primary-800 rounded text-xs">
              Current
            </span>
          </div>
          <p class="text-sm text-gray-600">{{ session.deviceType }}</p>
          <p class="text-xs text-gray-500 mt-1">
            {{ session.ipAddress }} • Last activity: {{ formatDate(session.lastActivity) }}
          </p>
        </div>
        <Button
          v-if="!session.current"
          variant="danger"
          size="sm"
          @click="revokeSession(session.id)"
          :loading="revokingSessionId === session.id"
        >
          Revoke
        </Button>
      </div>
      
      <div class="mt-4 pt-4 border-t">
        <Button
          variant="danger"
          @click="revokeAllSessions"
          :loading="isRevokingAll"
        >
          Revoke All Sessions
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { securityApi, type ActiveSession } from '@/api/endpoints/security'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const authStore = useAuthStore()
const isLoading = ref(false)
const sessions = ref<ActiveSession[]>([])
const revokingSessionId = ref<string | null>(null)
const isRevokingAll = ref(false)

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadSessions = async () => {
  isLoading.value = true
  try {
    const response = await securityApi.getActiveSessions()
    if (response.success && response.data) {
      sessions.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load active sessions')
  } finally {
    isLoading.value = false
  }
}

const revokeSession = async (sessionId: string) => {
  revokingSessionId.value = sessionId
  try {
    const response = await securityApi.revokeSession(sessionId)
    if (response.success) {
      uiStore.showNotification('success', 'Session revoked successfully')
      await loadSessions()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to revoke session')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to revoke session')
  } finally {
    revokingSessionId.value = null
  }
}

const revokeAllSessions = async () => {
  if (!confirm('Are you sure you want to revoke all sessions? You will be logged out.')) return
  
  isRevokingAll.value = true
  try {
    const response = await securityApi.revokeAllSessions()
    if (response.success) {
      uiStore.showNotification('success', 'All sessions revoked')
      authStore.logout()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to revoke all sessions')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to revoke all sessions')
  } finally {
    isRevokingAll.value = false
  }
}

onMounted(() => {
  loadSessions()
})
</script>

