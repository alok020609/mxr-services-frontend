<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900">Check your email</h2>
        <p class="mt-2 text-gray-600">
          We sent a verification link to <strong>{{ displayEmail }}</strong>. Check your inbox and spam folder.
        </p>
      </div>
      <div class="space-y-4">
        <Button
          variant="primary"
          class="w-full"
          :loading="resendLoading"
          @click="handleResend"
        >
          Didn't get the email? Resend
        </Button>
        <p v-if="resendSuccess" class="text-sm text-green-600">Verification email sent.</p>
        <p v-if="resendError" class="text-sm text-red-600">{{ resendError }}</p>
      </div>
      <div>
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          Back to sign in
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { authApi } from '@/api/endpoints/auth'
import Button from '@/components/common/Button.vue'

const route = useRoute()
const uiStore = useUIStore()

const email = ref('')
const resendLoading = ref(false)
const resendSuccess = ref(false)
const resendError = ref('')

const displayEmail = computed(() => email.value || 'your email')

onMounted(() => {
  email.value = (route.query.email as string) || ''
})

async function handleResend() {
  if (!email.value?.trim()) {
    resendError.value = 'No email address. Go back to sign up or sign in.'
    return
  }
  resendError.value = ''
  resendSuccess.value = false
  resendLoading.value = true
  try {
    const response = await authApi.resendVerification(email.value.trim())
    if (response.success) {
      resendSuccess.value = true
      uiStore.showNotification('success', 'Verification email sent.')
    } else {
      resendError.value = (response as { error?: string }).error || 'Failed to send'
    }
  } catch (err: unknown) {
    const data = (err as { response?: { data?: { error?: string } } })?.response?.data
    resendError.value = data?.error || 'Failed to send verification email.'
  } finally {
    resendLoading.value = false
  }
}
</script>
