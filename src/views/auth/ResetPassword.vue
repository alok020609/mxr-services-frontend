<template>
  <div>
    <Header />
    <main class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-sgBgDark py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Reset Password</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <Input
          id="password"
          v-model="form.password"
          type="password"
          label="New Password"
          placeholder="Enter new password"
          required
          :error="errors.password"
        />
        <Input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm new password"
          required
          :error="errors.confirmPassword"
        />
        <Button type="submit" variant="primary" class="w-full" :loading="isLoading">
          Reset Password
        </Button>
      </form>
    </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { authApi } from '@/api/endpoints/auth'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

const router = useRouter()
const route = useRoute()
const uiStore = useUIStore()

const form = ref({
  password: '',
  confirmPassword: ''
})

const errors = ref<Record<string, string>>({})
const isLoading = ref(false)
const token = ref('')

onMounted(() => {
  token.value = (route.query.token as string) || ''
  if (!token.value) {
    router.push({ name: 'Login' })
  }
})

const handleSubmit = async () => {
  errors.value = {}
  
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    return
  }
  
  isLoading.value = true

  try {
    const response = await authApi.resetPassword(token.value, form.value.password)
    if (response.success) {
      uiStore.showNotification('success', 'Password reset successful!')
      router.push({ name: 'Login' })
    } else {
      errors.value.password = response.error || 'Failed to reset password'
    }
  } catch (err: any) {
    errors.value.password = err.response?.data?.error || 'An error occurred'
  } finally {
    isLoading.value = false
  }
}
</script>

