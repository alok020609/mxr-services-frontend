<template>
  <div class="utm-tracking">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">UTM Parameter Tracking</h2>
      <p class="text-sm text-gray-600">Track UTM parameters for order attribution</p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="trackUTM" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Order ID <span class="text-red-500">*</span></label>
          <input
            v-model="form.orderId"
            type="text"
            class="input"
            placeholder="Enter order ID"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">UTM Source</label>
            <input
              v-model="form.utm_source"
              type="text"
              class="input"
              placeholder="e.g., google, facebook, email"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">UTM Medium</label>
            <input
              v-model="form.utm_medium"
              type="text"
              class="input"
              placeholder="e.g., cpc, email, social"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">UTM Campaign</label>
            <input
              v-model="form.utm_campaign"
              type="text"
              class="input"
              placeholder="e.g., summer_sale"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">UTM Term</label>
            <input
              v-model="form.utm_term"
              type="text"
              class="input"
              placeholder="e.g., headphones (for paid search)"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-2">UTM Content</label>
            <input
              v-model="form.utm_content"
              type="text"
              class="input"
              placeholder="e.g., ad_variant_1"
            />
          </div>
        </div>

        <div class="flex items-center space-x-4 pt-4">
          <Button type="submit" variant="primary" :loading="isLoading">
            Track UTM Parameters
          </Button>
          <Button type="button" variant="secondary" @click="resetForm">
            Clear
          </Button>
        </div>
      </form>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <p class="text-green-800">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { advancedAnalyticsApi } from '@/api/endpoints/advanced-analytics'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const form = ref({
  orderId: '',
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_term: '',
  utm_content: ''
})

const trackUTM = async () => {
  isLoading.value = true
  error.value = null
  successMessage.value = null

  try {
    const utmParams: Record<string, string> = {}
    if (form.value.utm_source) utmParams.utm_source = form.value.utm_source
    if (form.value.utm_medium) utmParams.utm_medium = form.value.utm_medium
    if (form.value.utm_campaign) utmParams.utm_campaign = form.value.utm_campaign
    if (form.value.utm_term) utmParams.utm_term = form.value.utm_term
    if (form.value.utm_content) utmParams.utm_content = form.value.utm_content

    const response = await advancedAnalyticsApi.trackUTM(form.value.orderId, utmParams)
    sendToTerminal('log', '[UTMTracking] API Response:', response)

    if (response.success) {
      successMessage.value = response.message || 'UTM parameters tracked successfully'
      uiStore.showNotification('success', successMessage.value)
      resetForm()
    } else {
      const errorMessage = response.error || 'Failed to track UTM parameters'
      error.value = errorMessage
      uiStore.showNotification('error', errorMessage)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message || 'Failed to track UTM parameters'
    error.value = errorMessage
    uiStore.showNotification('error', errorMessage)
    sendToTerminal('error', '[UTMTracking] Error tracking UTM:', err)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.value = {
    orderId: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: ''
  }
  error.value = null
  successMessage.value = null
}
</script>

<style scoped>
.utm-tracking {
  @apply space-y-6;
}
</style>

