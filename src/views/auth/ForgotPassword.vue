<template>
  <div class="min-h-screen flex flex-col bg-sgBgLight dark:bg-sgBgDark text-slate-900 dark:text-slate-100 font-display">
    <HeaderTemp4 />
    <main class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-10">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Forgot Password</h2>
          <p class="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <Input
            id="email"
            v-model="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            required
            :error="error"
          />
          <Button type="submit" variant="primary" class="w-full" :loading="isLoading">
            Send Reset Link
          </Button>
          <div class="text-center">
            <router-link to="/login" class="text-sm text-sgPrimary hover:opacity-90">
              Back to login
            </router-link>
          </div>
        </form>
      </div>
    </main>
    <FooterTemp4 />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { authApi } from '@/api/endpoints/auth'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'

const uiStore = useUIStore()
const email = ref('')
const error = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const response = await authApi.forgotPassword(email.value)
    if (response.success) {
      uiStore.showNotification('success', 'If that email is registered, we\'ve sent a reset link.')
    } else {
      error.value = response.error || 'Failed to send reset link'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || 'An error occurred'
  } finally {
    isLoading.value = false
  }
}
</script>

