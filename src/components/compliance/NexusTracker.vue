<template>
  <div class="nexus-tracker">
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold">Nexus Locations</h3>
        <Button @click="showAddForm = true" variant="primary" size="sm">
          Add Nexus Location
        </Button>
      </div>
      
      <!-- Add/Edit Form -->
      <div v-if="showAddForm" class="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h4 class="font-semibold mb-4">{{ editingNexus ? 'Edit' : 'Add' }} Nexus Location</h4>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="nexusForm.country"
              label="Country"
              required
              placeholder="US"
            />
            <Input
              v-model="nexusForm.state"
              label="State/Province"
              placeholder="CA"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="nexusForm.city"
              label="City"
              placeholder="San Francisco"
            />
            <Input
              v-model="nexusForm.zip"
              label="ZIP/Postal Code"
              placeholder="94102"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Status</label>
              <select v-model="nexusForm.status" class="input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <Input
              v-model="nexusForm.effectiveDate"
              type="date"
              label="Effective Date (Optional)"
            />
          </div>
          <div class="flex gap-3">
            <Button type="submit" variant="primary" :loading="isSubmitting">
              {{ editingNexus ? 'Update' : 'Add' }} Location
            </Button>
            <Button type="button" variant="secondary" @click="cancelForm">
              Cancel
            </Button>
          </div>
        </form>
      </div>
      
      <!-- Nexus Locations List -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
      <div v-else-if="nexusLocations.length === 0" class="text-center py-8 text-gray-500">
        <p>No nexus locations tracked yet.</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="location in nexusLocations"
          :key="location.id || `${location.country}-${location.state}`"
          class="flex items-center justify-between p-4 border rounded-lg"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold">{{ getLocationLabel(location) }}</span>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-semibold',
                  location.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ location.status }}
              </span>
            </div>
            <div class="text-sm text-gray-600">
              <span v-if="location.effectiveDate">
                Effective: {{ formatDate(location.effectiveDate) }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="editNexus(location)"
              class="text-primary-600 hover:text-primary-800 text-sm"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { complianceApi } from '@/api/endpoints/compliance'
import type { NexusLocation } from '@/api/types'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const uiStore = useUIStore()
const nexusLocations = ref<NexusLocation[]>([])
const showAddForm = ref(false)
const editingNexus = ref<NexusLocation | null>(null)
const isSubmitting = ref(false)
const isLoading = ref(false)

const nexusForm = ref<Partial<NexusLocation>>({
  country: '',
  state: '',
  city: '',
  zip: '',
  status: 'active',
  effectiveDate: ''
})

const getLocationLabel = (location: NexusLocation): string => {
  const parts = [location.city, location.state, location.country].filter(Boolean)
  return parts.join(', ') || location.country
}

const handleSubmit = async () => {
  if (!nexusForm.value.country) {
    uiStore.showNotification('warning', 'Country is required')
    return
  }
  
  isSubmitting.value = true
  try {
    const response = await complianceApi.trackNexus(nexusForm.value as NexusLocation)
    if (response.success && response.data) {
      uiStore.showNotification('success', editingNexus.value ? 'Nexus location updated' : 'Nexus location added')
      cancelForm()
      // In a real app, you'd reload the list or add to it
      // For now, we'll just show success
    } else {
      uiStore.showNotification('error', response.error || 'Failed to save nexus location')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to save nexus location')
  } finally {
    isSubmitting.value = false
  }
}

const editNexus = (location: NexusLocation) => {
  editingNexus.value = location
  nexusForm.value = { ...location }
  showAddForm.value = true
}

const cancelForm = () => {
  showAddForm.value = false
  editingNexus.value = null
  nexusForm.value = {
    country: '',
    state: '',
    city: '',
    zip: '',
    status: 'active',
    effectiveDate: ''
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
  // In a real app, you'd load existing nexus locations here
  // For now, we'll leave it empty
})
</script>

