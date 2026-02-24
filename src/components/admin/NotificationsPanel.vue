<template>
  <div class="notifications-panel">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
        <span v-if="unreadCount > 0" class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          {{ unreadCount }} unread
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <select
          v-model="filterStatus"
          class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
        <Button variant="secondary" size="sm" @click="loadNotifications" :loading="isLoading">
          Refresh
        </Button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner size="sm" />
      <span class="ml-2 text-gray-600">Loading notifications...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredNotifications.length === 0" class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <p>No notifications</p>
      <p class="text-sm mt-1" v-if="filterStatus !== 'all'">Try changing the filter</p>
    </div>

    <!-- Notifications List -->
    <div v-else class="space-y-2">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        :class="[
          'p-4 rounded-lg border cursor-pointer transition-all',
          notification.read
            ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
        ]"
        @click="markAsRead(notification.id)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <h4 class="font-semibold text-gray-900">
                {{ notification.title || 'Notification' }}
              </h4>
              <span
                v-if="!notification.read"
                class="w-2 h-2 bg-blue-500 rounded-full"
                title="Unread"
              ></span>
            </div>
            <p class="text-sm text-gray-700">{{ notification.message }}</p>
            <p v-if="notification.type" class="text-xs text-gray-500 mt-1">
              Type: {{ notification.type }}
            </p>
            <p class="text-xs text-gray-400 mt-2">
              {{ formatDate(notification.createdAt) }}
            </p>
          </div>
          <button
            v-if="!notification.read"
            @click.stop="markAsRead(notification.id)"
            class="ml-4 p-1 text-gray-400 hover:text-primary-600 transition-colors"
            title="Mark as read"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { adminApi } from '@/api/endpoints/admin'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatDate } from '@/utils/formatters'
import type { AdminNotification } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps<{
  autoRefresh?: boolean
  refreshInterval?: number
}>()

const emit = defineEmits<{
  (e: 'notification-read', notificationId: string): void
  (e: 'unread-count-changed', count: number): void
}>()

const uiStore = useUIStore()
const isLoading = ref(false)
const notifications = ref<AdminNotification[]>([])
const filterStatus = ref<'all' | 'unread' | 'read'>('all')

const filteredNotifications = computed(() => {
  if (filterStatus.value === 'all') {
    return notifications.value
  } else if (filterStatus.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  } else {
    return notifications.value.filter(n => n.read)
  }
})

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

let refreshIntervalId: ReturnType<typeof setInterval> | null = null

const loadNotifications = async () => {
  isLoading.value = true
  try {
    const response = await adminApi.getNotifications()
    sendToTerminal('log', '[NotificationsPanel] API Response:', response)
    
    if (response.success && response.data) {
      notifications.value = Array.isArray(response.data) ? response.data : []
      emit('unread-count-changed', unreadCount.value)
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load notifications')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to load notifications')
    sendToTerminal('error', '[NotificationsPanel] Error loading notifications:', error)
  } finally {
    isLoading.value = false
  }
}

const markAsRead = async (notificationId: string) => {
  try {
    const response = await adminApi.markNotificationRead(notificationId)
    sendToTerminal('log', '[NotificationsPanel] Mark as read response:', response)
    
    if (response.success) {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
        emit('notification-read', notificationId)
        emit('unread-count-changed', unreadCount.value)
      }
    } else {
      uiStore.showNotification('error', response.error || 'Failed to mark notification as read')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to mark notification as read')
    sendToTerminal('error', '[NotificationsPanel] Error marking notification as read:', error)
  }
}

onMounted(() => {
  loadNotifications()
  
  if (props.autoRefresh) {
    const interval = props.refreshInterval || 30000 // Default 30 seconds
    refreshIntervalId = setInterval(() => {
      loadNotifications()
    }, interval)
  }
})

onUnmounted(() => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
  }
})
</script>

<style scoped>
.notifications-panel {
  @apply space-y-4;
}
</style>

