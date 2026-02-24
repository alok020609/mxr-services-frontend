<template>
  <div class="order-task-assignment">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Task Assignment</h3>
      <Button variant="primary" size="sm" @click="showAssignForm = !showAssignForm">
        <svg class="h-4 w-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Assign Task
      </Button>
    </div>

    <!-- Assign Task Form -->
    <div v-if="showAssignForm" class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
          <select
            v-model="newTask.assignedTo"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select admin user...</option>
            <option v-for="user in adminUsers" :key="user.id" :value="user.id">
              {{ user.name }} ({{ user.email }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
          <select
            v-model="newTask.taskType"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select task type...</option>
            <option value="REVIEW">Review</option>
            <option value="FULFILLMENT">Fulfillment</option>
            <option value="CUSTOMER_SERVICE">Customer Service</option>
            <option value="REFUND">Refund</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            v-model="newTask.priority"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select priority...</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
        <div class="flex justify-end space-x-2">
          <Button variant="secondary" size="sm" @click="cancelAssign">Cancel</Button>
          <Button variant="primary" size="sm" @click="assignTask" :loading="isAssigning">
            Assign Task
          </Button>
        </div>
      </div>
    </div>

    <!-- Tasks List -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner size="sm" />
      <span class="ml-2 text-gray-600">Loading tasks...</span>
    </div>

    <div v-else-if="tasks.length === 0" class="text-center py-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      <p>No tasks assigned yet</p>
      <p class="text-sm mt-1">Assign a task to track work on this order</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="p-4 bg-white rounded-lg border border-gray-200"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <span :class="getPriorityClass(task.priority)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ task.priority }}
              </span>
              <span :class="getTaskTypeClass(task.taskType)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ formatTaskType(task.taskType) }}
              </span>
              <span v-if="task.status" :class="getStatusClass(task.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ task.status }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-1">
              <span class="font-medium">Assigned to:</span> {{ task.assignedToName || task.assignedTo }}
            </p>
            <p class="text-xs text-gray-500">
              Created: {{ formatDate(task.createdAt) }}
            </p>
            <p v-if="task.completedAt" class="text-xs text-gray-500">
              Completed: {{ formatDate(task.completedAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { adminApi } from '@/api/endpoints/admin'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { formatDate } from '@/utils/formatters'
import type { OrderTask, User } from '@/api/types'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps<{
  orderId: string
}>()

const emit = defineEmits<{
  (e: 'task-assigned'): void
}>()

const uiStore = useUIStore()
const isLoading = ref(false)
const isAssigning = ref(false)
const tasks = ref<OrderTask[]>([])
const adminUsers = ref<User[]>([])
const showAssignForm = ref(false)

const newTask = ref({
  assignedTo: '',
  taskType: '',
  priority: ''
})

const loadTasks = async () => {
  if (!props.orderId) return
  
  // Note: API doesn't have a get tasks endpoint, so we'll need to handle this
  // For now, we'll just show the form. Tasks might be returned with order details.
  isLoading.value = false
}

const loadAdminUsers = async () => {
  try {
    const response = await adminApi.getUsers({ role: 'ADMIN', limit: 100 })
    if (response.success && response.data) {
      const data = response.data
      adminUsers.value = Array.isArray(data) 
        ? data 
        : (data.data || [])
    }
  } catch (error) {
    sendToTerminal('error', '[OrderTaskAssignment] Error loading admin users:', error)
  }
}

const assignTask = async () => {
  if (!newTask.value.assignedTo || !newTask.value.taskType || !newTask.value.priority) {
    uiStore.showNotification('error', 'Please fill in all fields')
    return
  }

  isAssigning.value = true
  try {
    const response = await adminApi.assignOrderTask(props.orderId, {
      assignedTo: newTask.value.assignedTo,
      taskType: newTask.value.taskType,
      priority: newTask.value.priority
    })
    sendToTerminal('log', '[OrderTaskAssignment] Assign task response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Task assigned successfully')
      newTask.value = { assignedTo: '', taskType: '', priority: '' }
      showAssignForm.value = false
      await loadTasks()
      emit('task-assigned')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to assign task')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to assign task')
    sendToTerminal('error', '[OrderTaskAssignment] Error assigning task:', error)
  } finally {
    isAssigning.value = false
  }
}

const cancelAssign = () => {
  newTask.value = { assignedTo: '', taskType: '', priority: '' }
  showAssignForm.value = false
}

const getPriorityClass = (priority: string) => {
  const classes: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getTaskTypeClass = (taskType: string) => {
  const classes: Record<string, string> = {
    REVIEW: 'bg-purple-100 text-purple-800',
    FULFILLMENT: 'bg-green-100 text-green-800',
    CUSTOMER_SERVICE: 'bg-blue-100 text-blue-800',
    REFUND: 'bg-yellow-100 text-yellow-800',
    CUSTOM: 'bg-gray-100 text-gray-800'
  }
  return classes[taskType] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatTaskType = (taskType: string) => {
  return taskType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

watch(() => props.orderId, (newId) => {
  if (newId) {
    loadTasks()
  }
}, { immediate: true })

onMounted(() => {
  loadAdminUsers()
  if (props.orderId) {
    loadTasks()
  }
})
</script>

<style scoped>
.order-task-assignment {
  @apply space-y-4;
}
</style>

