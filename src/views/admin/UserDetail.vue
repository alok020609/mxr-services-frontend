<template>
  <AdminLayout>
    <div>
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <router-link to="/admin/users" class="text-gray-600 hover:text-gray-800">
            ← Back to Users
          </router-link>
          <h1 class="text-3xl font-bold">User Details</h1>
        </div>
        <Button variant="primary" @click="showEditModal = true" v-if="user">
          Edit User
        </Button>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <Button @click="loadUser" variant="primary">Retry</Button>
      </div>
      
      <div v-else-if="user" class="max-w-4xl space-y-6">
        <!-- User Information -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">User Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-600">Name</label>
              <p class="font-semibold">{{ user.name }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Email</label>
              <p class="font-semibold">{{ user.email }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Role</label>
              <p class="font-semibold">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs uppercase">
                  {{ user.role }}
                </span>
              </p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Status</label>
              <p class="font-semibold">
                <span :class="user.isActive ? 'text-green-600' : 'text-red-600'">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Email Verified</label>
              <p class="font-semibold">
                <span :class="user.isVerified ? 'text-green-600' : 'text-red-600'">
                  {{ user.isVerified ? 'Verified' : 'Not Verified' }}
                </span>
              </p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Created At</label>
              <p class="font-semibold">{{ formatDate(user.createdAt) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Actions</h2>
          <div class="flex flex-wrap gap-4">
            <Button 
              v-if="!user.isVerified"
              @click="verifyUser"
              variant="secondary"
            >
              Verify User
            </Button>
            <Button 
              @click="toggleActivation"
              :variant="user.isActive ? 'secondary' : 'primary'"
            >
              {{ user.isActive ? 'Deactivate' : 'Activate' }} User
            </Button>
            <Button 
              @click="showResetPasswordModal = true"
              variant="secondary"
            >
              Reset Password
            </Button>
            <Button 
              @click="changeRole"
              variant="secondary"
            >
              Change Role
            </Button>
            <Button 
              @click="deleteUser"
              variant="danger"
            >
              Delete User
            </Button>
          </div>
        </div>
        
        <!-- CRM Section -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Customer Relationship Management</h2>
          
          <!-- Tabs -->
          <div class="border-b mb-6">
            <button
              v-for="tab in crmTabs"
              :key="tab.id"
              @click="activeCrmTab = tab.id"
              :class="[
                'px-4 py-2 font-medium border-b-2 transition-colors',
                activeCrmTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <!-- Tab Content -->
          <div v-if="activeCrmTab === '360'">
            <Customer360 :user-id="userId" />
          </div>
          <div v-if="activeCrmTab === 'rfm'">
            <RFMAnalysis :user-id="userId" />
          </div>
          <div v-if="activeCrmTab === 'tags'">
            <CustomerTags :user-id="userId" />
          </div>
          <div v-if="activeCrmTab === 'notes'">
            <CustomerNotes :user-id="userId" />
          </div>
        </div>
      </div>
      
      <!-- Edit User Modal -->
      <div
        v-if="showEditModal && user"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showEditModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">Edit User</h2>
          <UserForm
            :user="user"
            @submit="handleUpdate"
            @cancel="showEditModal = false"
          />
        </div>
      </div>
      
      <!-- Reset Password Modal -->
      <div
        v-if="showResetPasswordModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showResetPasswordModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">Reset Password</h2>
          <p class="mb-4 text-gray-600">A new password will be generated and sent to the user's email.</p>
          <div class="flex justify-end space-x-4">
            <Button variant="secondary" @click="showResetPasswordModal = false">Cancel</Button>
            <Button variant="primary" @click="resetPassword" :loading="isProcessing">
              Reset Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminApi } from '@/api/endpoints/admin'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { normalizeUser } from '@/utils/dataNormalizer'
import AdminLayout from './AdminLayout.vue'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import UserForm from '@/components/admin/UserForm.vue'
import Customer360 from '@/components/crm/Customer360.vue'
import RFMAnalysis from '@/components/crm/RFMAnalysis.vue'
import CustomerTags from '@/components/crm/CustomerTags.vue'
import CustomerNotes from '@/components/crm/CustomerNotes.vue'
import type { User } from '@/api/types'

const route = useRoute()
const router = useRouter()
const uiStore = useUIStore()
const userId = route.params.id as string

const isLoading = ref(false)
const isProcessing = ref(false)
const user = ref<User | null>(null)
const error = ref<string | null>(null)
const showEditModal = ref(false)
const showResetPasswordModal = ref(false)
const activeCrmTab = ref<'360' | 'rfm' | 'tags' | 'notes'>('360')

const crmTabs = [
  { id: '360', label: 'Customer 360' },
  { id: 'rfm', label: 'RFM Analysis' },
  { id: 'tags', label: 'Tags' },
  { id: 'notes', label: 'Notes' }
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadUser = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await adminApi.getUser(userId)
    sendToTerminal('log', '[UserDetail] API Response:', response)
    
    if (response.success && response.data) {
      user.value = normalizeUser(response.data)
      sendToTerminal('log', '[UserDetail] Normalized user:', user.value)
    } else {
      error.value = response.error || 'Failed to load user'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load user'
    uiStore.showNotification('error', error.value)
    sendToTerminal('error', '[UserDetail] Error loading user:', err)
  } finally {
    isLoading.value = false
  }
}

const handleUpdate = async (userData: any) => {
  if (!user.value) return
  
  isProcessing.value = true
  try {
    const { password, ...updateData } = userData
    const response = await adminApi.updateUser(user.value.id, updateData)
    sendToTerminal('log', '[UserDetail] Update response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'User updated successfully')
      showEditModal.value = false
      await loadUser()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update user')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to update user')
    sendToTerminal('error', '[UserDetail] Error updating user:', err)
  } finally {
    isProcessing.value = false
  }
}

const verifyUser = async () => {
  if (!user.value) return
  
  try {
    const response = await adminApi.verifyUser(user.value.id)
    sendToTerminal('log', '[UserDetail] Verify response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'User verified successfully')
      await loadUser()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to verify user')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to verify user')
    sendToTerminal('error', '[UserDetail] Error verifying user:', err)
  }
}

const toggleActivation = async () => {
  if (!user.value) return
  
  const newActiveState = !user.value.isActive
  try {
    const response = await adminApi.activateUser(user.value.id, newActiveState)
    sendToTerminal('log', '[UserDetail] Activate response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', `User ${newActiveState ? 'activated' : 'deactivated'} successfully`)
      await loadUser()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update user status')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to update user status')
    sendToTerminal('error', '[UserDetail] Error updating user status:', err)
  }
}

const changeRole = async () => {
  if (!user.value) return
  
  const newRole = prompt('Enter new role (user/admin/vendor):', user.value.role)
  if (!newRole || newRole === user.value.role) return
  
  try {
    const response = await adminApi.changeUserRole(user.value.id, newRole)
    sendToTerminal('log', '[UserDetail] Change role response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'User role updated successfully')
      await loadUser()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update user role')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to update user role')
    sendToTerminal('error', '[UserDetail] Error changing user role:', err)
  }
}

const resetPassword = async () => {
  if (!user.value) return
  
  isProcessing.value = true
  try {
    const response = await adminApi.resetUserPassword(user.value.id)
    sendToTerminal('log', '[UserDetail] Reset password response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Password reset email sent successfully')
      showResetPasswordModal.value = false
    } else {
      uiStore.showNotification('error', response.error || 'Failed to reset password')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to reset password')
    sendToTerminal('error', '[UserDetail] Error resetting password:', err)
  } finally {
    isProcessing.value = false
  }
}

const deleteUser = async () => {
  if (!user.value) return
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
  
  isProcessing.value = true
  try {
    const response = await adminApi.deleteUser(user.value.id)
    sendToTerminal('log', '[UserDetail] Delete response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'User deleted successfully')
      router.push('/admin/users')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete user')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to delete user')
    sendToTerminal('error', '[UserDetail] Error deleting user:', err)
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  loadUser()
})
</script>

