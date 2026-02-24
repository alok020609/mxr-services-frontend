<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <AdminHeader @toggle-sidebar="sidebarOpen = true" />
    
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
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

const sidebarOpen = ref(false)
</script>

