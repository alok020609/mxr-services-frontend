<template>
  <div class="space-y-6">
    <!-- Modern Header Section -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 flex items-center">
            <svg class="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Management
          </h1>
          <p class="text-primary-100">Manage all users, roles, and permissions</p>
        </div>
        <div class="flex items-center space-x-3">
          <Button 
            variant="secondary" 
            @click="showExportModal = true" 
            :disabled="users.length === 0"
            class="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </Button>
          <Button 
            variant="primary" 
            @click="showCreateModal = true"
            class="bg-white text-primary-600 hover:bg-primary-50 shadow-lg"
          >
            <svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ pagination?.total || users.length }}</p>
          </div>
          <div class="bg-blue-100 rounded-full p-3">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Active Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeUsersCount }}</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Verified Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ verifiedUsersCount }}</p>
          </div>
          <div class="bg-purple-100 rounded-full p-3">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Admins</p>
            <p class="text-2xl font-bold text-gray-900">{{ adminUsersCount }}</p>
          </div>
          <div class="bg-orange-100 rounded-full p-3">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filters and Search Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, email, or phone..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              @input="handleSearch"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Role Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select 
            v-model="filters.role" 
            @change="loadUsers" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>
        
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            v-model="filters.status" 
            @change="loadUsers" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>
      
      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
        <span class="text-sm text-gray-600 font-medium">Active filters:</span>
        <span v-if="filters.role" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
          Role: {{ filters.role }}
          <button @click="clearFilter('role')" class="hover:text-blue-900 font-bold">×</button>
        </span>
        <span v-if="filters.status" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
          Status: {{ filters.status }}
          <button @click="clearFilter('status')" class="hover:text-green-900 font-bold">×</button>
        </span>
        <span v-if="searchQuery" class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2">
          Search: {{ searchQuery }}
          <button @click="clearSearch" class="hover:text-purple-900 font-bold">×</button>
        </span>
        <button @click="clearAllFilters" class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors">
          Clear All
        </button>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
      <LoadingSpinner size="md" />
      <span class="ml-3 text-gray-600">Loading users...</span>
    </div>
    
    <!-- Error Message -->
    <div v-if="lastError && !isLoading" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-semibold text-red-800">Error Loading Users</p>
          <p class="text-sm text-red-600">{{ lastError }}</p>
        </div>
      </div>
    </div>
    
    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <DataTable
        :columns="columns"
        :data="users"
        :actions="true"
        :row-key="'id'"
      >
        <template #cell-name="{ value, row }">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mr-3 shadow-md">
              <span class="text-white font-bold text-lg">{{ value?.charAt(0)?.toUpperCase() || 'U' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-gray-900">{{ value || 'N/A' }}</div>
              <div class="text-sm text-gray-500 truncate">{{ row.email }}</div>
              <div v-if="row._count" class="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span v-if="row._count.orders !== undefined" title="Orders" class="flex items-center hover:text-gray-600">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {{ row._count.orders }}
                </span>
                <span v-if="row._count.reviews !== undefined" title="Reviews" class="flex items-center hover:text-gray-600">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {{ row._count.reviews }}
                </span>
                <span v-if="row._count.addresses !== undefined" title="Addresses" class="flex items-center hover:text-gray-600">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ row._count.addresses }}
                </span>
                <span v-if="row._count.wishlist !== undefined" title="Wishlist Items" class="flex items-center hover:text-gray-600">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ row._count.wishlist }}
                </span>
              </div>
            </div>
          </div>
        </template>
        
        <template #cell-role="{ value }">
          <span :class="getRoleClass(value)" class="px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {{ value?.toUpperCase() || 'USER' }}
          </span>
        </template>
        
        <template #cell-isVerified="{ value, row }">
          <button
            @click="toggleVerification(row)"
            :class="value ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300' : 'bg-red-100 text-red-800 hover:bg-red-200 border-red-300'"
            class="px-3 py-1 rounded-full text-xs font-semibold transition-all border shadow-sm"
            :title="value ? 'Click to unverify' : 'Click to verify'"
          >
            {{ value ? '✓ Verified' : '✗ Unverified' }}
          </button>
        </template>
        
        <template #cell-isActive="{ value, row }">
          <button
            @click="toggleActivation(row)"
            :class="value ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300'"
            class="px-3 py-1 rounded-full text-xs font-semibold transition-all border shadow-sm"
            :title="value ? 'Click to deactivate' : 'Click to activate'"
          >
            {{ value ? '✓ Active' : '✗ Inactive' }}
          </button>
        </template>
        
        <template #cell-createdAt="{ value }">
          <span class="text-sm text-gray-600">{{ formatDate(value) }}</span>
        </template>
        
        <template #actions="{ row }">
          <div class="flex items-center space-x-2">
            <router-link 
              :to="`/admin/users/${row.id}`" 
              class="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
              title="View Details"
            >
              View
            </router-link>
            <button 
              @click="editUser(row)" 
              class="px-3 py-1 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              title="Edit User"
            >
              Edit
            </button>
            <div class="relative group">
              <button 
                class="px-3 py-1 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                title="More Actions"
              >
                ⋮
              </button>
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  v-if="row.role !== 'admin'"
                  @click="showRoleChangeModal(row)"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Change Role
                </button>
                <button
                  @click="showResetPasswordModal(row)"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Reset Password
                </button>
                <button
                  @click="deleteUser(row.id)"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </template>
      </DataTable>
      
      <!-- Empty State -->
      <div v-if="users.length === 0 && !isLoading" class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="mt-4 text-gray-500 font-medium text-lg">No users found</p>
        <p class="text-sm text-gray-400 mt-1">
          <span v-if="hasActiveFilters">Try adjusting your filters</span>
          <span v-else>Get started by creating a new user</span>
        </p>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination && pagination.pages > 1" class="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Showing <span class="font-semibold">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span> to 
          <span class="font-semibold">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> of 
          <span class="font-semibold">{{ pagination.total }}</span> users
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="secondary"
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-4"
          >
            Previous
          </Button>
          <span class="text-sm text-gray-600 px-4">
            Page <span class="font-semibold">{{ pagination.page }}</span> of <span class="font-semibold">{{ pagination.pages }}</span>
          </span>
          <Button
            variant="secondary"
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.pages"
            class="px-4"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Create/Edit User Modal -->
    <div
      v-if="showCreateModal || editingUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all">
        <div class="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ editingUser ? 'Edit User' : 'Create New User' }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <UserForm
          :user="editingUser"
          @submit="handleUserSubmit"
          @cancel="closeModal"
        />
      </div>
    </div>
    
    <!-- Role Change Modal -->
    <div
      v-if="roleChangeUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="roleChangeUser = null"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Change User Role</h2>
        <p class="text-gray-600 mb-6">Change role for <strong class="text-gray-900">{{ roleChangeUser.name || roleChangeUser.email }}</strong></p>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">New Role</label>
          <select v-model="newRole" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>
        <div class="flex justify-end space-x-4">
          <Button variant="secondary" @click="roleChangeUser = null">Cancel</Button>
          <Button variant="primary" @click="confirmRoleChange" :loading="isProcessing">
            Change Role
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Reset Password Modal -->
    <div
      v-if="resetPasswordUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="resetPasswordUser = null"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Reset User Password</h2>
        <p class="text-gray-600 mb-6">
          Send a password reset email to <strong class="text-gray-900">{{ resetPasswordUser.email }}</strong>?
        </p>
        <div class="flex justify-end space-x-4">
          <Button variant="secondary" @click="resetPasswordUser = null">Cancel</Button>
          <Button variant="primary" @click="confirmResetPassword" :loading="isProcessing">
            Send Reset Email
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Export Modal -->
    <div
      v-if="showExportModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="showExportModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Export Users</h2>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <select v-model="exportFormat" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xlsx">Excel (XLSX)</option>
          </select>
        </div>
        <div class="flex justify-end space-x-4">
          <Button variant="secondary" @click="showExportModal = false">Cancel</Button>
          <Button variant="primary" @click="handleExport" :loading="isProcessing">
            Export
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { adminApi } from '@/api/endpoints/admin'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import { normalizeUsers, extractPaginatedData } from '@/utils/dataNormalizer'
import { formatDate } from '@/utils/formatters'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import UserForm from '@/components/admin/UserForm.vue'
import type { User } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const isProcessing = ref(false)
const users = ref<User[]>([])
const showCreateModal = ref(false)
const editingUser = ref<User | null>(null)
const roleChangeUser = ref<User | null>(null)
const resetPasswordUser = ref<User | null>(null)
const showExportModal = ref(false)
const newRole = ref('')
const exportFormat = ref('csv')
const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)
const pagination = ref<any>(null)
const showDebug = ref(false)
const lastApiResponse = ref<any>(null)
const lastError = ref<string | null>(null)

const filters = ref({
  role: '',
  status: ''
})

const columns = [
  { key: 'name', label: 'User', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'isVerified', label: 'Verified', sortable: true },
  { key: 'isActive', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Joined', sortable: true }
]

const hasActiveFilters = computed(() => {
  return !!filters.value.role || !!filters.value.status || !!searchQuery.value
})

const activeUsersCount = computed(() => {
  return users.value.filter(u => u.isActive).length
})

const verifiedUsersCount = computed(() => {
  return users.value.filter(u => u.isVerified).length
})

const adminUsersCount = computed(() => {
  return users.value.filter(u => u.role === 'admin').length
})

const getRoleClass = (role: string) => {
  const classes: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800 border-purple-300',
    vendor: 'bg-blue-100 text-blue-800 border-blue-300',
    user: 'bg-gray-100 text-gray-800 border-gray-300'
  }
  return classes[role?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300'
}

onMounted(async () => {
  sendToTerminal('log', '[Users] Component mounted, loading users...')
  await loadUsers()
})

const loadUsers = async () => {
  isLoading.value = true
  lastError.value = null
  lastApiResponse.value = null
  
  try {
    const params: any = {
      page: pagination.value?.page || 1,
      limit: 20
    }
    
    if (filters.value.role) {
      // Backend expects uppercase role values (ADMIN, USER, VENDOR)
      params.role = filters.value.role.toUpperCase()
    }
    
    if (filters.value.status) {
      if (filters.value.status === 'active') {
        params.isActive = true
      } else if (filters.value.status === 'inactive') {
        params.isActive = false
      } else if (filters.value.status === 'verified') {
        params.emailVerified = true
      } else if (filters.value.status === 'unverified') {
        params.emailVerified = false
      }
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    sendToTerminal('log', '[Users] Loading users with params:', params)
    
    const response = await adminApi.getUsers(params)
    lastApiResponse.value = response
    
    sendToTerminal('log', '[Users] API Response received:', {
      success: response?.success,
      dataType: typeof response?.data,
      isArray: Array.isArray(response?.data),
      dataLength: Array.isArray(response?.data) ? response.data.length : 'N/A'
    })
    
    if (response && response.success !== false) {
      let usersData: any[] = []
      
      if (Array.isArray(response.data)) {
        usersData = response.data
        sendToTerminal('log', '[Users] Data is direct array, length:', usersData.length)
      } else if (response.data && typeof response.data === 'object') {
        sendToTerminal('log', '[Users] Data is object, keys:', Object.keys(response.data))
        
        if (Array.isArray(response.data.data)) {
          usersData = response.data.data
          pagination.value = response.data.pagination || response.pagination
          sendToTerminal('log', '[Users] Data is nested in data.data, length:', usersData.length)
        } else if (Array.isArray(response.data.items)) {
          usersData = response.data.items
          pagination.value = response.data.pagination
          sendToTerminal('log', '[Users] Data is in data.items, length:', usersData.length)
        } else if (Array.isArray(response.data.users)) {
          usersData = response.data.users
          pagination.value = response.data.pagination
          sendToTerminal('log', '[Users] Data is in data.users, length:', usersData.length)
        } else {
          const extracted = extractPaginatedData<User>(response)
          usersData = extracted.data || []
          pagination.value = extracted.pagination || response.pagination
          sendToTerminal('log', '[Users] Using extractPaginatedData, length:', usersData.length)
        }
      } else {
        sendToTerminal('warn', '[Users] Unexpected response.data format:', response.data)
      }
      
      if (usersData && usersData.length > 0) {
        const normalized = normalizeUsers(usersData)
        users.value = [...normalized]
        sendToTerminal('log', '[Users] Users loaded successfully, count:', users.value.length)
      } else {
        users.value = []
        sendToTerminal('warn', '[Users] No users data found in response')
      }
      
      if (response.pagination) {
        pagination.value = response.pagination
      }
    } else {
      const errorMsg = response?.error || 'Failed to load users'
      lastError.value = errorMsg
      users.value = []
      uiStore.showNotification('error', errorMsg)
      sendToTerminal('error', '[Users] Response success is false:', response)
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Failed to load users'
    lastError.value = errorMsg
    uiStore.showNotification('error', errorMsg)
    sendToTerminal('error', '[Users] Exception loading users:', error)
    users.value = []
  } finally {
    isLoading.value = false
    sendToTerminal('log', '[Users] Load complete:', {
      isLoading: isLoading.value,
      usersLength: users.value.length,
      pagination: pagination.value
    })
  }
}

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    loadUsers()
  }, 500)
}

const clearSearch = () => {
  searchQuery.value = ''
  loadUsers()
}

const clearFilter = (filterName: keyof typeof filters.value) => {
  filters.value[filterName] = ''
  loadUsers()
}

const clearAllFilters = () => {
  filters.value.role = ''
  filters.value.status = ''
  searchQuery.value = ''
  loadUsers()
}

const changePage = (page: number) => {
  if (pagination.value) {
    pagination.value.page = page
    loadUsers()
  }
}

const editUser = (user: User) => {
  editingUser.value = user
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
}

const handleUserSubmit = async (userData: any) => {
  isProcessing.value = true
  try {
    let response
    if (editingUser.value) {
      // For updates, remove password if empty and ensure emailVerified is used
      const { password, ...updateData } = userData
      // Don't send password if it's empty (user didn't want to change it)
      if (!password || password.trim() === '') {
        delete updateData.password
      } else {
        updateData.password = password
      }
      // Ensure emailVerified is set correctly (backend uses emailVerified, not isVerified)
      if (updateData.emailVerified === undefined && updateData.isVerified !== undefined) {
        updateData.emailVerified = updateData.isVerified
        delete updateData.isVerified
      }
      response = await adminApi.updateUser(editingUser.value.id, updateData)
      sendToTerminal('log', '[Users] Update response:', response)
    } else {
      response = await adminApi.createUser(userData)
      sendToTerminal('log', '[Users] Create response:', response)
    }
    
    if (response.success) {
      uiStore.showNotification('success', editingUser.value ? 'User updated successfully' : 'User created successfully')
      closeModal()
      await loadUsers()
    } else {
      // Handle field-level validation errors
      if (response.errors && Array.isArray(response.errors)) {
        const errorMessages = response.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ')
        uiStore.showNotification('error', `Validation errors: ${errorMessages}`)
      } else {
        uiStore.showNotification('error', response.error || 'Failed to save user')
      }
    }
  } catch (error: any) {
    // Handle field-level validation errors from catch block
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const errorMessages = error.response.data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ')
      uiStore.showNotification('error', `Validation errors: ${errorMessages}`)
    } else {
      uiStore.showNotification('error', error.message || 'Failed to save user')
    }
    sendToTerminal('error', '[Users] Error saving user:', error)
  } finally {
    isProcessing.value = false
  }
}

const deleteUser = async (id: string) => {
  const user = users.value.find(u => u.id === id)
  if (!confirm(`Are you sure you want to delete user ${user?.name || user?.email}? This action cannot be undone.`)) return
  
  isProcessing.value = true
  try {
    const response = await adminApi.deleteUser(id)
    sendToTerminal('log', '[Users] Delete response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'User deleted successfully')
      await loadUsers()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete user')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete user')
    sendToTerminal('error', '[Users] Error deleting user:', error)
  } finally {
    isProcessing.value = false
  }
}

const toggleVerification = async (user: User) => {
  if (user.isVerified) {
    uiStore.showNotification('info', 'Unverification is not supported via API')
    return
  }
  
  isProcessing.value = true
  try {
    const response = await adminApi.verifyUser(user.id)
    sendToTerminal('log', '[Users] Verify response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'User verified successfully')
      await loadUsers()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to verify user')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to verify user')
    sendToTerminal('error', '[Users] Error verifying user:', error)
  } finally {
    isProcessing.value = false
  }
}

const toggleActivation = async (user: User) => {
  const newActiveState = !user.isActive
  isProcessing.value = true
  try {
    const response = await adminApi.activateUser(user.id, newActiveState)
    sendToTerminal('log', '[Users] Activate response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', `User ${newActiveState ? 'activated' : 'deactivated'} successfully`)
      await loadUsers()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update user status')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update user status')
    sendToTerminal('error', '[Users] Error updating user status:', error)
  } finally {
    isProcessing.value = false
  }
}

const showRoleChangeModal = (user: User) => {
  roleChangeUser.value = user
  newRole.value = user.role
}

const confirmRoleChange = async () => {
  if (!roleChangeUser.value || !newRole.value || roleChangeUser.value.role === newRole.value) {
    roleChangeUser.value = null
    return
  }
  
  isProcessing.value = true
  try {
    // Backend expects uppercase role values
    const response = await adminApi.changeUserRole(roleChangeUser.value.id, newRole.value.toUpperCase())
    sendToTerminal('log', '[Users] Change role response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'User role updated successfully')
      roleChangeUser.value = null
      await loadUsers()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update user role')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to update user role')
    sendToTerminal('error', '[Users] Error changing user role:', error)
  } finally {
    isProcessing.value = false
  }
}

const showResetPasswordModal = (user: User) => {
  resetPasswordUser.value = user
}

const confirmResetPassword = async () => {
  if (!resetPasswordUser.value) return
  
  isProcessing.value = true
  try {
    const response = await adminApi.resetUserPassword(resetPasswordUser.value.id)
    sendToTerminal('log', '[Users] Reset password response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Password reset email sent successfully')
      resetPasswordUser.value = null
    } else {
      uiStore.showNotification('error', response.error || 'Failed to send password reset email')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to send password reset email')
    sendToTerminal('error', '[Users] Error resetting password:', error)
  } finally {
    isProcessing.value = false
  }
}

const handleExport = async () => {
  isProcessing.value = true
  try {
    const exportData = users.value.map(user => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Verified: user.isVerified ? 'Yes' : 'No',
      Active: user.isActive ? 'Yes' : 'No',
      'Created At': formatDate(user.createdAt)
    }))
    
    if (exportFormat.value === 'json') {
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } else if (exportFormat.value === 'csv') {
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n')
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } else {
      uiStore.showNotification('info', 'XLSX export requires additional library. Exporting as CSV instead.')
      exportFormat.value = 'csv'
      handleExport()
      return
    }
    
    uiStore.showNotification('success', 'Users exported successfully')
    showExportModal.value = false
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to export users')
    sendToTerminal('error', '[Users] Error exporting users:', error)
  } finally {
    isProcessing.value = false
  }
}
</script>
