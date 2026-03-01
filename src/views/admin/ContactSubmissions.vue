<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 flex items-center">
            <svg class="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Submissions
          </h1>
          <p class="text-primary-100">View and manage contact form submissions</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            @change="loadSubmissions"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option :value="undefined">All</option>
            <option value="NEW">New</option>
            <option value="WAITING_FOR_CONFIRMATION">Waiting for confirmation</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Source</label>
          <select
            v-model="filters.hasUser"
            @change="loadSubmissions"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option :value="undefined">All</option>
            <option :value="true">From logged-in users</option>
            <option :value="false">Guests only</option>
          </select>
        </div>
        <div class="md:col-span-2" />
      </div>
    </div>

    <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
      <LoadingSpinner size="md" />
      <span class="ml-3 text-gray-600">Loading submissions...</span>
    </div>

    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <p class="font-semibold text-red-800">Error</p>
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <DataTable
        :columns="columns"
        :data="submissions"
        :actions="true"
        row-key="id"
      >
        <template #cell-name="{ value }">
          <span class="font-medium text-gray-900">{{ value || '—' }}</span>
        </template>
        <template #cell-email="{ value }">
          <span class="text-gray-700">{{ value || '—' }}</span>
        </template>
        <template #cell-phone="{ value }">
          <span class="text-gray-600">{{ value || '—' }}</span>
        </template>
        <template #cell-message="{ value }">
          <span class="text-gray-600 max-w-xs truncate block" :title="value">{{ value ? (value.length > 60 ? value.slice(0, 60) + '…' : value) : '—' }}</span>
        </template>
        <template #cell-freeSiteVisit="{ value }">
          <span :class="value ? 'text-green-600 font-medium' : 'text-gray-400'">{{ value ? 'Yes' : 'No' }}</span>
        </template>
        <template #cell-status="{ value }">
          <span :class="statusClass(value)" class="px-2 py-1 rounded-full text-xs font-semibold">{{ formatStatus(value) }}</span>
        </template>
        <template #cell-createdAt="{ value }">
          <span class="text-sm text-gray-600">{{ formatDate(value) }}</span>
        </template>
        <template #cell-linkedUser="{ row }">
          <span v-if="row.user" class="text-sm text-gray-700">{{ linkedUserName(row.user) }}</span>
          <span v-else class="text-gray-400">—</span>
        </template>
        <template #actions="{ row }">
          <router-link
            :to="{ name: 'AdminContactSubmissionDetail', params: { id: row.id }, state: { submission: row } }"
            class="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
          >
            View
          </router-link>
        </template>
      </DataTable>

      <div v-if="submissions.length === 0 && !isLoading" class="text-center py-12 text-gray-500">
        No contact submissions found.
      </div>

      <div v-if="pagination && pagination.pages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Showing page {{ pagination.page }} of {{ pagination.pages }} ({{ pagination.total }} total)
        </p>
        <div class="flex gap-2">
          <button
            :disabled="pagination.page <= 1"
            @click="goToPage(pagination.page - 1)"
            class="px-3 py-1 rounded border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            :disabled="pagination.page >= pagination.pages"
            @click="goToPage(pagination.page + 1)"
            class="px-3 py-1 rounded border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { adminContactApi } from '@/api/endpoints/admin-contact'
import type { ContactSubmission, ContactSubmissionStatus, ContactSubmissionUser } from '@/api/endpoints/admin-contact'

const submissions = ref<ContactSubmission[]>([])
const pagination = ref<{ page: number; limit: number; total: number; pages: number } | null>(null)
const isLoading = ref(false)
const error = ref('')

const filters = reactive<{ status?: ContactSubmissionStatus; hasUser?: boolean }>({})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'message', label: 'Message' },
  { key: 'freeSiteVisit', label: 'Free visit' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created' },
  { key: 'linkedUser', label: 'Linked user' }
]

function formatStatus(s: ContactSubmissionStatus | undefined): string {
  if (!s) return '—'
  const map: Record<string, string> = {
    NEW: 'New',
    WAITING_FOR_CONFIRMATION: 'Waiting',
    DONE: 'Done'
  }
  return map[s] || s
}

function statusClass(s: ContactSubmissionStatus | undefined): string {
  if (!s) return 'bg-gray-100 text-gray-600'
  const map: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800',
    WAITING_FOR_CONFIRMATION: 'bg-yellow-100 text-yellow-800',
    DONE: 'bg-green-100 text-green-800'
  }
  return map[s] || 'bg-gray-100 text-gray-600'
}

function linkedUserName(user: ContactSubmissionUser): string {
  const parts = [user.firstName, user.lastName].filter(Boolean)
  if (parts.length) return `${parts.join(' ')} (${user.email})`
  return user.email
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}

function goToPage(page: number) {
  loadSubmissions(page)
}

async function loadSubmissions(page = 1) {
  isLoading.value = true
  error.value = ''
  try {
    const res = await adminContactApi.getContactSubmissions({
      page,
      limit: 20,
      status: filters.status,
      hasUser: filters.hasUser
    })
    submissions.value = res.data ?? []
    pagination.value = res.pagination ?? null
  } catch (e: any) {
    submissions.value = []
    pagination.value = null
    error.value = e?.response?.data?.error || e?.message || 'Failed to load submissions'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => loadSubmissions())
</script>
