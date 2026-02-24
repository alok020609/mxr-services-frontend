<template>
  <div class="order-notes">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Order Notes</h3>
      <Button variant="primary" size="sm" @click="showAddForm = !showAddForm">
        <svg class="h-4 w-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Note
      </Button>
    </div>

    <!-- Add Note Form -->
    <div v-if="showAddForm" class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <textarea
            v-model="newNote.note"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows="3"
            placeholder="Enter note..."
          ></textarea>
        </div>
        <div class="flex items-center">
          <input
            v-model="newNote.isInternal"
            type="checkbox"
            id="isInternal"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="isInternal" class="ml-2 text-sm text-gray-700">
            Internal note (only visible to admins)
          </label>
        </div>
        <div class="flex justify-end space-x-2">
          <Button variant="secondary" size="sm" @click="cancelAdd">Cancel</Button>
          <Button variant="primary" size="sm" @click="addNote" :loading="isAdding">
            Add Note
          </Button>
        </div>
      </div>
    </div>

    <!-- Notes List -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner size="sm" />
      <span class="ml-2 text-gray-600">Loading notes...</span>
    </div>

    <div v-else-if="notes.length === 0" class="text-center py-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p>No notes yet</p>
      <p class="text-sm mt-1">Add a note to track important information about this order</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="note in notes"
        :key="note.id"
        :class="[
          'p-4 rounded-lg border',
          note.isInternal 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-white border-gray-200'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <span
                v-if="note.isInternal"
                class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                Internal
              </span>
              <span
                v-else
                class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
              >
                Public
              </span>
              <span v-if="note.createdByName" class="text-sm text-gray-600">
                by {{ note.createdByName }}
              </span>
            </div>
            <p class="text-gray-900 whitespace-pre-wrap">{{ note.note }}</p>
            <p class="text-xs text-gray-500 mt-2">
              {{ formatDate(note.createdAt) }}
            </p>
          </div>
          <div class="flex items-center space-x-2 ml-4">
            <button
              @click="editNote(note)"
              class="p-1 text-gray-600 hover:text-primary-600 transition-colors"
              title="Edit note"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteNote(note.id)"
              class="p-1 text-gray-600 hover:text-red-600 transition-colors"
              title="Delete note"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Note Modal -->
    <Modal
      :is-open="!!editingNote"
      title="Edit Note"
      @close="editingNote = null"
    >
      <div v-if="editingNote" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <textarea
            v-model="editForm.note"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows="4"
          ></textarea>
        </div>
        <div class="flex items-center">
          <input
            v-model="editForm.isInternal"
            type="checkbox"
            id="editIsInternal"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="editIsInternal" class="ml-2 text-sm text-gray-700">
            Internal note (only visible to admins)
          </label>
        </div>
        <div class="flex justify-end space-x-2">
          <Button variant="secondary" @click="editingNote = null">Cancel</Button>
          <Button variant="primary" @click="updateNote" :loading="isUpdating">
            Update Note
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { adminApi } from '@/api/endpoints/admin'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatDate } from '@/utils/formatters'
import type { OrderNote } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Modal from '@/components/common/Modal.vue'

const props = defineProps<{
  orderId: string
}>()

const emit = defineEmits<{
  (e: 'note-added'): void
  (e: 'note-updated'): void
  (e: 'note-deleted'): void
}>()

const uiStore = useUIStore()
const isLoading = ref(false)
const isAdding = ref(false)
const isUpdating = ref(false)
const notes = ref<OrderNote[]>([])
const showAddForm = ref(false)
const editingNote = ref<OrderNote | null>(null)

const newNote = ref({
  note: '',
  isInternal: false
})

const editForm = ref({
  note: '',
  isInternal: false
})

/** Normalize note from API: backend returns admin { id, firstName, lastName, email } not createdByName */
function normalizeNote(note: any): OrderNote {
  const createdByName = note.createdByName ?? (note.admin
    ? [note.admin.firstName, note.admin.lastName].filter(Boolean).join(' ') || note.admin.email
    : undefined)
  return { ...note, createdByName }
}

const loadNotes = async () => {
  if (!props.orderId) return
  
  isLoading.value = true
  try {
    const response = await adminApi.getOrderNotes(props.orderId)
    if (response.success && response.data) {
      const raw = Array.isArray(response.data) ? response.data : []
      notes.value = raw.map(normalizeNote)
    } else {
      notes.value = []
      uiStore.showNotification('error', response.error || 'Failed to load notes')
    }
  } catch (error: any) {
    notes.value = []
    uiStore.showNotification('error', (error as Error)?.message || 'Failed to load notes')
  } finally {
    isLoading.value = false
  }
}

const addNote = async () => {
  if (!newNote.value.note.trim()) {
    uiStore.showNotification('error', 'Note cannot be empty')
    return
  }

  isAdding.value = true
  try {
    const response = await adminApi.addOrderNote(
      props.orderId,
      newNote.value.note.trim(),
      newNote.value.isInternal
    )
    sendToTerminal('log', '[OrderNotes] Add note response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Note added successfully')
      newNote.value = { note: '', isInternal: false }
      showAddForm.value = false
      await loadNotes()
      emit('note-added')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to add note')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to add note')
    sendToTerminal('error', '[OrderNotes] Error adding note:', error)
  } finally {
    isAdding.value = false
  }
}

const editNote = (note: OrderNote) => {
  editingNote.value = note
  editForm.value = {
    note: note.note,
    isInternal: note.isInternal
  }
}

const updateNote = async () => {
  if (!editingNote.value || !editForm.value.note.trim()) {
    uiStore.showNotification('error', 'Note cannot be empty')
    return
  }

  isUpdating.value = true
  try {
    const response = await adminApi.updateOrderNote(editingNote.value.id, editForm.value.note)
    sendToTerminal('log', '[OrderNotes] Update note response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Note updated successfully')
      editingNote.value = null
      await loadNotes()
      emit('note-updated')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update note')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update note')
    sendToTerminal('error', '[OrderNotes] Error updating note:', error)
  } finally {
    isUpdating.value = false
  }
}

const deleteNote = async (noteId: string) => {
  if (!confirm('Are you sure you want to delete this note?')) {
    return
  }

  try {
    const response = await adminApi.deleteOrderNote(noteId)
    sendToTerminal('log', '[OrderNotes] Delete note response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Note deleted successfully')
      await loadNotes()
      emit('note-deleted')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete note')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete note')
    sendToTerminal('error', '[OrderNotes] Error deleting note:', error)
  }
}

const cancelAdd = () => {
  newNote.value = { note: '', isInternal: false }
  showAddForm.value = false
}

watch(() => props.orderId, (newId) => {
  if (newId) {
    loadNotes()
  }
}, { immediate: true })

onMounted(() => {
  if (props.orderId) {
    loadNotes()
  }
})
</script>

<style scoped>
.order-notes {
  @apply space-y-4;
}
</style>

