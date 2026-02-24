<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Advanced Admin Features</h1>
    
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
      
      <!-- Order Notes Tab -->
      <div v-if="activeTab === 'notes'">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-bold mb-4">Order Notes</h2>
          <p class="text-gray-600 mb-4">Add and manage notes for orders. Enter an order ID to view existing notes.</p>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Order ID</label>
              <input
                v-model="noteForm.orderId"
                type="text"
                class="input"
                placeholder="Enter order ID"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Note</label>
              <textarea
                v-model="noteForm.note"
                class="input"
                rows="4"
                placeholder="Enter note"
              ></textarea>
            </div>
            <div class="flex items-center">
              <input
                v-model="noteForm.isInternal"
                type="checkbox"
                id="isInternalNote"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="isInternalNote" class="ml-2 text-sm text-gray-700">
                Internal note (only visible to admins)
              </label>
            </div>
            <Button variant="primary" @click="addOrderNote" :loading="isProcessing">
              Add Note
            </Button>
          </div>
        </div>
        
        <div v-if="selectedOrderId" class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-bold mb-4">Notes for Order: {{ selectedOrderId }}</h3>
          <div v-if="orderNotes.length === 0" class="text-center py-8">
            <p class="text-gray-500">No notes found</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="note in orderNotes"
              :key="note.id"
              class="border rounded p-4 flex justify-between items-start"
            >
              <div class="flex-1">
                <p class="text-gray-700">{{ note.note }}</p>
                <p class="text-sm text-gray-500 mt-2">{{ formatDate(note.createdAt) }}</p>
              </div>
              <div class="flex space-x-2 ml-4">
                <button @click="editNote(note)" class="text-primary-600 hover:text-primary-800 text-sm">Edit</button>
                <button @click="deleteNote(note.id)" class="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tasks Tab -->
      <div v-if="activeTab === 'tasks'">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-bold mb-4">Order Tasks</h2>
          <p class="text-gray-600 mb-4">Assign tasks to admin users for specific orders. Select an order ID, assignee, task type, and priority.</p>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Order ID</label>
              <input
                v-model="taskForm.orderId"
                type="text"
                class="input"
                placeholder="Enter order ID"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Assign To</label>
              <select v-model="taskForm.assignedTo" class="input" required>
                <option value="">Select admin user...</option>
                <option v-for="user in adminUsers" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.email }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Task Type</label>
              <select v-model="taskForm.taskType" class="input" required>
                <option value="">Select task type...</option>
                <option value="REVIEW">Review</option>
                <option value="FULFILLMENT">Fulfillment</option>
                <option value="CUSTOMER_SERVICE">Customer Service</option>
                <option value="REFUND">Refund</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Priority</label>
              <select v-model="taskForm.priority" class="input" required>
                <option value="">Select priority...</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <Button variant="primary" @click="assignTask" :loading="isProcessing">
              Assign Task
            </Button>
          </div>
        </div>
      </div>
      
      <!-- Activity Logs Tab -->
      <div v-if="activeTab === 'activity'">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Activity Feed</h2>
          <p class="text-gray-600 mb-4">View recent admin activities and system events.</p>
          <ActivityFeed />
        </div>
      </div>
      
      <!-- Notifications Tab -->
      <div v-if="activeTab === 'notifications'">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Notifications</h2>
          <p class="text-gray-600 mb-4">View and manage admin notifications.</p>
          <NotificationsPanel :auto-refresh="true" :refresh-interval="30000" />
        </div>
      </div>
      
      <!-- Saved Filters Tab -->
      <div v-if="activeTab === 'filters'">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Saved Filters</h2>
          <p class="text-gray-600 mb-4">Save and manage filter presets for quick access.</p>
          <SavedFilters />
        </div>
      </div>
      
      
      <!-- Note Edit Modal -->
      <div
        v-if="editingNote"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="editingNote = null"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">Edit Note</h2>
          <form @submit.prevent="updateNote" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Note</label>
              <textarea
                v-model="noteEditForm.note"
                class="input"
                rows="4"
                required
              ></textarea>
            </div>
            <div class="flex justify-end space-x-4">
              <Button type="button" variant="secondary" @click="editingNote = null">Cancel</Button>
              <Button type="submit" variant="primary" :loading="isProcessing">Update</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { adminApi } from '@/api/endpoints/admin'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import ActivityFeed from '@/components/admin/ActivityFeed.vue'
import NotificationsPanel from '@/components/admin/NotificationsPanel.vue'
import SavedFilters from '@/components/admin/SavedFilters.vue'

const uiStore = useUIStore()
const activeTab = ref<'notes' | 'tasks' | 'activity' | 'notifications' | 'filters'>('notes')
const isLoading = ref(false)
const isProcessing = ref(false)

const tabs = [
  { id: 'notes', label: 'Order Notes' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'activity', label: 'Activity Logs' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'filters', label: 'Saved Filters' }
]

const noteForm = ref({
  orderId: '',
  note: '',
  isInternal: false
})

const taskForm = ref({
  orderId: '',
  assignedTo: '',
  taskType: '',
  priority: ''
})

const orderNotes = ref<any[]>([])
const selectedOrderId = ref<string | null>(null)
const activities = ref<any[]>([])
const notifications = ref<any[]>([])
const filters = ref<any[]>([])
const adminUsers = ref<any[]>([])

const editingNote = ref<any | null>(null)
const noteEditForm = ref({
  note: ''
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

const addOrderNote = async () => {
  if (!noteForm.value.orderId || !noteForm.value.note) {
    uiStore.showNotification('error', 'Please fill in all fields')
    return
  }
  
  isProcessing.value = true
  try {
    const response = await adminApi.addOrderNote(
      noteForm.value.orderId,
      noteForm.value.note,
      noteForm.value.isInternal || false
    )
    sendToTerminal('log', '[Advanced] Add note response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Note added successfully')
      noteForm.value.note = ''
      noteForm.value.isInternal = false
      if (selectedOrderId.value === noteForm.value.orderId) {
        await loadOrderNotes(noteForm.value.orderId)
      }
    } else {
      uiStore.showNotification('error', response.error || 'Failed to add note')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to add note')
    sendToTerminal('error', '[Advanced] Error adding note:', error)
  } finally {
    isProcessing.value = false
  }
}

const loadOrderNotes = async (orderId: string) => {
  try {
    const response = await adminApi.getOrderNotes(orderId)
    sendToTerminal('log', '[Advanced] Order notes response:', response)
    
    if (response.success && response.data) {
      orderNotes.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    sendToTerminal('error', '[Advanced] Error loading order notes:', error)
  }
}

const assignTask = async () => {
  if (!taskForm.value.orderId || !taskForm.value.assignedTo || !taskForm.value.taskType || !taskForm.value.priority) {
    uiStore.showNotification('error', 'Please fill in all required fields')
    return
  }
  
  isProcessing.value = true
  try {
    const response = await adminApi.assignOrderTask(taskForm.value.orderId, {
      assignedTo: taskForm.value.assignedTo,
      taskType: taskForm.value.taskType,
      priority: taskForm.value.priority
    })
    sendToTerminal('log', '[Advanced] Assign task response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Task assigned successfully')
      taskForm.value = { orderId: '', assignedTo: '', taskType: '', priority: '' }
    } else {
      uiStore.showNotification('error', response.error || 'Failed to assign task')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to assign task')
    sendToTerminal('error', '[Advanced] Error assigning task:', error)
  } finally {
    isProcessing.value = false
  }
}

const loadAdminUsers = async () => {
  isLoading.value = true
  try {
    // Backend expects uppercase role values (ADMIN, USER, VENDOR)
    const response = await adminApi.getUsers({ role: 'ADMIN', limit: 100 })
    sendToTerminal('log', '[Advanced] Admin users response:', response)
    
    if (response.success && response.data) {
      const data = response.data
      adminUsers.value = Array.isArray(data) 
        ? data 
        : (data.data || [])
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load admin users')
    }
  } catch (error) {
    sendToTerminal('error', '[Advanced] Error loading admin users:', error)
    uiStore.showNotification('error', 'Failed to load admin users')
  } finally {
    isLoading.value = false
  }
}

const editNote = (note: any) => {
  editingNote.value = note
  noteEditForm.value = {
    note: note.note || ''
  }
}

const updateNote = async () => {
  if (!editingNote.value) return
  
  isProcessing.value = true
  try {
    const response = await adminApi.updateOrderNote(editingNote.value.id, noteEditForm.value.note)
    sendToTerminal('log', '[Advanced] Update note response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Note updated successfully')
      editingNote.value = null
      if (selectedOrderId.value) {
        await loadOrderNotes(selectedOrderId.value)
      }
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update note')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update note')
    sendToTerminal('error', '[Advanced] Error updating note:', error)
  } finally {
    isProcessing.value = false
  }
}

const deleteNote = async (noteId: string) => {
  if (!confirm('Are you sure you want to delete this note?')) return
  
  isProcessing.value = true
  try {
    const response = await adminApi.deleteOrderNote(noteId)
    sendToTerminal('log', '[Advanced] Delete note response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Note deleted successfully')
      if (selectedOrderId.value) {
        await loadOrderNotes(selectedOrderId.value)
      }
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete note')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete note')
    sendToTerminal('error', '[Advanced] Error deleting note:', error)
  } finally {
    isProcessing.value = false
  }
}

// Watch for order ID changes to load notes
const watchOrderId = () => {
  if (noteForm.value.orderId && noteForm.value.orderId !== selectedOrderId.value) {
    selectedOrderId.value = noteForm.value.orderId
    loadOrderNotes(noteForm.value.orderId)
  }
}

onMounted(() => {
  loadAdminUsers()
})
</script>
