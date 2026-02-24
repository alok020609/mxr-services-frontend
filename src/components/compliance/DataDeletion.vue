<template>
  <div class="data-deletion">
    <div class="card border-red-200 bg-red-50">
      <h3 class="text-lg font-semibold mb-4 text-red-900">Delete My Account</h3>
      <div class="space-y-4">
        <div class="bg-red-100 border border-red-300 rounded-lg p-4">
          <p class="text-red-800 font-medium mb-2">⚠️ Warning: This action cannot be undone!</p>
          <ul class="text-red-700 text-sm space-y-1 list-disc list-inside">
            <li>All your personal data will be permanently deleted</li>
            <li>Your account will be permanently removed</li>
            <li>All your orders, addresses, and preferences will be deleted</li>
            <li>You will be logged out immediately</li>
            <li>This action is irreversible</li>
          </ul>
        </div>
        
        <div v-if="!showConfirmation">
          <Button
            @click="showConfirmation = true"
            variant="danger"
            class="w-full sm:w-auto"
          >
            Request Account Deletion
          </Button>
        </div>
        
        <div v-else class="space-y-4">
          <div class="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
            <p class="text-yellow-800 text-sm mb-2">
              Please confirm that you understand the consequences and want to proceed with account deletion.
            </p>
            <label class="flex items-start space-x-2 cursor-pointer">
              <input
                v-model="confirmed"
                type="checkbox"
                class="mt-1"
              />
              <span class="text-yellow-900 text-sm">
                I understand that all my data will be permanently deleted and this action cannot be undone.
              </span>
            </label>
          </div>
          
          <div class="flex gap-3">
            <Button
              @click="handleDelete"
              :disabled="!confirmed || isDeleting"
              variant="danger"
              :loading="isDeleting"
              class="flex-1"
            >
              {{ isDeleting ? 'Deleting...' : 'Confirm Deletion' }}
            </Button>
            <Button
              @click="showConfirmation = false; confirmed = false"
              variant="secondary"
              :disabled="isDeleting"
              class="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { complianceApi } from '@/api/endpoints/compliance'
import Button from '@/components/common/Button.vue'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const showConfirmation = ref(false)
const confirmed = ref(false)
const isDeleting = ref(false)

const handleDelete = async () => {
  if (!authStore.user?.id) {
    uiStore.showNotification('error', 'You must be logged in to delete your account')
    return
  }
  
  if (!confirmed.value) {
    uiStore.showNotification('warning', 'Please confirm that you understand the consequences')
    return
  }
  
  isDeleting.value = true
  try {
    const response = await complianceApi.deleteUserData(authStore.user.id)
    if (response.success) {
      uiStore.showNotification('success', 'Your account and data have been deleted')
      // Logout and redirect to home
      authStore.logout()
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete your account')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete your account')
  } finally {
    isDeleting.value = false
  }
}
</script>

