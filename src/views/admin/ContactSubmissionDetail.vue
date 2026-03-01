<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <router-link
        to="/admin/contact-submissions"
        class="text-gray-600 hover:text-gray-900 flex items-center gap-1"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to list
      </router-link>
    </div>

    <div v-if="notFound" class="bg-amber-50 border border-amber-200 rounded-lg p-6">
      <p class="font-medium text-amber-800">Submission not found.</p>
      <router-link to="/admin/contact-submissions" class="mt-2 inline-block text-amber-700 underline">Return to list</router-link>
    </div>

    <template v-else-if="submission">
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
        <h1 class="text-2xl font-bold">Contact submission</h1>
        <p class="text-primary-100">Submitted {{ formatDateTime(submission.createdAt) }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact details (read-only)</h2>
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-gray-500">Name</dt>
              <dd class="font-medium text-gray-900">{{ submission.name }}</dd>
            </div>
            <div>
              <dt class="text-gray-500">Email</dt>
              <dd class="text-gray-900">{{ submission.email }}</dd>
            </div>
            <div>
              <dt class="text-gray-500">Phone</dt>
              <dd class="text-gray-900">{{ submission.phone || '—' }}</dd>
            </div>
            <div>
              <dt class="text-gray-500">Free site visit</dt>
              <dd class="text-gray-900">{{ submission.freeSiteVisit ? 'Yes' : 'No' }}</dd>
            </div>
            <div v-if="submission.user">
              <dt class="text-gray-500">Linked user</dt>
              <dd class="text-gray-900">{{ submission.user.firstName }} {{ submission.user.lastName }} ({{ submission.user.email }})</dd>
            </div>
            <div>
              <dt class="text-gray-500">Message</dt>
              <dd class="text-gray-900 whitespace-pre-wrap">{{ submission.message }}</dd>
            </div>
          </dl>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Admin follow-up</h2>
          <form @submit.prevent="save" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="form.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="NEW">New</option>
                <option value="WAITING_FOR_CONFIRMATION">Waiting for confirmation</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Visit address</label>
              <input v-model="form.visitAddress" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Address for site visit" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Proposed quote amount</label>
                <input v-model.number="form.proposedQuoteAmount" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="0.00" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Quote sent at</label>
                <input v-model="form.quoteSentAt" type="datetime-local" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Visit scheduled at</label>
              <input v-model="form.visitScheduledAt" type="datetime-local" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Proposed quote description</label>
              <textarea v-model="form.proposedQuoteDescription" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Description of the quote" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Admin notes</label>
              <textarea v-model="form.adminNotes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Internal notes" />
            </div>
            <p v-if="saveError" class="text-sm text-red-600">{{ saveError }}</p>
            <p v-if="saveSuccess" class="text-sm text-green-600">Saved.</p>
            <div class="flex gap-2">
              <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50">
                {{ isSaving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>

    <div v-else-if="!loading" class="bg-amber-50 border border-amber-200 rounded-lg p-6">
      <p class="font-medium text-amber-800">Submission not found.</p>
      <router-link to="/admin/contact-submissions" class="mt-2 inline-block text-amber-700 underline">Return to list</router-link>
    </div>

    <div v-else class="flex items-center justify-center py-12">
      <LoadingSpinner size="md" />
      <span class="ml-3 text-gray-600">Loading...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { adminContactApi } from '@/api/endpoints/admin-contact'
import type { ContactSubmission, ContactSubmissionUpdatePayload } from '@/api/endpoints/admin-contact'

const route = useRoute()
const submission = ref<ContactSubmission | null>(null)
const loading = ref(true)
const notFound = ref(false)
const isSaving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

const form = reactive<ContactSubmissionUpdatePayload & { status: string }>({
  status: 'NEW',
  visitAddress: null,
  proposedQuoteAmount: null,
  proposedQuoteDescription: null,
  visitScheduledAt: null,
  quoteSentAt: null,
  adminNotes: null
})

const id = computed(() => route.params.id as string)

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

function toDateTimeLocal(iso: string | null | undefined): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return ''
  }
}

function fromDateTimeLocal(v: string): string | null {
  if (!v || !v.trim()) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

function syncFormToSubmission(s: ContactSubmission) {
  form.status = s.status
  form.visitAddress = s.visitAddress ?? null
  form.proposedQuoteAmount = s.proposedQuoteAmount ?? null
  form.proposedQuoteDescription = s.proposedQuoteDescription ?? null
  form.visitScheduledAt = toDateTimeLocal(s.visitScheduledAt) as string
  form.quoteSentAt = toDateTimeLocal(s.quoteSentAt) as string
  form.adminNotes = s.adminNotes ?? null
}

function buildPayload(): ContactSubmissionUpdatePayload {
  const s = submission.value!
  const payload: ContactSubmissionUpdatePayload = {}
  if (form.status !== s.status) payload.status = form.status as ContactSubmission['status']
  if (form.visitAddress !== (s.visitAddress ?? null)) payload.visitAddress = form.visitAddress === '' ? null : form.visitAddress ?? null
  if (form.proposedQuoteAmount !== (s.proposedQuoteAmount ?? null)) payload.proposedQuoteAmount = form.proposedQuoteAmount === '' || form.proposedQuoteAmount == null ? null : Number(form.proposedQuoteAmount)
  if (form.proposedQuoteDescription !== (s.proposedQuoteDescription ?? null)) payload.proposedQuoteDescription = form.proposedQuoteDescription === '' ? null : form.proposedQuoteDescription ?? null
  const formVisitIso = fromDateTimeLocal(form.visitScheduledAt as string)
  const currentVisitIso = s.visitScheduledAt ?? null
  if (formVisitIso !== currentVisitIso) payload.visitScheduledAt = formVisitIso
  const formQuoteIso = fromDateTimeLocal(form.quoteSentAt as string)
  const currentQuoteIso = s.quoteSentAt ?? null
  if (formQuoteIso !== currentQuoteIso) payload.quoteSentAt = formQuoteIso
  if (form.adminNotes !== (s.adminNotes ?? null)) payload.adminNotes = form.adminNotes === '' ? null : form.adminNotes ?? null
  return payload
}

async function save() {
  if (!submission.value || !id.value) return
  const payload = buildPayload()
  if (Object.keys(payload).length === 0) {
    saveSuccess.value = true
    saveError.value = ''
    setTimeout(() => { saveSuccess.value = false }, 2000)
    return
  }
  isSaving.value = true
  saveError.value = ''
  saveSuccess.value = false
  try {
    const res = await adminContactApi.updateContactSubmission(id.value, payload)
    if (res.success && res.data) {
      submission.value = res.data
      syncFormToSubmission(res.data)
      saveSuccess.value = true
      setTimeout(() => { saveSuccess.value = false }, 2000)
    }
  } catch (e: any) {
    const status = e?.response?.status
    const data = e?.response?.data
    if (status === 404) {
      notFound.value = true
      saveError.value = 'Submission not found.'
    } else {
      saveError.value = data?.error || e?.message || 'Failed to save'
    }
  } finally {
    isSaving.value = false
  }
}

watch(
  () => submission.value,
  (s) => {
    if (s) {
      syncFormToSubmission(s)
      form.visitScheduledAt = toDateTimeLocal(s.visitScheduledAt) as string
      form.quoteSentAt = toDateTimeLocal(s.quoteSentAt) as string
    }
  },
  { immediate: true }
)

onMounted(async () => {
  const state = history.state as { submission?: ContactSubmission } | undefined
  if (state?.submission && state.submission.id === id.value) {
    submission.value = state.submission
    loading.value = false
    return
  }
  try {
    const res = await adminContactApi.getContactSubmissions({ page: 1, limit: 100 })
    const list = res.data ?? []
    const found = list.find((s) => s.id === id.value)
    if (found) {
      submission.value = found
    } else {
      notFound.value = true
    }
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>
