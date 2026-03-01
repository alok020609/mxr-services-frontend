<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 flex items-center">
            <svg class="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Mail Settings
          </h1>
          <p class="text-primary-100">Configure when and where transactional emails are sent</p>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
      <LoadingSpinner size="md" />
      <span class="ml-3 text-gray-600">Loading mail settings...</span>
    </div>

    <div v-else-if="loadError" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <p class="font-semibold text-red-800">Error</p>
      <p class="text-sm text-red-600">{{ loadError }}</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact form notification email</h2>
      <p class="text-sm text-gray-600 mb-3">
        This address receives an email when someone submits the public contact form. If left empty, the app uses the server default (e.g. CONTACT_NOTIFICATION_EMAIL or ADMIN_EMAIL).
      </p>
      <form @submit.prevent="save" class="space-y-4 max-w-md">
        <div>
          <label for="contact-notification-email" class="block text-sm font-medium text-gray-700 mb-1">Contact form notification email</label>
          <input
            id="contact-notification-email"
            v-model="contactNotificationEmail"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="admin@example.com"
          />
        </div>
        <p v-if="saveError" class="text-sm text-red-600">{{ saveError }}</p>
        <p v-if="saveSuccess" class="text-sm text-green-600">Saved.</p>
        <button
          type="submit"
          :disabled="isSaving"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { adminMailSettingsApi } from '@/api/endpoints/admin-mail-settings'

const contactNotificationEmail = ref('')
const isLoading = ref(true)
const loadError = ref('')
const isSaving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

async function load() {
  isLoading.value = true
  loadError.value = ''
  try {
    const res = await adminMailSettingsApi.getMailSettings()
    if (res.success && res.data?.config) {
      const email = res.data.config.contactNotificationEmail
      contactNotificationEmail.value = typeof email === 'string' ? email : ''
    }
  } catch (e: any) {
    loadError.value = e?.response?.data?.error || e?.message || 'Failed to load mail settings'
  } finally {
    isLoading.value = false
  }
}

async function save() {
  isSaving.value = true
  saveError.value = ''
  saveSuccess.value = false
  try {
    const value = contactNotificationEmail.value.trim() || undefined
    const res = await adminMailSettingsApi.updateMailSettings({
      contactNotificationEmail: value ?? null
    })
    if (res.success && res.data?.config) {
      const email = res.data.config.contactNotificationEmail
      contactNotificationEmail.value = typeof email === 'string' ? email : ''
      saveSuccess.value = true
      setTimeout(() => { saveSuccess.value = false }, 2000)
    }
  } catch (e: any) {
    saveError.value = e?.response?.data?.error || e?.message || 'Failed to save'
  } finally {
    isSaving.value = false
  }
}

onMounted(() => load())
</script>
