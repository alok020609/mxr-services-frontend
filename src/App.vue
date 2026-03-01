<template>
  <div id="app">
    <RouterView />
    <WhatsAppFloat v-if="showWhatsAppFloat" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat.vue'

const authStore = useAuthStore()
const route = useRoute()

const showWhatsAppFloat = computed(() =>
  !route.path.startsWith('/admin') &&
  !route.path.startsWith('/vendor') &&
  !route.path.startsWith('/temp1frontend')
)

onMounted(() => {
  // Verify user is loaded from localStorage
  if (import.meta.env.DEV) {
    console.log('[App] Auth state on mount:', {
      isAuthenticated: authStore.isAuthenticated,
      isAdmin: authStore.isAdmin,
      user: authStore.user,
      userRole: authStore.user?.role,
      hasToken: !!authStore.token
    })
  }
  
  // If user is authenticated but user data is missing, try to load profile
  if (authStore.token && !authStore.user) {
    console.warn('[App] Token exists but user data is missing. This might indicate a data sync issue.')
  }
})
</script>

<style scoped>
#app {
  min-height: 100vh;
}
</style>

