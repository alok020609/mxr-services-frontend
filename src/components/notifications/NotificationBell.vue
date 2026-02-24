<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>
    
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
      @click.stop
    >
      <div class="p-4 border-b flex items-center justify-between">
        <h3 class="font-semibold">Notifications</h3>
        <button
          v-if="unreadCount > 0"
          @click="markAllRead"
          class="text-sm text-primary-600 hover:text-primary-700"
        >
          Mark all as read
        </button>
      </div>
      
      <div v-if="isLoading" class="p-4 text-center">
        <LoadingSpinner />
      </div>
      
      <div v-else-if="notifications.length === 0" class="p-4 text-center text-gray-500">
        <p>No notifications</p>
      </div>
      
      <div v-else class="divide-y">
        <div
          v-for="notification in notifications.slice(0, 5)"
          :key="notification.id"
          :class="[
            'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
            !notification.read ? 'bg-blue-50' : ''
          ]"
          @click="handleNotificationClick(notification)"
        >
          <div class="flex items-start gap-3">
            <div class="flex-1">
              <p class="font-medium text-sm">{{ notification.title }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ notification.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(notification.createdAt) }}</p>
            </div>
            <button
              @click.stop="deleteNotification(notification.id)"
              class="text-gray-400 hover:text-red-500"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="notifications.length > 5" class="p-4 border-t text-center">
        <router-link
          to="/notifications"
          class="text-sm text-primary-600 hover:text-primary-700"
          @click="showDropdown = false"
        >
          View all notifications
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { notificationsApi } from '@/api/endpoints/notifications'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { Notification } from '@/api/types'

const uiStore = useUIStore()
const showDropdown = ref(false)
const isLoading = ref(false)
const notifications = ref<Notification[]>([])
const unreadCount = ref(0)

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const loadNotifications = async () => {
  isLoading.value = true
  try {
    const [notificationsResponse, countResponse] = await Promise.all([
      notificationsApi.getNotifications(),
      notificationsApi.getUnreadCount()
    ])
    
    if (notificationsResponse.success && notificationsResponse.data) {
      const data = notificationsResponse.data
      notifications.value = Array.isArray(data) ? data : (data.items || [])
    }
    
    if (countResponse.success && countResponse.data) {
      unreadCount.value = countResponse.data.count || 0
    }
  } catch (error: any) {
    console.error('Failed to load notifications:', error)
  } finally {
    isLoading.value = false
  }
}

const markAllRead = async () => {
  try {
    await notificationsApi.markAllRead()
    await loadNotifications()
    uiStore.showNotification('success', 'All notifications marked as read')
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to mark all as read')
  }
}

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.read) {
    try {
      await notificationsApi.markRead(notification.id)
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }
  
  // Navigate based on notification type
  if (notification.link) {
    window.location.href = notification.link
  }
  
  showDropdown.value = false
}

const deleteNotification = async (id: string) => {
  try {
    await notificationsApi.deleteNotification(id)
    notifications.value = notifications.value.filter(n => n.id !== id)
    if (unreadCount.value > 0) {
      unreadCount.value--
    }
    uiStore.showNotification('success', 'Notification deleted')
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to delete notification')
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  loadNotifications()
  document.addEventListener('click', handleClickOutside)
  
  // Refresh every 30 seconds
  const interval = setInterval(loadNotifications, 30000)
  onUnmounted(() => clearInterval(interval))
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

