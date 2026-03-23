<template>
  <div class="min-h-screen flex flex-col bg-sgBgLight dark:bg-sgBgDark text-slate-900 dark:text-slate-100 font-display">
    <HeaderTemp4 />
    <main class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-10">
      <div class="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white">Check your email</h2>
          <p class="mt-2 text-slate-600 dark:text-slate-400">
            We sent a verification link to <strong class="text-slate-900 dark:text-white">{{ displayEmail }}</strong>. Check your inbox and spam folder.
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
          <p v-if="resendSuccess" class="text-sm text-green-600 dark:text-green-400">Verification email sent.</p>
          <p v-if="resendError" class="text-sm text-red-600 dark:text-red-400">{{ resendError }}</p>
        </div>
        <div>
          <router-link to="/login" class="font-medium text-sgPrimary hover:opacity-90">
            Back to sign in
          </router-link>
        </div>
      </div>
    </main>
    <FooterTemp4 />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { authApi } from '@/api/endpoints/auth'
import Button from '@/components/common/Button.vue'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'

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
