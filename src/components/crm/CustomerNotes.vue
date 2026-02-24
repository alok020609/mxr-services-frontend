<template>
  <div class="customer-notes">
    <div class="card">
      <h3 class="text-lg font-bold mb-4">Customer Notes</h3>
      
      <!-- Notes List -->
      <div v-if="notes.length > 0" class="space-y-3 mb-4">
        <div
          v-for="note in notes"
          :key="note.id || note.createdAt"
          class="p-4 bg-gray-50 rounded-lg"
        >
          <p class="text-gray-800 mb-2">{{ note.note }}</p>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span v-if="note.author || note.createdBy">
              By: {{ note.author || note.createdBy }}
            </span>
            <span v-if="note.createdAt">
              {{ formatDate(note.createdAt) }}
            </span>
          </div>
        </div>
      </div>
      
      <p v-else class="text-gray-500 text-sm mb-4">No notes added yet</p>
      
      <!-- Add Note Form -->
      <div class="space-y-2">
        <textarea
          v-model="newNote"
          placeholder="Enter a note about this customer..."
          rows="4"
          class="input w-full"
        ></textarea>
        <div class="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            @click="addNote"
            :loading="isAdding"
            :disabled="!newNote.trim()"
          >
            Add Note
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { crmApi } from '@/api/endpoints/crm'
import { useUIStore } from '@/stores/ui'
import Button from '@/components/common/Button.vue'
import type { CustomerNote } from '@/api/types'

interface Props {
  userId: string
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const notes = ref<CustomerNote[]>([])
const newNote = ref('')
const isAdding = ref(false)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const addNote = async () => {
  if (!newNote.value.trim()) return
  
  isAdding.value = true
  try {
    const response = await crmApi.addNote(props.userId, newNote.value.trim())
    if (response.success) {
      // Add note to list (assuming response includes the created note)
      const note: CustomerNote = {
        note: newNote.value.trim(),
        createdAt: new Date().toISOString()
      }
      notes.value.unshift(note)
      newNote.value = ''
      uiStore.showNotification('success', 'Note added successfully')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to add note')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to add note')
  } finally {
    isAdding.value = false
  }
}

// Load notes from customer 360 data or separate endpoint if available
onMounted(() => {
  // Notes would typically come from customer 360 view or a separate endpoint
  // For now, we'll start with an empty array
})
</script>

