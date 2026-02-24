<template>
  <div class="order-notes">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">Order Notes</h3>
      <Button
        v-if="canAddNote"
        variant="primary"
        size="sm"
        @click="showAddNote = true"
      >
        Add Note
      </Button>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="notes.length === 0" class="text-center py-8 text-gray-500">
      <p>No notes found</p>
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="note in notes"
        :key="note.id"
        class="card p-4"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-gray-800">{{ note.note }}</p>
            <div class="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <span v-if="note.createdByName">{{ note.createdByName }}</span>
              <span v-else-if="note.createdBy">{{ note.createdBy }}</span>
              <span>•</span>
              <span>{{ formatDate(note.createdAt) }}</span>
              <span v-if="note.isInternal" class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                Internal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add Note Modal -->
    <div
      v-if="showAddNote"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeAddNote"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h4 class="text-lg font-bold mb-4">Add Note</h4>
        <form @submit.prevent="addNote">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <textarea
              v-model="newNote.note"
              rows="4"
              class="input w-full"
              placeholder="Enter note..."
              required
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="newNote.isInternal"
                class="rounded border-gray-300 text-primary-600"
              />
              <span class="text-sm text-gray-700">Internal note (only visible to staff)</span>
            </label>
          </div>
          <div class="flex gap-2 justify-end">
            <Button variant="secondary" @click="closeAddNote">Cancel</Button>
            <Button type="submit" variant="primary" :loading="isAdding">Add Note</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { orderEnhancementsApi } from '@/api/endpoints/order-enhancements'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import type { OrderNote } from '@/api/types'

const props = defineProps<{
  orderId: string
  canAddNote?: boolean
}>()

const uiStore = useUIStore()
const authStore = useAuthStore()
const isLoading = ref(false)
const isAdding = ref(false)
const notes = ref<OrderNote[]>([])
const showAddNote = ref(false)
const canAddNote = ref(props.canAddNote ?? true)

const newNote = ref<Partial<OrderNote>>({
  orderId: props.orderId,
  note: '',
  isInternal: false
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadNotes = async () => {
  isLoading.value = true
  try {
    const response = await orderEnhancementsApi.getOrderNotes(props.orderId)
    if (response.success && response.data) {
      notes.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load notes')
  } finally {
    isLoading.value = false
  }
}

const addNote = async () => {
  if (!newNote.value.note?.trim()) return
  
  isAdding.value = true
  try {
    const response = await orderEnhancementsApi.addOrderNote(newNote.value)
    if (response.success) {
      uiStore.showNotification('success', 'Note added successfully')
      closeAddNote()
      await loadNotes()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to add note')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to add note')
  } finally {
    isAdding.value = false
  }
}

const closeAddNote = () => {
  showAddNote.value = false
  newNote.value = {
    orderId: props.orderId,
    note: '',
    isInternal: false
  }
}

onMounted(() => {
  loadNotes()
})
</script>

