<template>
  <AdminLayout>
    <div>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Coupon Management</h1>
        <Button variant="primary" @click="showCreateModal = true">
          Add Coupon
        </Button>
      </div>
      
      <div v-if="isLoading" class="mb-4 flex items-center text-gray-600">
        <LoadingSpinner size="sm" />
        <span class="ml-2">Loading coupons...</span>
      </div>
      
      <div v-if="coupons.length === 0 && !isLoading" class="text-center py-12 border rounded-lg">
        <p class="text-gray-500">No coupons found</p>
      </div>
      
      <DataTable
        v-else
        :columns="columns"
        :data="coupons"
        :actions="true"
        row-key="code"
      >
        <template #cell-discount="{ value, row }">
          <span v-if="row.discountType === 'percentage'">{{ value }}%</span>
          <span v-else>{{ formatPrice(value) }}</span>
        </template>
        <template #cell-status="{ value }">
          <span :class="getStatusClass(value)" class="px-2 py-1 rounded text-xs">
            {{ value }}
          </span>
        </template>
        <template #cell-validFrom="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell-validUntil="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #actions="{ row }">
          <button @click="editCoupon(row)" class="text-primary-600 mr-4">Edit</button>
          <button @click="deleteCoupon(row.code)" class="text-red-600">Delete</button>
        </template>
      </DataTable>
      
      <!-- Create/Edit Coupon Modal -->
      <div
        v-if="showCreateModal || editingCoupon"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">
            {{ editingCoupon ? 'Edit Coupon' : 'Create Coupon' }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <Input
              v-model="form.code"
              label="Coupon Code"
              required
              :disabled="!!editingCoupon"
            />
            <Input
              v-model="form.description"
              label="Description"
            />
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Discount Type</label>
                <select v-model="form.discountType" class="input" required>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <Input
                v-model.number="form.discount"
                type="number"
                label="Discount Value"
                required
                step="0.01"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input
                v-model.number="form.minimumPurchase"
                type="number"
                label="Minimum Purchase"
                step="0.01"
              />
              <Input
                v-model.number="form.maximumDiscount"
                type="number"
                label="Maximum Discount"
                step="0.01"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input
                v-model="form.validFrom"
                type="date"
                label="Valid From"
                required
              />
              <Input
                v-model="form.validUntil"
                type="date"
                label="Valid Until"
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input
                v-model.number="form.usageLimit"
                type="number"
                label="Usage Limit"
                min="0"
              />
              <Input
                v-model.number="form.usageLimitPerUser"
                type="number"
                label="Usage Limit Per User"
                min="0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Status</label>
              <select v-model="form.status" class="input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div class="flex justify-end space-x-4">
              <Button type="button" variant="secondary" @click="closeModal">Cancel</Button>
              <Button type="submit" variant="primary" :loading="isSaving">Save</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { couponsApi } from '@/api/endpoints/coupons'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import AdminLayout from './AdminLayout.vue'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import type { Coupon } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const uiStore = useUIStore()
const isLoading = ref(false)
const isSaving = ref(false)
const coupons = ref<Coupon[]>([])
const showCreateModal = ref(false)
const editingCoupon = ref<Coupon | null>(null)

const columns = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'discount', label: 'Discount', sortable: true },
  { key: 'validFrom', label: 'Valid From', sortable: true },
  { key: 'validUntil', label: 'Valid Until', sortable: true },
  { key: 'usageCount', label: 'Used', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
]

const form = ref({
  code: '',
  description: '',
  discountType: 'percentage' as 'percentage' | 'fixed',
  discount: 0,
  minimumPurchase: 0,
  maximumDiscount: 0,
  validFrom: '',
  validUntil: '',
  usageLimit: 0,
  usageLimitPerUser: 0,
  status: 'active' as 'active' | 'inactive' | 'expired'
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    expired: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const loadCoupons = async () => {
  isLoading.value = true
  try {
    const response = await couponsApi.getCoupons()
    sendToTerminal('log', '[Coupons] API Response:', response)
    
    if (response.success && response.data) {
      coupons.value = Array.isArray(response.data) ? response.data : []
    } else {
      sendToTerminal('warn', '[Coupons] Unexpected response format:', response)
      coupons.value = []
      uiStore.showNotification('error', response.error || 'Failed to load coupons')
    }
  } catch (error) {
    uiStore.showNotification('error', 'Failed to load coupons')
    sendToTerminal('error', '[Coupons] Error loading coupons:', error)
    coupons.value = []
  } finally {
    isLoading.value = false
  }
}

const editCoupon = (coupon: Coupon) => {
  editingCoupon.value = coupon
  form.value = {
    code: coupon.code || '',
    description: coupon.description || '',
    discountType: coupon.discountType || 'percentage',
    discount: coupon.discount || 0,
    minimumPurchase: coupon.minimumPurchase || 0,
    maximumDiscount: coupon.maximumDiscount || 0,
    validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
    validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
    usageLimit: coupon.usageLimit || 0,
    usageLimitPerUser: coupon.usageLimitPerUser || 0,
    status: coupon.status || 'active'
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingCoupon.value = null
  form.value = {
    code: '',
    description: '',
    discountType: 'percentage',
    discount: 0,
    minimumPurchase: 0,
    maximumDiscount: 0,
    validFrom: '',
    validUntil: '',
    usageLimit: 0,
    usageLimitPerUser: 0,
    status: 'active'
  }
}

const handleSubmit = async () => {
  isSaving.value = true
  try {
    let response
    if (editingCoupon.value) {
      response = await couponsApi.updateCoupon(editingCoupon.value.code, form.value)
      sendToTerminal('log', '[Coupons] Update response:', response)
    } else {
      response = await couponsApi.createCoupon(form.value)
      sendToTerminal('log', '[Coupons] Create response:', response)
    }
    
    if (response.success) {
      uiStore.showNotification('success', editingCoupon.value ? 'Coupon updated successfully' : 'Coupon created successfully')
      closeModal()
      await loadCoupons()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to save coupon')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to save coupon')
    sendToTerminal('error', '[Coupons] Error saving coupon:', error)
  } finally {
    isSaving.value = false
  }
}

const deleteCoupon = async (code: string) => {
  if (!confirm('Are you sure you want to delete this coupon?')) return
  
  try {
    const response = await couponsApi.deleteCoupon(code)
    sendToTerminal('log', '[Coupons] Delete response:', response)
    
    if (response.success) {
      uiStore.showNotification('success', 'Coupon deleted successfully')
      await loadCoupons()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete coupon')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete coupon')
    sendToTerminal('error', '[Coupons] Error deleting coupon:', error)
  }
}

onMounted(() => {
  loadCoupons()
})
</script>
