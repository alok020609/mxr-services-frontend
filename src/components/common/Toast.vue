<template>
  <TransitionGroup
    name="toast"
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2 max-w-md"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="[
        'min-w-[300px] max-w-md p-4 rounded-lg shadow-lg border backdrop-blur-sm',
        getToastClasses(notification.type)
      ]"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0" v-html="getIconSvg(notification.type)"></div>
        <div class="ml-3 flex-1 min-w-0">
          <p class="text-sm font-medium break-words">{{ notification.message }}</p>
        </div>
        <button
          @click="removeNotification(notification.id)"
          :class="[
            'ml-4 flex-shrink-0 transition-colors',
            getCloseButtonClasses(notification.type)
          ]"
          aria-label="Close notification"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const notifications = computed(() => uiStore.notifications)

const removeNotification = (id: string) => {
  uiStore.removeNotification(id)
}

const getToastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800'
  }
}

const getIconClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'h-5 w-5 text-green-400'
    case 'error':
      return 'h-5 w-5 text-red-400'
    case 'warning':
      return 'h-5 w-5 text-yellow-400'
    default:
      return 'h-5 w-5 text-blue-400'
  }
}

const getCloseButtonClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-400 hover:text-green-600'
    case 'error':
      return 'text-red-400 hover:text-red-600'
    case 'warning':
      return 'text-yellow-400 hover:text-yellow-600'
    default:
      return 'text-blue-400 hover:text-blue-600'
  }
}

const getIconSvg = (type: string) => {
  const iconClass = getIconClasses(type)
  switch (type) {
    case 'success':
      return `<svg class="${iconClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`
    case 'error':
      return `<svg class="${iconClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`
    case 'warning':
      return `<svg class="${iconClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>`
    default:
      return `<svg class="${iconClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>

