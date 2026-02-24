<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-30 md:left-64">
    <div class="flex items-center justify-between h-full px-6">
      <button
        @click="$emit('toggle-sidebar')"
        class="md:hidden p-2 text-gray-700"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div class="flex items-center space-x-4">
        <router-link to="/" class="text-gray-600 hover:text-gray-900">
          View Store
        </router-link>
        <div class="h-8 w-px bg-gray-300"></div>
        <span class="text-gray-700">{{ user?.name }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineEmits<{
  'toggle-sidebar': []
}>()

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>

