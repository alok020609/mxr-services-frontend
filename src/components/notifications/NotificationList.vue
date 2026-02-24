<template>
  <div class="notification-list">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Notifications</h2>
      <div class="flex gap-2">
        <Button
          v-if="unreadCount > 0"
          variant="secondary"
          size="sm"
          @click="markAllRead"
          :loading="isMarkingAllRead"
        >
          Mark All as Read
        </Button>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="notifications.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <p class="mt-4 text-gray-500">No notifications</p>
    </div>
    
    <div v-else class="space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'card cursor-pointer transition-all',
          !notification.read ? 'border-l-4 border-primary-600 bg-blue-50' : ''
        ]"
        @click="handleNotificationClick(notification)"
      >
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold">{{ notification.title }}</h3>
              <span
                v-if="!notification.read"
                class="inline-block w-2 h-2 bg-primary-600 rounded-full"
              ></span>
            </div>
            <p class="text-gray-600 text-sm mb-2">{{ notification.message }}</p>
            <p class="text-xs text-gray-400">{{ formatDate(notification.createdAt) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="!notification.read"
              @click.stop="markAsRead(notification.id)"
              class="text-sm text-primary-600 hover:text-primary-700"
            >
              Mark as read
            </button>
            <button
              @click.stop="deleteNotification(notification.id)"
              class="text-gray-400 hover:text-red-500"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { notificationsApi } from '@/api/endpoints/notifications'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import type { Notification } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const isMarkingAllRead = ref(false)
const notifications = ref<Notification[]>([])
const unreadCount = ref(0)

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
    uiStore.showNotification('error', 'Failed to load notifications')
  } finally {
    isLoading.value = false
  }
}

const markAsRead = async (id: string) => {
  try {
    await notificationsApi.markRead(id)
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to mark as read')
  }
}

const markAllRead = async () => {
  isMarkingAllRead.value = true
  try {
    await notificationsApi.markAllRead()
    notifications.value.forEach(n => n.read = true)
    unreadCount.value = 0
    uiStore.showNotification('success', 'All notifications marked as read')
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to mark all as read')
  } finally {
    isMarkingAllRead.value = false
  }
}

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.read) {
    await markAsRead(notification.id)
  }
  
  if (notification.link) {
    window.location.href = notification.link
  }
}

const deleteNotification = async (id: string) => {
  try {
    await notificationsApi.deleteNotification(id)
    notifications.value = notifications.value.filter(n => n.id !== id)
    uiStore.showNotification('success', 'Notification deleted')
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to delete notification')
  }
}

onMounted(() => {
  loadNotifications()
})
</script>

