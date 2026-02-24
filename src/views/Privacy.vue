<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Privacy & Compliance</h1>
      
      <div class="max-w-4xl space-y-6">
        <!-- GDPR Data Management -->
        <section class="card">
          <h2 class="text-xl font-bold mb-4">GDPR Data Management</h2>
          <p class="text-gray-600 mb-6 text-sm">
            Under GDPR, you have the right to access, export, and delete your personal data.
          </p>
          <div class="space-y-4">
            <DataExport />
            <DataDeletion />
          </div>
        </section>
        
        <!-- Legal Documents -->
        <section class="card">
          <h2 class="text-xl font-bold mb-4">Legal Documents</h2>
          <p class="text-gray-600 mb-6 text-sm">
            Review and accept our legal documents. You must accept these to use our services.
          </p>
          
          <div class="space-y-6">
            <div>
              <h3 class="font-semibold mb-3">Terms of Service</h3>
              <LegalDocumentViewer document-type="terms" />
            </div>
            
            <div>
              <h3 class="font-semibold mb-3">Privacy Policy</h3>
              <LegalDocumentViewer document-type="privacy" />
            </div>
            
            <div>
              <h3 class="font-semibold mb-3">Cookie Policy</h3>
              <LegalDocumentViewer document-type="cookie" />
            </div>
          </div>
        </section>
        
        <!-- Document Acceptance History -->
        <section class="card">
          <h2 class="text-xl font-bold mb-4">Document Acceptance History</h2>
          <div v-if="isLoadingAcceptance" class="flex justify-center py-4">
            <LoadingSpinner size="sm" />
          </div>
          <div v-else-if="acceptanceHistory.length === 0" class="text-center py-8 text-gray-500">
            <p>No document acceptance records found.</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(acceptance, index) in acceptanceHistory"
              :key="index"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p class="font-semibold capitalize">{{ acceptance.documentType }}</p>
                <p class="text-sm text-gray-600">Version {{ acceptance.version }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    acceptance.accepted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ acceptance.accepted ? 'Accepted' : 'Not Accepted' }}
                </span>
                <span v-if="acceptance.acceptedAt" class="text-xs text-gray-500">
                  {{ formatDate(acceptance.acceptedAt) }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { complianceApi } from '@/api/endpoints/compliance'
import type { DocumentAcceptance } from '@/api/types'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DataExport from '@/components/compliance/DataExport.vue'
import DataDeletion from '@/components/compliance/DataDeletion.vue'
import LegalDocumentViewer from '@/components/compliance/LegalDocumentViewer.vue'

const authStore = useAuthStore()
const sidebarOpen = ref(false)
const acceptanceHistory = ref<Array<DocumentAcceptance & { acceptedAt?: string }>>([])
const isLoadingAcceptance = ref(false)

const documentTypes = ['terms', 'privacy', 'cookie']

const loadAcceptanceHistory = async () => {
  if (!authStore.isAuthenticated) return
  
  isLoadingAcceptance.value = true
  try {
    const promises = documentTypes.map(async (type) => {
      try {
        const response = await complianceApi.checkAcceptance(type)
        if (response.success && response.data) {
          return {
            documentType: type,
            version: response.data.version,
            accepted: response.data.accepted,
            userId: authStore.user?.id || '',
            acceptedAt: undefined // API doesn't return this, but we can add it if available
          }
        }
      } catch (err) {
        // Ignore errors for individual checks
      }
      return null
    })
    
    const results = await Promise.all(promises)
    acceptanceHistory.value = results.filter(Boolean) as Array<DocumentAcceptance & { acceptedAt?: string }>
  } catch (error) {
    console.error('Failed to load acceptance history:', error)
  } finally {
    isLoadingAcceptance.value = false
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadAcceptanceHistory()
})
</script>

