<template>
  <div>
    <Header />
    <main class="min-h-screen py-16 bg-slate-50">
      <div class="container mx-auto px-4 max-w-2xl">
        <h1 class="text-3xl font-bold text-slate-800 mb-2">Contact</h1>
        <p class="text-slate-600 mb-8">Get in touch for a quote or to book an installation.</p>
        <form class="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">
          <div>
            <label for="contact-name" class="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              id="contact-name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label for="contact-email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label for="contact-phone" class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              id="contact-phone"
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label for="contact-message" class="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea
              id="contact-message"
              v-model="form.message"
              rows="4"
              required
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder="How can we help?"
            />
          </div>
          <button
            type="submit"
            class="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            Send message
          </button>
        </form>
        <p v-if="submitted" class="mt-4 text-emerald-600 font-medium">Thank you. We’ll get back to you soon.</p>
      </div>
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Toast from '@/components/common/Toast.vue'

const submitted = ref(false)
const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})

function handleSubmit() {
  // Replace with API call or form action when backend is ready
  submitted.value = true
  form.name = ''
  form.email = ''
  form.phone = ''
  form.message = ''
}
</script>
