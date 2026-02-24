<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <LegalDocumentViewer :document-type="documentType" :show-accept-button="isAuthenticated" />
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LegalDocumentViewer from '@/components/compliance/LegalDocumentViewer.vue'

interface Props {
  documentType: string
}

const props = defineProps<Props>()
const authStore = useAuthStore()
const sidebarOpen = computed(() => false)
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

