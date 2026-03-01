<template>
  <div>
    <Header />
    <main class="min-h-screen py-16 bg-slate-50 dark:bg-sgBgDark">
      <div class="container mx-auto px-4 max-w-2xl">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Contact</h1>
        <p class="text-slate-600 dark:text-slate-400 mb-4">Get in touch for a quote or to book an installation. Request a <strong>free site visit</strong> – we’ll assess your premises and recommend the right package.</p>
        <a
          v-if="whatsAppUrl"
          :href="whatsAppUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-sgPrimary hover:opacity-90 text-white font-medium mb-8 transition-colors shadow-md"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Chat on WhatsApp
        </a>
        <p v-if="submitted" class="mb-4 p-4 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 font-medium">Thank you. We’ll get back to you soon.</p>
        <p v-else-if="genericError" class="mb-4 p-4 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
          {{ genericError }}
          <button type="button" class="mt-2 underline font-medium" @click="genericError = ''">Try again</button>
        </p>
        <form v-show="!submitted" class="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-sgBgDark p-6 shadow-sm" @submit.prevent="handleSubmit">
          <div>
            <label for="contact-name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
            <input
              id="contact-name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sgPrimary focus:border-sgPrimary bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Your name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.name }}</p>
          </div>
          <div>
            <label for="contact-email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sgPrimary focus:border-sgPrimary bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              :class="{ 'border-red-500': errors.email }"
              placeholder="you@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.email }}</p>
          </div>
          <div>
            <label for="contact-phone" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
            <input
              id="contact-phone"
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sgPrimary focus:border-sgPrimary bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              :placeholder="contactPhonePlaceholder"
            />
          </div>
          <div>
            <label class="flex items-center gap-2 mb-1">
              <input v-model="form.freeSiteVisit" type="checkbox" class="rounded border-slate-300 dark:border-slate-600 text-sgPrimary focus:ring-sgPrimary" />
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">I’d like a free site visit</span>
            </label>
          </div>
          <div>
            <label for="contact-message" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
            <textarea
              id="contact-message"
              v-model="form.message"
              rows="4"
              required
              class="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sgPrimary focus:border-sgPrimary bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              :class="{ 'border-red-500': errors.message }"
              placeholder="How can we help? (e.g. I need CCTV for my home/shop in Delhi NCR)"
            />
            <p v-if="errors.message" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.message }}</p>
          </div>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3 rounded-lg bg-sgPrimary hover:opacity-90 text-white font-medium transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Sending...' : 'Send message' }}
          </button>
        </form>
      </div>
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { AxiosError } from 'axios'
import { env } from '@/config/env'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Toast from '@/components/common/Toast.vue'
import { supportApi } from '@/api/endpoints/support'
import { useUIStore } from '@/stores/ui'
import { extractErrorMessage, isNetworkError } from '@/utils/errorHandler'

const uiStore = useUIStore()
const submitted = ref(false)
const isSubmitting = ref(false)
const genericError = ref('')
const whatsAppNumber = env.whatsappNumber
const whatsAppUrl = computed(() =>
  whatsAppNumber
    ? 'https://wa.me/' + whatsAppNumber + '?text=' + encodeURIComponent('Hi, I\'d like to schedule a free site visit for CCTV installation.')
    : ''
)
const contactPhonePlaceholder = env.contactPhone || '+1 234 567 8900'
const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
  freeSiteVisit: false
})
const errors = reactive<Record<string, string>>({
  name: '',
  email: '',
  message: ''
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(): boolean {
  errors.name = ''
  errors.email = ''
  errors.message = ''
  let valid = true
  const name = form.name.trim()
  const email = form.email.trim()
  const message = form.message.trim()
  if (!name) {
    errors.name = 'Name is required'
    valid = false
  }
  if (!email) {
    errors.email = 'Email is required'
    valid = false
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address'
    valid = false
  }
  if (!message) {
    errors.message = 'Message is required'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  if (!validate()) return
  genericError.value = ''
  isSubmitting.value = true
  try {
    await supportApi.submitContact({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      ...(form.phone?.trim() ? { phone: form.phone.trim() } : {}),
      ...(form.freeSiteVisit ? { freeSiteVisit: true } : {})
    })
    submitted.value = true
    form.name = ''
    form.email = ''
    form.phone = ''
    form.message = ''
    form.freeSiteVisit = false
    uiStore.showNotification('success', 'Thank you. We’ll get back to you soon.')
  } catch (err) {
    const axiosError = err as AxiosError
    const status = axiosError.response?.status
    const data = axiosError.response?.data as { error?: string } | undefined
    if (status === 400 && data?.error) {
      uiStore.showNotification('error', data.error)
    } else if (status && status >= 500) {
      genericError.value = 'Something went wrong. Please try again later.'
      uiStore.showNotification('error', 'Server error. Please try again later.')
    } else if (isNetworkError(axiosError)) {
      genericError.value = 'Connection failed. Please check your internet and try again.'
      uiStore.showNotification('error', genericError.value)
    } else {
      const msg = extractErrorMessage(axiosError)
      genericError.value = msg || 'Something went wrong. Please try again.'
      uiStore.showNotification('error', msg || genericError.value)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
