<template>
  <div class="min-h-screen bg-gray-50">
    <VendorSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <VendorHeader @toggle-sidebar="sidebarOpen = true" />
    
    <main class="ml-0 md:ml-64 pt-16">
      <div class="p-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import VendorSidebar from '@/components/vendor/VendorSidebar.vue'
import VendorHeader from '@/components/vendor/VendorHeader.vue'

const sidebarOpen = ref(false)
</script>

