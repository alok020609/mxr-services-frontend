<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- General error message -->
        <div v-if="generalError" class="rounded-md bg-red-50 border border-red-200 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ generalError }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-md shadow-sm space-y-4">
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
            placeholder="Enter your password"
            required
            :error="errors.password"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </router-link>
          </div>
        </div>

        <div>
          <Button type="submit" variant="primary" class="w-full" :loading="isLoading">
            Sign in
          </Button>
        </div>

        <div v-if="showSocialLogin" class="space-y-3">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-gray-50 px-2 text-gray-600">Or continue with</span>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-if="googleSignIn.isAvailable"
              ref="googleButtonRef"
              class="min-h-[40px] flex items-center justify-center"
              :class="{ 'sm:col-span-2': !microsoftSignIn.isAvailable }"
            />
            <Button
              v-if="microsoftSignIn.isAvailable"
              type="button"
              variant="outline"
              class="w-full"
              :class="{ 'sm:col-span-2': !googleSignIn.isAvailable }"
              :loading="isSocialLoading"
              :disabled="isSocialLoading"
              @click="handleMicrosoftSignIn"
            >
              Sign in with Microsoft
            </Button>
          </div>
        </div>

        <div class="text-center">
          <span class="text-sm text-gray-600">Don't have an account? </span>
          <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { authApi } from '@/api/endpoints/auth'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import type { AxiosError } from 'axios'
import { getValidationErrors, extractErrorMessage } from '@/utils/errorHandler'
import { sendToTerminal } from '@/utils/apiLogger'
import { useAuth } from '@/composables/useAuth'
import { useGoogleSignIn } from '@/composables/useGoogleSignIn'
import { useMicrosoftSignIn } from '@/composables/useMicrosoftSignIn'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUIStore()
const { loginWithGoogle, loginWithMicrosoft } = useAuth()
const googleSignIn = useGoogleSignIn()
const microsoftSignIn = useMicrosoftSignIn()

const googleButtonRef = ref<HTMLElement | null>(null)
const isSocialLoading = ref(false)
const showSocialLogin = computed(() => googleSignIn.isAvailable || microsoftSignIn.isAvailable)

const form = ref({
  email: '',
  password: ''
})

const errors = ref<Record<string, string>>({})
const isLoading = ref(false)
const rememberMe = ref(false)
const generalError = ref<string | null>(null)

const handleLogin = async () => {
  // Clear previous errors
  errors.value = {}
  generalError.value = null
  isLoading.value = true

  try {
    const response = await authApi.login(form.value)
    
    if (response.success && response.data) {
      // Ensure user object has all required fields including role
      const userData = response.data.user
      
      // Debug log in development
      if (import.meta.env.DEV) {
        sendToTerminal('log', '[Login] User data received:', {
          user: userData,
          role: userData?.role,
          rawRole: userData?.role,
          normalizedRole: (userData?.role || '').toLowerCase(),
          isAdmin: (userData?.role || '').toLowerCase() === 'admin'
        })
      }
      
      authStore.login(
        response.data.token,
        response.data.refreshToken,
        userData
      )
      
      uiStore.showNotification('success', 'Login successful!')
      
      // Debug auth state after login
      if (import.meta.env.DEV) {
        sendToTerminal('log', '[Login] Auth state after login:', {
          isAuthenticated: authStore.isAuthenticated,
          isAdmin: authStore.isAdmin,
          userRole: authStore.user?.role,
          normalizedRole: authStore.user?.role?.toLowerCase()
        })
      }
      
      // Redirect to intended page or home (or admin if admin user)
      const redirect = route.query.redirect as string || (authStore.isAdmin ? '/admin' : '/')
      router.push(redirect)
    } else {
      // Handle error response from API
      generalError.value = response.error || 'Login failed. Please try again.'
      uiStore.showAuthError(response as any) // Show user-friendly auth error
    }
  } catch (error: any) {
    // Handle AxiosError
    const axiosError = error as AxiosError
    
    // Extract validation errors for field-level display
    const validationErrors = getValidationErrors(axiosError)
    if (validationErrors) {
      // Convert array of errors to single string per field
      Object.keys(validationErrors).forEach(field => {
        errors.value[field] = validationErrors[field]?.[0] || 'Invalid value'
      })
      
      // Show validation error notification
      uiStore.showValidationErrors(validationErrors)
    } else {
      // Show authentication error with user-friendly message
      uiStore.showAuthError(axiosError)
      // Extract error message for display
      generalError.value = extractErrorMessage(axiosError)
    }
  } finally {
    isLoading.value = false
  }
}

function handleGoogleCredential(idToken: string) {
  generalError.value = null
  isSocialLoading.value = true
  loginWithGoogle(idToken).then((result) => {
    if (result?.success) {
      uiStore.showNotification('success', 'Login successful!')
      const redirect = (route.query.redirect as string) || (authStore.isAdmin ? '/admin' : '/')
      router.push(redirect)
    } else {
      generalError.value = result?.error || 'Sign in with Google failed.'
    }
  }).finally(() => {
    isSocialLoading.value = false
  })
}

async function handleMicrosoftSignIn() {
  generalError.value = null
  isSocialLoading.value = true
  try {
    const idToken = await microsoftSignIn.signIn()
    if (!idToken) {
      isSocialLoading.value = false
      return
    }
    const result = await loginWithMicrosoft(idToken)
    if (result?.success) {
      uiStore.showNotification('success', 'Login successful!')
      const redirect = (route.query.redirect as string) || (authStore.isAdmin ? '/admin' : '/')
      router.push(redirect)
    } else {
      generalError.value = result?.error || 'Sign in with Microsoft failed.'
    }
  } finally {
    isSocialLoading.value = false
  }
}

onMounted(() => {
  if (googleSignIn.isAvailable && googleButtonRef.value) {
    googleSignIn.renderButton(googleButtonRef.value, handleGoogleCredential)
  }
})

watch(googleButtonRef, (el) => {
  if (googleSignIn.isAvailable && el) {
    googleSignIn.renderButton(el, handleGoogleCredential)
  }
})
</script>

