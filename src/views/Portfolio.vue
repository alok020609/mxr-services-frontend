<template>
  <div>
    <Header />
    <main class="min-h-screen py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-slate-800 mb-8">Portfolio</h1>
        <p class="text-slate-600 mb-10">Our projects and installations. Replace with your own content and images.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div class="aspect-video bg-slate-200 flex items-center justify-center">
              <span class="text-slate-500 text-sm">Placeholder {{ i }}</span>
            </div>
            <div class="p-4">
              <h2 class="font-semibold text-slate-800">Project {{ i }}</h2>
              <p class="text-sm text-slate-600 mt-1">Add your project description and image.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Toast from '@/components/common/Toast.vue'
</script>
