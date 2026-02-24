<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center max-w-md px-4">
      <div v-if="isLoading">
        <LoadingSpinner size="lg" />
        <p class="mt-4">Verifying...</p>
      </div>
      <div v-else-if="missingToken">
        <div class="text-amber-600 text-6xl mb-4">!</div>
        <h2 class="text-2xl font-bold mb-2">Missing verification link</h2>
        <p class="text-gray-600 mb-4">We didn't receive a verification token. Use the link from your email, or request a new one.</p>
        <div class="space-y-3">
          <router-link to="/login" class="block font-medium text-primary-600 hover:text-primary-500">
            Go to login
          </router-link>
          <router-link to="/check-email" class="block font-medium text-primary-600 hover:text-primary-500">
            Resend verification email
          </router-link>
        </div>
      </div>
      <div v-else-if="verified">
        <div class="text-green-600 text-6xl mb-4">✓</div>
        <h2 class="text-2xl font-bold mb-2">Email verified</h2>
        <p class="text-gray-600 mb-4">{{ successMessage }}</p>
        <router-link to="/login" class="btn btn-primary">
          Go to Login
        </router-link>
      </div>
      <div v-else>
        <div class="text-red-600 text-6xl mb-4">✗</div>
        <h2 class="text-2xl font-bold mb-2">Verification failed</h2>
        <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
        <div class="space-y-3">
          <router-link to="/check-email" class="block font-medium text-primary-600 hover:text-primary-500">
            Resend verification email
          </router-link>
          <router-link to="/login" class="block font-medium text-primary-600 hover:text-primary-500">
            Go to login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authApi } from '@/api/endpoints/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const isLoading = ref(true)
const missingToken = ref(false)
const verified = ref(false)
const successMessage = ref('Email verified successfully. You can log in.')
const errorMessage = ref('Invalid or expired link.')

onMounted(async () => {
  const token = (route.query.token as string) || (route.params.token as string) || ''
  if (!token) {
    missingToken.value = true
    isLoading.value = false
    return
  }

  try {
    const response = await authApi.verifyEmail(token)
    const data = response as { success?: boolean; message?: string; error?: string }
    if (data.success) {
      verified.value = true
      successMessage.value = (data.message && data.message.trim()) || 'Email verified successfully. You can log in.'
    } else {
      errorMessage.value = (data.error && data.error.trim()) || 'Invalid or expired link.'
    }
  } catch (err: unknown) {
    const ax = err as { response?: { data?: { error?: string } } }
    errorMessage.value = (ax.response?.data?.error && ax.response.data.error.trim()) || 'Invalid or expired link.'
  } finally {
    isLoading.value = false
  }
})
</script>
