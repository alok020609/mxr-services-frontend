<template>
  <div class="min-h-screen flex flex-col bg-sgBgLight dark:bg-sgBgDark text-slate-900 dark:text-slate-100 font-display">
    <HeaderTemp4 />
    <main class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-10">
      <div class="text-center max-w-md px-4">
        <div v-if="isLoading">
          <LoadingSpinner size="lg" />
          <p class="mt-4 text-slate-600 dark:text-slate-400">Verifying...</p>
        </div>
        <div v-else-if="missingToken">
          <div class="text-amber-600 dark:text-amber-400 text-6xl mb-4">!</div>
          <h2 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Missing verification link</h2>
          <p class="text-slate-600 dark:text-slate-400 mb-4">We didn't receive a verification token. Use the link from your email, or request a new one.</p>
          <div class="space-y-3">
            <router-link to="/login" class="block font-medium text-sgPrimary hover:opacity-90">
              Go to login
            </router-link>
            <router-link to="/check-email" class="block font-medium text-sgPrimary hover:opacity-90">
              Resend verification email
            </router-link>
          </div>
        </div>
        <div v-else-if="verified">
          <div class="text-green-600 dark:text-green-400 text-6xl mb-4">✓</div>
          <h2 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Email verified</h2>
          <p class="text-slate-600 dark:text-slate-400 mb-4">{{ successMessage }}</p>
          <router-link to="/login" class="inline-flex items-center justify-center rounded-lg bg-sgPrimary px-6 py-3 text-white font-bold hover:opacity-90 transition-opacity">
            Go to Login
          </router-link>
        </div>
        <div v-else>
          <div class="text-red-600 dark:text-red-400 text-6xl mb-4">✗</div>
          <h2 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Verification failed</h2>
          <p class="text-slate-600 dark:text-slate-400 mb-4">{{ errorMessage }}</p>
          <div class="space-y-3">
            <router-link to="/check-email" class="block font-medium text-sgPrimary hover:opacity-90">
              Resend verification email
            </router-link>
            <router-link to="/login" class="block font-medium text-sgPrimary hover:opacity-90">
              Go to login
            </router-link>
          </div>
        </div>
      </div>
    </main>
    <FooterTemp4 />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authApi } from '@/api/endpoints/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'

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
