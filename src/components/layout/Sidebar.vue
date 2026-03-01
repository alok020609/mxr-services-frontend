<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 md:hidden"
    @click="$emit('close')"
  >
    <div class="fixed inset-0 bg-black bg-opacity-50"></div>
    <div
      class="fixed left-0 top-0 bottom-0 w-64 bg-cyber-900 shadow-xl overflow-y-auto border-r border-cyber-800"
      @click.stop
    >
      <div class="p-4">
        <div class="flex items-center justify-between mb-6">
          <span class="text-xl font-bold text-neon">Menu</span>
          <button
            @click="$emit('close')"
            class="p-2 text-cyber-200 hover:bg-cyber-800 hover:text-white rounded-lg transition-colors"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav class="space-y-1">
          <router-link
            to="/"
            class="block px-4 py-2 rounded-lg text-cyber-200 hover:bg-cyber-800 hover:text-white transition-colors"
            @click="$emit('close')"
          >
            Home
          </router-link>
          <router-link
            to="/products"
            class="block px-4 py-2 rounded-lg text-cyber-200 hover:bg-cyber-800 hover:text-white transition-colors"
            @click="$emit('close')"
          >
            Products
          </router-link>
          <router-link
            to="/services"
            class="block px-4 py-2 rounded-lg text-cyber-200 hover:bg-cyber-800 hover:text-white transition-colors"
            @click="$emit('close')"
          >
            Services
          </router-link>
          <router-link
            v-if="isAuthenticated"
            to="/cart"
            class="block px-4 py-2 rounded-lg text-cyber-200 hover:bg-cyber-800 hover:text-white transition-colors"
            @click="$emit('close')"
          >
            Cart
          </router-link>
          <router-link
            v-if="isAuthenticated"
            to="/orders"
            class="block px-4 py-2 rounded-lg text-cyber-200 hover:bg-cyber-800 hover:text-white transition-colors"
            @click="$emit('close')"
          >
            Orders
          </router-link>
          <router-link
            v-if="isAuthenticated"
            to="/wishlist"
            class="block px-4 py-2 rounded-lg text-cyber-200 hover:bg-cyber-800 hover:text-white transition-colors"
            @click="$emit('close')"
          >
            Wishlist
          </router-link>
          <router-link
            v-if="isAuthenticated && isAdmin"
            to="/admin"
            class="block px-4 py-2 rounded-lg text-cyber-200 hover:bg-cyber-800 hover:text-white transition-colors"
            @click="$emit('close')"
          >
            Admin Panel
          </router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)
</script>

