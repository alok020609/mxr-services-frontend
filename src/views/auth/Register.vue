<template>
  <div>
    <Header />
    <main class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-sgBgDark py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Create your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <Input
            id="email"
            v-model="form.email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            required
            :error="errors.email"
          />
          <Input
            id="password"
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Min 6 characters"
            required
            :error="errors.password"
          />
          <Input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            :error="errors.confirmPassword"
          />
          <Input
            id="firstName"
            v-model="form.firstName"
            type="text"
            label="First name (optional)"
            placeholder="First name"
            :error="errors.firstName"
          />
          <Input
            id="lastName"
            v-model="form.lastName"
            type="text"
            label="Last name (optional)"
            placeholder="Last name"
            :error="errors.lastName"
          />
          <Input
            id="phone"
            v-model="form.phone"
            type="text"
            label="Phone (optional)"
            placeholder="e.g. +1234567890"
            :error="errors.phone"
          />
        </div>

        <div v-if="generalError" class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
          {{ generalError }}
          <template v-if="generalError === 'This email is already registered.'">
            <span class="mt-2 block">
              <router-link to="/login" class="font-medium text-sgPrimary hover:opacity-90">Log in</router-link>
              or
              <router-link to="/forgot-password" class="font-medium text-sgPrimary hover:opacity-90">Forgot password?</router-link>
            </span>
          </template>
        </div>

        <div>
          <Button type="submit" variant="primary" class="w-full" :loading="isLoading">
            Create account
          </Button>
        </div>

        <div class="text-center">
          <span class="text-sm text-slate-600 dark:text-slate-400">Already have an account? </span>
          <router-link to="/login" class="font-medium text-sgPrimary hover:opacity-90">
            Sign in
          </router-link>
        </div>
      </form>
    </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { authApi } from '@/api/endpoints/auth'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

const router = useRouter()
const uiStore = useUIStore()

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: ''
})

const errors = ref<Record<string, string>>({})
const generalError = ref('')
const isLoading = ref(false)

function normalizeErrors(data: unknown): Record<string, string> {
  if (!data || typeof data !== 'object') return {}
  const errs = (data as { errors?: unknown }).errors
  if (Array.isArray(errs)) {
    return (errs as Array<{ field?: string; message?: string }>).reduce(
      (acc, e) => (e?.field ? { ...acc, [e.field]: e.message || '' } : acc),
      {} as Record<string, string>
    )
  }
  if (errs && typeof errs === 'object' && !Array.isArray(errs)) {
    const out: Record<string, string> = {}
    for (const [k, v] of Object.entries(errs)) {
      out[k] = Array.isArray(v) ? (v[0] as string) : String(v ?? '')
    }
    return out
  }
  return {}
}

const validateForm = (): boolean => {
  errors.value = {}
  generalError.value = ''

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    return false
  }

  if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    return false
  }

  return true
}

const handleRegister = async () => {
  if (!validateForm()) return

  errors.value = {}
  generalError.value = ''
  isLoading.value = true

  try {
    const payload: Record<string, string> = {
      email: form.value.email.trim(),
      password: form.value.password
    }
    if (form.value.firstName?.trim()) payload.firstName = form.value.firstName.trim()
    if (form.value.lastName?.trim()) payload.lastName = form.value.lastName.trim()
    if (form.value.phone?.trim()) payload.phone = form.value.phone.trim()

    const response = await authApi.register(payload)

    if (response.success) {
      uiStore.showNotification('success', 'Check your email to verify your account.')
      router.push({ name: 'CheckEmail', query: { email: form.value.email } })
      return
    }

    const errMsg = (response as { error?: string }).error || 'Registration failed'
    if (/user already exists|already registered/i.test(errMsg)) {
      generalError.value = 'This email is already registered.'
      uiStore.showNotification('error', 'This email is already registered. Try logging in or use Forgot password.')
    } else {
      generalError.value = errMsg
      uiStore.showNotification('error', errMsg)
    }
  } catch (error: unknown) {
    const ax = error as { response?: { status?: number; data?: unknown } }
    const status = ax.response?.status
    const data = ax.response?.data

    if (status === 409 || (data && typeof data === 'object' && /user already exists|already registered/i.test(String((data as { error?: string }).error ?? '')))) {
      generalError.value = 'This email is already registered.'
      uiStore.showNotification('error', 'This email is already registered. Try logging in or use Forgot password.')
    } else if (status === 400 && data) {
      errors.value = normalizeErrors(data)
      const errMsg = (data as { error?: string }).error
      if (errMsg) generalError.value = errMsg
      uiStore.showNotification('error', errMsg || 'Please fix the errors below.')
    } else if (status && status >= 500) {
      const errMsg = (data as { error?: string })?.error || 'Something went wrong. Please try again.'
      generalError.value = errMsg
      uiStore.showNotification('error', errMsg)
    } else {
      const errMsg = (data as { error?: string })?.error || 'An error occurred during registration.'
      generalError.value = errMsg
      uiStore.showNotification('error', errMsg)
    }
  } finally {
    isLoading.value = false
  }
}
</script>
