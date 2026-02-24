<template>
  <AdminLayout>
    <div>
      <h1 class="text-3xl font-bold mb-8">Compliance Management</h1>
      
      <!-- Tabs -->
      <div class="border-b mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 font-medium border-b-2 transition-colors',
            activeTab === tab.id
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <!-- PCI Compliance Tab -->
      <div v-if="activeTab === 'pci'">
        <PCIStatus />
      </div>
      
      <!-- Tax Calculations Tab -->
      <div v-if="activeTab === 'tax'">
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-bold mb-4">Tax Calculation Tools</h2>
            <p class="text-gray-600 mb-6">Test tax calculations using different providers.</p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TaxCalculatorAvalara />
            <TaxCalculatorTaxJar />
            <TaxCalculatorVATMOSS />
            <TaxCalculatorGST />
          </div>
        </div>
      </div>
      
      <!-- Nexus Tracking Tab -->
      <div v-if="activeTab === 'nexus'">
        <NexusTracker />
      </div>
      
      <!-- Legal Documents Tab -->
      <div v-if="activeTab === 'documents'">
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Legal Documents</h2>
            <Button @click="showDocumentModal = true" variant="primary" size="sm">
              Create Document
            </Button>
          </div>
          
          <div v-if="isLoading" class="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
          
          <div v-else-if="documents.length === 0" class="text-center py-8 text-gray-500">
            <p>No legal documents found.</p>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="doc in documents"
              :key="doc.id || doc.type"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p class="font-semibold capitalize">{{ doc.title || doc.type }}</p>
                <p class="text-sm text-gray-600">Version {{ doc.version }} • {{ doc.status }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="viewDocument(doc)"
                  class="text-primary-600 hover:text-primary-800 text-sm"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Document Modal (simplified - would need full CRUD in production) -->
    <div
      v-if="showDocumentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDocumentModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Create Legal Document</h3>
        <p class="text-gray-600 mb-4">Document creation form would go here.</p>
        <Button @click="showDocumentModal = false" variant="secondary">
          Close
        </Button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { complianceApi } from '@/api/endpoints/compliance'
import type { LegalDocument } from '@/api/types'
import AdminLayout from './AdminLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import PCIStatus from '@/components/compliance/PCIStatus.vue'
import TaxCalculatorAvalara from '@/components/compliance/TaxCalculatorAvalara.vue'
import TaxCalculatorTaxJar from '@/components/compliance/TaxCalculatorTaxJar.vue'
import TaxCalculatorVATMOSS from '@/components/compliance/TaxCalculatorVATMOSS.vue'
import TaxCalculatorGST from '@/components/compliance/TaxCalculatorGST.vue'
import NexusTracker from '@/components/compliance/NexusTracker.vue'

const activeTab = ref<'pci' | 'tax' | 'nexus' | 'documents'>('pci')
const documents = ref<LegalDocument[]>([])
const isLoading = ref(false)
const showDocumentModal = ref(false)

const tabs = [
  { id: 'pci', label: 'PCI Compliance' },
  { id: 'tax', label: 'Tax Calculations' },
  { id: 'nexus', label: 'Nexus Tracking' },
  { id: 'documents', label: 'Legal Documents' }
]

const loadDocuments = async () => {
  isLoading.value = true
  try {
    // In a real app, you'd have an endpoint to list all documents
    // For now, we'll try to load common document types
    const types = ['terms', 'privacy', 'cookie']
    // Use getDocumentSafe to prevent 404s from being logged as errors
    const promises = types.map(type => complianceApi.getDocumentSafe(type))
    const results = await Promise.allSettled(promises)
    
    // Filter to only include successful responses with data
    documents.value = results
      .filter((r): r is PromiseFulfilledResult<any> => {
        if (r.status !== 'fulfilled') return false
        const value = r.value
        // Only include if success is true and data exists
        return value && value.success === true && value.data
      })
      .map(r => r.value.data)
      .filter(Boolean)
  } catch (error) {
    // Only log unexpected errors (not 404s)
    console.error('Failed to load documents:', error)
  } finally {
    isLoading.value = false
  }
}

const viewDocument = (doc: LegalDocument) => {
  // In a real app, you'd navigate to a document editor or viewer
  console.log('View document:', doc)
}

onMounted(() => {
  loadDocuments()
})
</script>

