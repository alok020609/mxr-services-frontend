<template>
  <div class="notification-preferences">
    <h3 class="text-lg font-bold mb-4">Notification Preferences</h3>
    
    <form @submit.prevent="savePreferences" class="space-y-6">
      <!-- Email Notifications -->
      <div>
        <h4 class="font-semibold mb-3">Email Notifications</h4>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="preferences.email.orders"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Order updates</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="preferences.email.promotions"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Promotions and deals</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="preferences.email.account"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Account updates</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="preferences.email.marketing"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Marketing emails</span>
          </label>
        </div>
      </div>
      
      <!-- Push Notifications -->
      <div>
        <h4 class="font-semibold mb-3">Push Notifications</h4>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="preferences.push.orders"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Order updates</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="preferences.push.promotions"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Promotions and deals</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="preferences.push.account"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Account updates</span>
          </label>
        </div>
      </div>
      
      <!-- SMS Notifications -->
      <div>
        <h4 class="font-semibold mb-3">SMS Notifications</h4>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="preferences.sms.orders"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Order updates</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="preferences.sms.account"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Account updates</span>
          </label>
        </div>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        :loading="isSaving"
      >
        Save Preferences
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { notificationsApi } from '@/api/endpoints/notifications'
import { useUIStore } from '@/stores/ui'
import Button from '@/components/common/Button.vue'
import type { NotificationPreferences } from '@/api/types'

const uiStore = useUIStore()
const isSaving = ref(false)
const isLoading = ref(false)

const preferences = ref<NotificationPreferences>({
  email: {
    orders: true,
    promotions: true,
    account: true,
    marketing: false
  },
  push: {
    orders: true,
    promotions: false,
    account: true
  },
  sms: {
    orders: false,
    account: true
  }
})

const loadPreferences = async () => {
  // Note: API might not have a get preferences endpoint
  // This would need to be implemented if needed
  isLoading.value = false
}

const savePreferences = async () => {
  isSaving.value = true
  try {
    await notificationsApi.updatePreferences(preferences.value)
    uiStore.showNotification('success', 'Preferences saved successfully')
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to save preferences')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadPreferences()
})
</script>

